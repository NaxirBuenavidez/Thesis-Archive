<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This file is the sole entry point for the SPA shell. All API routes
| (auth, data, settings) are defined in routes/api.php under the /api/*
| prefix. Do NOT register API or auth routes here.
|
*/

// S3 → Local image proxy (must be web middleware for session/cookie context)
Route::get('/images/{filename}', function ($filename) {
    // 1. Try S3 first (user-uploaded assets/branding)
    if (env('FILESYSTEM_DISK') === 's3' && \Illuminate\Support\Facades\Storage::disk('s3')->exists($filename)) {
        return \Illuminate\Support\Facades\Storage::disk('s3')->response($filename);
    }

    // 2. Fallback to local public (static system assets)
    $localPath = public_path('images/' . $filename);
    if (file_exists($localPath)) {
        return response()->file($localPath);
    }

    abort(404);
})->where('filename', '.*');

/**
 * SPA catch-all — serves the React shell for every non-API, non-asset route.
 *
 * Boot data is injected as window.__boot_data to eliminate a separate /api/boot
 * round-trip on the first paint, significantly reducing Time to Interactive.
 */
Route::get('/{any}', function (Request $request) {
    try {
        // Load meta (settings, dept, programs, roles) from cache (1h TTL)
        $meta = Cache::remember('system_boot_meta', 3600, function () {
            return [
                'settings'    => \App\Models\Setting::getResolved(),
                'departments' => \App\Models\Department::all(),
                'programs'    => \App\Models\Program::all(),
                'roles'       => \App\Models\Role::all(),
            ];
        });

        $bootData = [
            'settings'      => $meta['settings'],
            'departments'   => $meta['departments'],
            'programs'      => $meta['programs'],
            'roles'         => $meta['roles'],
            'user'          => null,
            'notifications' => [],
            'analytics'     => null,
        ];

        // Authenticated-only data — skip for public routes to save DB queries
        if ($user = $request->user()) {
            $bootData['user'] = $user->load('profile', 'role');
            $bootData['notifications'] = \App\Models\Notification::forUser($user)
                ->orderByDesc('created_at')
                ->take(50)
                ->get();

            if ($user->role && in_array($user->role->slug, ['spadmin', 'program_head'])) {
                $bootData['analytics'] = Cache::get('dashboard_analytics');
            }
        }

        return view('welcome', compact('bootData'));
    } catch (\Throwable $e) {
        // Fallback: serve the SPA shell without boot data rather than returning a 500
        Log::error('[BOOT] Failed to build boot data: ' . $e->getMessage(), [
            'file' => $e->getFile() . ':' . $e->getLine(),
        ]);
        return view('welcome');
    }
})->where('any', '.*');