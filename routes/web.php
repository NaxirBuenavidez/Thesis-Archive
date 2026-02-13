<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;

Route::post('/login', [AuthController::class, 'login']);
Route::get('/auth/google/redirect', [AuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);

Route::middleware('auth:web')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/api/user', function (Illuminate\Http\Request $request) {
        return $request->user()->load('profile', 'role', 'educationalBackgrounds');
    });
    
    Route::post('/api/profile', [App\Http\Controllers\ProfileController::class, 'update']);
    Route::post('/api/profile/avatar', [App\Http\Controllers\ProfileController::class, 'uploadAvatar']);
    Route::post('/api/profile/account', [App\Http\Controllers\ProfileController::class, 'updateAccount']);
    Route::post('/api/profile/verify-password', [App\Http\Controllers\ProfileController::class, 'verifyPassword']);

    // Education Routes
    Route::get('/api/education', [App\Http\Controllers\EducationController::class, 'index']);
    Route::post('/api/education', [App\Http\Controllers\EducationController::class, 'store']);
    Route::put('/api/education/{id}', [App\Http\Controllers\EducationController::class, 'update']);
    Route::delete('/api/education/{id}', [App\Http\Controllers\EducationController::class, 'destroy']);

    // User Management Routes
    Route::get('/api/users', [App\Http\Controllers\UserController::class, 'index']);
    Route::post('/api/users', [App\Http\Controllers\UserController::class, 'store']);
    Route::get('/api/roles', [App\Http\Controllers\UserController::class, 'getRoles']);

    // Department & Program Routes
    Route::get('/api/departments', [App\Http\Controllers\DepartmentController::class, 'index']);
    Route::post('/api/departments', [App\Http\Controllers\DepartmentController::class, 'store']);
    Route::put('/api/departments/{id}', [App\Http\Controllers\DepartmentController::class, 'update']);
    Route::delete('/api/departments/{id}', [App\Http\Controllers\DepartmentController::class, 'destroy']);

    Route::get('/api/programs', [App\Http\Controllers\ProgramController::class, 'index']);
    Route::post('/api/programs', [App\Http\Controllers\ProgramController::class, 'store']);
    Route::put('/api/programs/{id}', [App\Http\Controllers\ProgramController::class, 'update']);
    Route::delete('/api/programs/{id}', [App\Http\Controllers\ProgramController::class, 'destroy']);

    Route::get('/api/senior-high-programs', [App\Http\Controllers\SeniorHighProgramController::class, 'index']);
    Route::post('/api/senior-high-programs', [App\Http\Controllers\SeniorHighProgramController::class, 'store']);
    Route::put('/api/senior-high-programs/{id}', [App\Http\Controllers\SeniorHighProgramController::class, 'update']);
    Route::delete('/api/senior-high-programs/{id}', [App\Http\Controllers\SeniorHighProgramController::class, 'destroy']);
});

Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');
