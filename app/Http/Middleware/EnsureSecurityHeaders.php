<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureSecurityHeaders
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Classic headers
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Force HTTPS for 1 year (only meaningful over HTTPS, safe to include)
        $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

        // Disable sensitive browser features
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()');

        // Content Security Policy
        // In local dev, also allow the Vite dev server host so HMR and assets aren't blocked.
        $viteHost = config('app.vite_dev_server_url', env('VITE_DEV_SERVER_URL', ''));
        $isDev    = app()->environment('local', 'development');

        $scriptSrc = "'self' 'unsafe-inline' 'unsafe-eval'";
        $styleSrc  = "'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.bunny.net";
        $fontSrc   = "'self' https://fonts.gstatic.com https://fonts.bunny.net data:";
        $connectSrc = "'self' ws: wss:";

        $host = request()->getHost();
        $scriptSrc  .= " http://localhost:* https://localhost:* http://127.0.0.1:* http://{$host}:* https://{$host}:*";
        $styleSrc   .= " http://localhost:* https://localhost:* http://127.0.0.1:* http://{$host}:* https://{$host}:*";
        $connectSrc .= " http://localhost:* https://localhost:* ws://localhost:* wss://localhost:* http://127.0.0.1:* ws://{$host}:* wss://{$host}:*";

        $csp = implode('; ', [
            "default-src 'self'",
            "script-src {$scriptSrc}",
            "style-src {$styleSrc}",
            "font-src {$fontSrc}",
            "img-src 'self' data: blob: https: http:",   // Allow logo uploads + Google avatars
            "connect-src {$connectSrc}",
            "frame-src 'self' data: blob: https: http:",
            "frame-ancestors 'self'",
            "base-uri 'self'",
            "form-action 'self'",
        ]);
        $response->headers->set('Content-Security-Policy', $csp);

        // Prevent caching of authenticated responses
        if ($request->is('api/*') || $request->is('login') || $request->is('logout')) {
            $response->headers->set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
            $response->headers->set('Pragma', 'no-cache');
        }

        return $response;
    }
}
