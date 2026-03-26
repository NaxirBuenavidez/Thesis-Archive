<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Models\Department;
use App\Models\Program;
use App\Models\Role;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SystemBootController extends Controller
{
    /**
     * Handle the system boot request.
     * Consolidates settings, departments, programs, and roles into a single cached response.
     */
    public function boot(Request $request)
    {
        // 1. Fetch Shared Meta Data (Consolidated Cache)
        $meta = Cache::remember('system_boot_meta', 3600, function () {
            return [
                'settings'    => Setting::getResolved(),
                'departments' => Department::all(),
                'programs'    => Program::all(),
                'roles'       => Role::all(),
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

        // 2. Fetch User-Specific Data
        if ($user = $request->user()) {
            $bootData['user'] = $user->load('profile', 'role');
            
            $bootData['notifications'] = Notification::forUser($user)
                ->orderByDesc('created_at')
                ->take(50)
                ->get();
                
            // For admin dashboard, optionally pre-load analytics
            if ($user->role && in_array($user->role->slug, ['spadmin', 'program_head'])) {
               $bootData['analytics'] = Cache::get('dashboard_analytics');
            }
        }

        return response()->json($bootData);
    }

    /**
     * Clear the consolidated boot cache.
     * Should be called when settings, departments, programs, or roles are updated.
     */
    public static function clearCache()
    {
        Cache::forget('system_boot_meta');
        Cache::forget('system_settings');
        Cache::forget('system_departments');
        Cache::forget('system_programs');
        Cache::forget('system_roles');
    }
}
