<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

/**
 * Super admin: everything admin can do, plus the system pages (API requests,
 * blocked IPs, log viewer, visit stats) via the `view system` permission.
 * Nobody gets the role here — assign it with
 * `php artisan permission:assign-role super_admin <user id>`.
 */
return new class extends Migration
{
    public function up(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $viewSystem = Permission::findOrCreate('view system', 'web');
        $manageUsers = Permission::findOrCreate('manage users', 'web');
        Role::findOrCreate('super_admin', 'web')->givePermissionTo([$manageUsers, $viewSystem]);

        // Every API call, for visit counts and spotting abusive IPs. Pruned
        // after 90 days (ApiRequest::prunable) since IPs are personal data.
        Schema::create('api_requests', function (Blueprint $table) {
            $table->id();
            $table->string('ip', 45)->index();
            $table->string('method', 10);
            $table->string('path', 500);
            $table->unsignedSmallInteger('status');
            $table->string('user_agent', 500)->nullable();
            $table->timestamp('created_at')->index();
        });

        Schema::create('blocked_ips', function (Blueprint $table) {
            $table->id();
            $table->string('ip', 45)->unique();
            $table->string('reason')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('blocked_ips');
        Schema::dropIfExists('api_requests');

        Role::where('name', 'super_admin')->delete();
        Permission::where('name', 'view system')->delete();
        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
};
