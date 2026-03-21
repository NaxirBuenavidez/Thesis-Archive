<?php

use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;
use App\Http\Controllers\AuthController;


// Sanctum CSRF seeding — MUST be called before any stateful POST
Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show'])
    ->middleware('web');

// Throttle login to 5 attempts per minute per IP to prevent brute-force
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
Route::get('/auth/google/redirect', [AuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);

// Public settings endpoint - branding always accessible
Route::get('/api/settings', [App\Http\Controllers\SettingController::class, 'index']);

// Public Thesis Archive Repository
Route::get('/api/public/theses', [App\Http\Controllers\ThesisController::class, 'publicIndex']);

// S3 Image Proxy Fallback
Route::get('/images/{filename}', function ($filename) {
    if (env('FILESYSTEM_DISK') === 's3' && \Illuminate\Support\Facades\Storage::disk('s3')->exists($filename)) {
        return \Illuminate\Support\Facades\Storage::disk('s3')->response($filename);
    }
    abort(404);
})->where('filename', '.*');

Route::middleware('auth:web')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/api/user', function (Illuminate\Http\Request $request) {
        return $request->user()->load('profile', 'role');
    });
    
    Route::post('/api/profile', [App\Http\Controllers\ProfileController::class, 'update']);
    Route::post('/api/profile/avatar', [App\Http\Controllers\ProfileController::class, 'uploadAvatar']);
    Route::post('/api/profile/account', [App\Http\Controllers\ProfileController::class, 'updateAccount']);
    Route::post('/api/profile/verify-password', [App\Http\Controllers\ProfileController::class, 'verifyPassword']);

    // Educational Background Routes
    Route::get('/api/education', [App\Http\Controllers\EducationController::class, 'index']);
    Route::post('/api/education', [App\Http\Controllers\EducationController::class, 'store']);
    Route::put('/api/education/{education}', [App\Http\Controllers\EducationController::class, 'update']);
    Route::delete('/api/education/{education}', [App\Http\Controllers\EducationController::class, 'destroy']);

    // User Management Routes
    Route::get('/api/users', [App\Http\Controllers\UserController::class, 'index']);
    Route::post('/api/users', [App\Http\Controllers\UserController::class, 'store']);
    Route::get('/api/roles', [App\Http\Controllers\UserController::class, 'getRoles']);

    // Thesis Management Routes
    Route::apiResource('/api/theses', App\Http\Controllers\ThesisController::class);
    Route::patch('/api/theses/{thesis}/review', [App\Http\Controllers\ThesisController::class, 'review']);
    Route::patch('/api/theses/{thesis}/publish', [App\Http\Controllers\ThesisController::class, 'publish']);
    Route::patch('/api/theses/{thesis}/toggle-confidential', [App\Http\Controllers\ThesisController::class, 'toggleConfidential']);
    Route::post('/api/theses/{thesis}/download', [App\Http\Controllers\ThesisController::class, 'download']);

    // Dashboard Analytics
    Route::get('/api/dashboard/analytics', [App\Http\Controllers\DashboardController::class, 'analytics']);

    // System Settings Routes
    Route::post('/api/settings', [App\Http\Controllers\SettingController::class, 'update']);
    Route::apiResource('/api/departments', App\Http\Controllers\DepartmentController::class);
    Route::get('/api/senior-high-programs', [App\Http\Controllers\ProgramController::class, 'seniorHigh']);
    Route::apiResource('/api/programs', App\Http\Controllers\ProgramController::class);

    // Notification Routes
    Route::get('/api/notifications', [App\Http\Controllers\NotificationController::class, 'index']);
    Route::post('/api/notifications/mark-read', [App\Http\Controllers\NotificationController::class, 'markRead']);
    Route::post('/api/notifications/{id}/mark-read', [App\Http\Controllers\NotificationController::class, 'markOne']);
});


Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');
