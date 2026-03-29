<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnsureSingleSession
{
    /**
     * Compare the session's stored token against the user's current DB token.
     * If they don't match, the user has logged in on another device — force logout here.
     */
    public function handle(Request $request, Closure $next)
    {
        if (Auth::check()) {
            $user = Auth::user();
            $sessionToken = $request->session()->get('session_token');

            // Only logout if we have BOTH tokens and they clearly disagree.
            // If the session token is missing temporarily (timeout/blank), we don't force logout immediately.
            if ($user->session_token && $sessionToken && $sessionToken !== $user->session_token) {
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                if ($request->expectsJson()) {
                    return response()->json([
                        'message' => 'Your session has been terminated because you signed in on another device.',
                        'code'    => 'SESSION_CONFLICT',
                    ], 401);
                }

                return redirect('/login')->with('error', 'You were signed out because your account was accessed from another device.');
            }
        }

        return $next($request);
    }
}
