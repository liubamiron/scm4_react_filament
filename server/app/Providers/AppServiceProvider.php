<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

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
        // Действует и в форме пользователя, и на странице профиля Filament.
        Password::defaults(fn () => Password::min(12)->letters()->mixedCase()->numbers());
    }
}
