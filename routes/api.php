<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| All stateless/JSON API routes live here. Laravel automatically applies
| the "api" middleware group (throttling, JSON responses, Sanctum token
| auth) to every route in this file.
|
*/

// ── CSRF Seeding ────────────────────────────────────────────────────────────
Route::get('sanctum/csrf-cookie', [\Laravel\Sanctum\Http\Controllers\CsrfCookieController::class, 'show']);

// ── Public Auth ─────────────────────────────────────────────────────────────
// throttle:5,1 matches the RateLimiter::tooManyAttempts($key, 5) check in AuthController
Route::post('login', [App\Http\Controllers\AuthController::class, 'login'])->middleware('throttle:5,1');
Route::get('auth/google/redirect', [App\Http\Controllers\AuthController::class, 'redirectToGoogle']);
Route::get('auth/google/callback', [App\Http\Controllers\AuthController::class, 'handleGoogleCallback']);

// ── Public Data ─────────────────────────────────────────────────────────────
Route::get('boot', [App\Http\Controllers\SystemBootController::class, 'boot']);
Route::get('settings', [App\Http\Controllers\SettingController::class, 'index']);
Route::get('public/theses', [App\Http\Controllers\ThesisController::class, 'publicIndex'])->name('theses.publicIndex');

// ── Image Proxy (S3 → Local fallback) ───────────────────────────────────────
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

// ── Protected Routes (Sanctum token auth) ───────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('logout', [App\Http\Controllers\AuthController::class, 'logout']);
    Route::get('user', function (\Illuminate\Http\Request $request) {
        return $request->user()->load('profile', 'role');
    });

    // Profile
    Route::post('profile', [App\Http\Controllers\ProfileController::class, 'update']);
    Route::post('profile/avatar', [App\Http\Controllers\ProfileController::class, 'uploadAvatar']);
    Route::post('profile/account', [App\Http\Controllers\ProfileController::class, 'updateAccount']);
    Route::post('profile/verify-password', [App\Http\Controllers\ProfileController::class, 'verifyPassword']);

    // Education
    Route::get('education', [App\Http\Controllers\EducationController::class, 'index']);
    Route::post('education', [App\Http\Controllers\EducationController::class, 'store']);
    Route::put('education/{education}', [App\Http\Controllers\EducationController::class, 'update']);
    Route::delete('education/{education}', [App\Http\Controllers\EducationController::class, 'destroy']);

    // Users & Roles
    Route::get('users', [App\Http\Controllers\UserController::class, 'index']);
    Route::post('users', [App\Http\Controllers\UserController::class, 'store']);
    Route::get('roles', [App\Http\Controllers\UserController::class, 'getRoles']);

    // Thesis Management (specific routes before apiResource to avoid conflicts)
    Route::post('theses/bulk-delete', [App\Http\Controllers\ThesisController::class, 'bulkDelete']);
    Route::patch('theses/{thesis}/review', [App\Http\Controllers\ThesisController::class, 'review']);
    Route::patch('theses/{thesis}/publish', [App\Http\Controllers\ThesisController::class, 'publish']);
    Route::patch('theses/{thesis}/toggle-confidential', [App\Http\Controllers\ThesisController::class, 'toggleConfidential']);
    Route::post('theses/{thesis}/download', [App\Http\Controllers\ThesisController::class, 'download']);
    Route::apiResource('theses', App\Http\Controllers\ThesisController::class);

    // Dashboard
    Route::get('dashboard/analytics', [App\Http\Controllers\DashboardController::class, 'analytics']);

    // Settings
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
