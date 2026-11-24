<?php

namespace App\Http\Middleware;

use App\Models\BlockedIp;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

// IPs added in admin → "Blocked IPs" get 403 from the whole API (content and
// the contact form). The SPA itself is static and still loads, but empty.
class BlockBlockedIps
{
    public function handle(Request $request, Closure $next): Response
    {
        if (BlockedIp::isBlocked($request->ip())) {
            abort(403);
        }

        return $next($request);
    }
}
