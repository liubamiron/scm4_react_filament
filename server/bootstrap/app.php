<?php

use App\Http\Middleware\BlockBlockedIps;
use App\Http\Middleware\LogApiRequest;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\HandleCors;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        apiPrefix: 'api',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // No statefulApi(): the API is public and read-only, and making it
        // stateful started a database-backed session on every browser request.
        $middleware->append(HandleCors::class);

        // Logged first so blocked (403) attempts show up on "API Requests" too.
        $middleware->prependToGroup('api', [
            LogApiRequest::class,
            BlockBlockedIps::class,
        ]);

        // There is no app-wide `login` route; send any `auth`-guarded guest to Filament.
        $middleware->redirectGuestsTo('/admin/login');
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
