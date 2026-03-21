<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\RateLimiter;

class AuthController extends Controller
{
    /**
     * Handle an authentication attempt.
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        $throttleKey = Str::transliterate(Str::lower($request->input('email')).'|'.$request->ip());

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            $minutes = ceil($seconds / 60);
            
            throw ValidationException::withMessages([
                'email' => ["Too many login attempts. Please try again in {$minutes} minutes."],
            ]);
        }

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $user = Auth::user()->load('role');
            
            // Restricted Login: Only admin, client, and spadmin can enter the system
            $allowedRoles = ['admin', 'client', 'spadmin'];
            if (!$user->role || !in_array($user->role->slug, $allowedRoles)) {
                Auth::logout();
                throw ValidationException::withMessages([
                    'email' => ['Your account does not have permission to access this system.'],
                ]);
            }

            RateLimiter::clear($throttleKey);

            $request->session()->regenerate();

            // ── Single-session enforcement ──────────────────────────────────
            // Generate a new unique token, write it to the DB, and store it
            // in the current session. EnsureSingleSession middleware will
            // compare these on every request and kick out any older session.
            $token = Str::uuid()->toString();
            Auth::user()->update(['session_token' => $token]);
            $request->session()->put('session_token', $token);
            // ────────────────────────────────────────────────────────────────

            return response()->json([
                'message' => 'Login successful',
                'user'    => Auth::user()->load('role', 'profile'),
            ]);
        }

        RateLimiter::hit($throttleKey, 60 * 5); // Lock out for 5 minutes after 5 failed attempts

        throw ValidationException::withMessages([
            'email' => ['The provided credentials do not match our records.'],
        ]);
    }

    /**
     * Log the user out of the application.
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logout successful']);
    }

    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (\Exception $e) {
            return redirect('/login?error=Unable to login with Google');
        }

        $user = User::where('email', $googleUser->getEmail())->first();

        if ($user) {
            $user->update([
                'google_id' => $googleUser->getId(),
            ]);

            $profile = $user->profile()->firstOrCreate(['user_id' => $user->id]);
            if (empty($profile->avatar)) {
                $profile->update(['avatar' => $googleUser->getAvatar()]);
            }

            Auth::login($user);

            return redirect('/');
        }

        return redirect('/login?error=Account not found. Please contact administrator.');
    }
}
