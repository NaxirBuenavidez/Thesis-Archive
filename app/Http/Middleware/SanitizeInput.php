<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SanitizeInput
{
    /**
     * The attributes that should not be sanitized.
     *
     * @var array<int, string>
     */
    protected $except = [
        'password',
        'password_confirmation',
        'current_password',
    ];

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $input = $request->all();

        if (!empty($input)) {
            $request->merge($this->sanitize($input));
        }

        return $next($request);
    }

    /**
     * Recursively sanitize the input data.
     */
    protected function sanitize(array $data): array
    {
        foreach ($data as $key => $value) {
            if (in_array($key, $this->except, true)) {
                continue;
            }

            if (is_array($value)) {
                $data[$key] = $this->sanitize($value);
            } elseif (is_string($value)) {
                // 1. Strip HTML tags
                $clean = strip_tags($value);
                
                // 2. Normalize whitespace (replace multiple spaces/newlines with a single space)
                // This matches the logic found in ThesisController
                $clean = preg_replace('/\s+/', ' ', $clean);
                
                // 3. Trim
                $data[$key] = trim($clean);
            }
        }

        return $data;
    }
}
