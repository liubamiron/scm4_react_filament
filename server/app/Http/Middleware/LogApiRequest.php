<?php

namespace App\Http\Middleware;

use App\Models\ApiRequest;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

// Records each API call for the admin "API Requests" page and visit stats.
// The SPA pages are served by nginx without PHP, so API calls are the only
// signal Laravel gets that someone is on the site.
class LogApiRequest
{
    public function handle(Request $request, Closure $next): Response
    {
        return $next($request);
    }

    // Runs after the response has been sent, so it adds no latency.
    public function terminate(Request $request, Response $response): void
    {
        if ($request->isMethod('OPTIONS')) {
            return;
        }

        try {
            ApiRequest::create([
                'ip' => (string) $request->ip(),
                'method' => $request->method(),
                'path' => mb_substr('/'.$request->path(), 0, 500),
                'status' => $response->getStatusCode(),
                'user_agent' => mb_substr((string) $request->userAgent(), 0, 500) ?: null,
            ]);
        } catch (Throwable $e) {
            report($e); // never break the API over statistics
        }
    }
}
