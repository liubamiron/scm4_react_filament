<?php

namespace App\Policies;

use App\Models\User;

/**
 * Управлять пользователями может только тот, у кого есть право `manage users`
 * (роль admin). Редактор контента (client) раздел «Пользователи» не видит и
 * свой пароль меняет в профиле.
 */
class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('manage users');
    }

    public function view(User $user, User $model): bool
    {
        return $user->can('manage users');
    }

    public function create(User $user): bool
    {
        return $user->can('manage users');
    }

    public function update(User $user, User $model): bool
    {
        return $user->can('manage users');
    }

    // Себя удалить нельзя — иначе можно остаться без единого администратора.
    public function delete(User $user, User $model): bool
    {
        return $user->can('manage users') && $user->isNot($model);
    }

    public function deleteAny(User $user): bool
    {
        return $user->can('manage users');
    }
}
