<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:web')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/api/user', function (Illuminate\Http\Request $request) {
        return $request->user();
    });
});

Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');
