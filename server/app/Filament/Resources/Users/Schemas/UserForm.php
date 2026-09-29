<?php

namespace App\Filament\Resources\Users\Schemas;

use App\Models\User;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;
use Illuminate\Validation\Rules\Password;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                TextInput::make('email')
                    ->label('Email address')
                    ->email()
                    ->unique(ignoreRecord: true)
                    ->required(),
                DateTimePicker::make('email_verified_at'),
                // При редактировании пустое поле означает «оставить текущий пароль».
                TextInput::make('password')
                    ->label('Parolă / Пароль')
                    ->password()
                    ->revealable()
                    ->rule(Password::default())
                    ->required(fn (string $operation): bool => $operation === 'create')
                    ->dehydrated(fn (?string $state): bool => filled($state)),
                // Свою роль администратор снять не может, чтобы не потерять доступ к пользователям.
                Select::make('role')
                    ->label('Rol / Роль')
                    ->options(User::ROLES)
                    ->default(User::ROLE_CLIENT)
                    ->required()
                    ->selectablePlaceholder(false)
                    // Колонки role нет: роль читается из Spatie и сохраняется через syncRoles.
                    ->afterStateHydrated(function (Select $component, ?User $record): void {
                        if ($record) {
                            $component->state($record->roles->first()?->name);
                        }
                    })
                    ->dehydrated(false)
                    ->saveRelationshipsUsing(fn (User $record, ?string $state) => $record->syncRoles([$state]))
                    ->disabled(fn (?User $record): bool => $record?->is(auth()->user()) ?? false),
            ]);
    }
}
