<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Sanctum CSRF seeding
Route::get('sanctum/csrf-cookie', [\Laravel\Sanctum\Http\Controllers\CsrfCookieController::class, 'show']);

// Public Routes
Route::post('login', [App\Http\Controllers\AuthController::class, 'login'])->middleware('throttle:3,1');
Route::get('auth/google/redirect', [App\Http\Controllers\AuthController::class, 'redirectToGoogle']);
Route::get('auth/google/callback', [App\Http\Controllers\AuthController::class, 'handleGoogleCallback']);

// System Boot & Settings
Route::get('boot', [App\Http\Controllers\SystemBootController::class, 'boot']);
Route::get('settings', [App\Http\Controllers\SettingController::class, 'index']);

// Public Thesis Archive Repository
Route::get('public/theses', [App\Http\Controllers\ThesisController::class, 'publicIndex'])->name('theses.publicIndex');

// Image Proxy with S3 to Local fallback
Route::get('images/{filename}', function ($filename) {
    if (env('FILESYSTEM_DISK') === 's3' && \Illuminate\Support\Facades\Storage::disk('s3')->exists($filename)) {
        return \Illuminate\Support\Facades\Storage::disk('s3')->response($filename);
    }
    $localPath = public_path('images/' . $filename);
    if (file_exists($localPath)) {
        return response()->file($localPath);
    }
    abort(404);
})->where('filename', '.*');

// Debug Routes
Route::get('debug-env', function () {
    return response()->json([
        'APP_KEY' => env('APP_KEY') ? 'EXISTS' : 'CRITICAL: MISSING',
        'APP_ENV' => env('APP_ENV'),
        'APP_DEBUG' => env('APP_DEBUG'),
        'DB_CONNECTION' => env('DB_CONNECTION'),
        'DB_HOST' => env('DB_HOST') ? env('DB_HOST') : 'CRITICAL: MISSING',
        'FILESYSTEM_DISK' => env('FILESYSTEM_DISK'),
        'CACHE_STORE' => env('CACHE_STORE'),
        'SESSION_DRIVER' => env('SESSION_DRIVER'),
        'AWS_URL' => env('AWS_URL') ? 'EXISTS' : 'MISSING',
    ]);
});

Route::get('debug-auth', function () {
    $admin = \App\Models\User::where('email', 'admin@admin.com')->first();
    return response()->json([
        'admin_exists' => $admin ? true : false,
        'admin_role' => $admin ? $admin->role?->slug : null,
        'roles_count' => \App\Models\Role::count(),
        'users_count' => \App\Models\User::count(),
        'current_session_driver' => config('session.driver'),
    ]);
});

// Protected API Routes
Route::middleware('auth:sanctum')->group(function () {
    // AuthController
    Route::post('logout', [App\Http\Controllers\AuthController::class, 'logout']);
    Route::get('user', function (\Illuminate\Http\Request $request) {
        return $request->user()->load('profile', 'role');
    });
    
    // ProfileController
    Route::post('profile', [App\Http\Controllers\ProfileController::class, 'update']);
    Route::post('profile/avatar', [App\Http\Controllers\ProfileController::class, 'uploadAvatar']);
    Route::post('profile/account', [App\Http\Controllers\ProfileController::class, 'updateAccount']);
    Route::post('profile/verify-password', [App\Http\Controllers\ProfileController::class, 'verifyPassword']);

    // EducationController
    Route::get('education', [App\Http\Controllers\EducationController::class, 'index']);
    Route::post('education', [App\Http\Controllers\EducationController::class, 'store']);
    Route::put('education/{education}', [App\Http\Controllers\EducationController::class, 'update']);
    Route::delete('education/{education}', [App\Http\Controllers\EducationController::class, 'destroy']);

    // UserController
    Route::get('users', [App\Http\Controllers\UserController::class, 'index']);
    Route::post('users', [App\Http\Controllers\UserController::class, 'store']);
    Route::get('roles', [App\Http\Controllers\UserController::class, 'getRoles']);

    // Thesis Management
    Route::post('theses/bulk-delete', [App\Http\Controllers\ThesisController::class, 'bulkDelete']);
    Route::patch('theses/{thesis}/review', [App\Http\Controllers\ThesisController::class, 'review']);
    Route::patch('theses/{thesis}/publish', [App\Http\Controllers\ThesisController::class, 'publish']);
    Route::patch('theses/{thesis}/toggle-confidential', [App\Http\Controllers\ThesisController::class, 'toggleConfidential']);
    Route::post('theses/{thesis}/download', [App\Http\Controllers\ThesisController::class, 'download']);
    Route::apiResource('theses', App\Http\Controllers\ThesisController::class);

    // Dashboard Analytics
    Route::get('dashboard/analytics', [App\Http\Controllers\DashboardController::class, 'analytics']);

    // System Settings
    Route::post('settings', [App\Http\Controllers\SettingController::class, 'update']);
    
    // Departments & Programs
    Route::apiResource('departments', App\Http\Controllers\DepartmentController::class);
    Route::get('senior-high-programs', [App\Http\Controllers\ProgramController::class, 'seniorHigh']);
    Route::apiResource('programs', App\Http\Controllers\ProgramController::class);

    // Notifications
    Route::get('notifications', [App\Http\Controllers\NotificationController::class, 'index']);
    Route::post('notifications/mark-read', [App\Http\Controllers\NotificationController::class, 'markRead']);
    Route::post('notifications/{id}/mark-read', [App\Http\Controllers\NotificationController::class, 'markOne']);
});
