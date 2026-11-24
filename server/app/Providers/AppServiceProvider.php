<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Opcodes\LogViewer\Facades\LogViewer;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Страница профиля Filament: требования зависят от роли вошедшего пользователя.
        // В форме пользователя правило берётся по выбранной роли (UserForm).
        Password::defaults(fn () => User::passwordRuleFor(
            auth()->user()?->hasAnyRole([User::ROLE_ADMIN, User::ROLE_SUPER_ADMIN]) ? User::ROLE_ADMIN : User::ROLE_CLIENT
        ));

        // /admin/log-viewer (opcodesio/log-viewer) — super admin only.
        LogViewer::auth(fn ($request) => $request->user()?->can('view system') ?? false);
    }
}
