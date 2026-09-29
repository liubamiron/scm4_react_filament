<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

/**
 * Роли переезжают из колонки users.role в таблицы spatie/laravel-permission.
 * Колонка удаляется, чтобы у роли был один источник правды.
 */
return new class extends Migration
{
    public function up(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $manageUsers = Permission::findOrCreate('manage users', 'web');
        Role::findOrCreate('admin', 'web')->givePermissionTo($manageUsers);
        Role::findOrCreate('client', 'web');

        $userClass = config('auth.providers.users.model');

        DB::table('users')->whereIn('role', ['admin', 'client'])->get(['id', 'role'])
            ->each(fn ($row) => $userClass::find($row->id)->assignRole($row->role));

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('client');
        });

        $userClass = config('auth.providers.users.model');

        foreach (['client', 'admin'] as $role) {
            $userClass::role($role)->get()->each(fn ($user) => DB::table('users')
                ->where('id', $user->id)->update(['role' => $role]));
        }

        Role::whereIn('name', ['admin', 'client'])->delete();
        Permission::where('name', 'manage users')->delete();
        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
};
