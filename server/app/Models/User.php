<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\Concerns\LogsChanges;
use Database\Factories\UserFactory;
use Filament\Auth\MultiFactor\App\Contracts\HasAppAuthentication;
use Filament\Auth\MultiFactor\App\Contracts\HasAppAuthenticationRecovery;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Validation\Rules\Password;
use Spatie\Permission\Traits\HasRoles;

#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'remember_token', 'app_authentication_secret', 'app_authentication_recovery_codes'])]
class User extends Authenticatable implements FilamentUser, HasAppAuthentication, HasAppAuthenticationRecovery
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasRoles, LogsChanges, Notifiable;

    // Роли и права хранятся в таблицах spatie/laravel-permission и создаются
    // миграцией move_user_roles_to_permission_tables.

    /** Полный доступ, включая управление пользователями (право `manage users`). */
    public const ROLE_ADMIN = 'admin';

    /** Заполняет сайт контентом; раздел «Пользователи» ему недоступен. */
    public const ROLE_CLIENT = 'client';

    /** Всё, что admin, плюс системные страницы (право `view system`). */
    public const ROLE_SUPER_ADMIN = 'super_admin';

    public const ROLES = [
        self::ROLE_SUPER_ADMIN => 'Super administrator / Суперадминистратор',
        self::ROLE_ADMIN => 'Administrator / Администратор',
        self::ROLE_CLIENT => 'Editor conținut / Редактор контента',
    ];

    /**
     * Администратору — от 6 символов, редактору контента — от 4.
     */
    public static function passwordRuleFor(?string $role): Password
    {
        return Password::min(in_array($role, [self::ROLE_ADMIN, self::ROLE_SUPER_ADMIN], true) ? 6 : 4);
    }

    /** Роли, которые этот пользователь может выдавать: суперадмина — только суперадмин. */
    public function assignableRoles(): array
    {
        return $this->hasRole(self::ROLE_SUPER_ADMIN)
            ? self::ROLES
            : array_diff_key(self::ROLES, [self::ROLE_SUPER_ADMIN => true]);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'app_authentication_secret' => 'encrypted',
            'app_authentication_recovery_codes' => 'encrypted:array',
        ];
    }

    public function canAccessPanel(Panel $panel): bool
    {
        return $this->hasAnyRole(array_keys(self::ROLES));
    }

    public function getAppAuthenticationSecret(): ?string
    {
        return $this->app_authentication_secret;
    }

    public function saveAppAuthenticationSecret(?string $secret): void
    {
        $this->app_authentication_secret = $secret;
        $this->save();
    }

    public function getAppAuthenticationHolderName(): string
    {
        return $this->email;
    }

    public function getAppAuthenticationRecoveryCodes(): ?array
    {
        return $this->app_authentication_recovery_codes;
    }

    public function saveAppAuthenticationRecoveryCodes(?array $codes): void
    {
        $this->app_authentication_recovery_codes = $codes;
        $this->save();
    }
}
