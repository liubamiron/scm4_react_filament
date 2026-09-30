<?php

namespace Tests\Feature;

use App\Filament\Resources\Users\Pages\CreateUser;
use App\Filament\Resources\Users\Pages\EditUser;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Livewire\Livewire;
use Tests\TestCase;

class UserAccessTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create()->assignRole(User::ROLE_ADMIN);
    }

    private function client(): User
    {
        return User::factory()->create()->assignRole(User::ROLE_CLIENT);
    }

    public function test_admin_and_client_can_open_panel_but_unknown_role_cannot(): void
    {
        $this->actingAs($this->admin())->get('/admin')->assertOk();
        $this->actingAs($this->client())->get('/admin')->assertOk();

        $guest = User::factory()->create();
        $this->actingAs($guest)->get('/admin')->assertForbidden();
    }

    public function test_only_admin_sees_users_section(): void
    {
        $this->actingAs($this->admin())->get('/admin/users')->assertOk();
        $this->actingAs($this->client())->get('/admin/users')->assertForbidden();
        $this->actingAs($this->client())->get('/admin/users/create')->assertForbidden();
    }

    public function test_admin_can_delete_client_but_not_self(): void
    {
        $admin = $this->admin();
        $client = $this->client();

        $this->assertTrue($admin->can('delete', $client));
        $this->assertFalse($admin->can('delete', $admin));
        $this->assertFalse($client->can('delete', $admin));
    }

    public function test_admin_creates_client_with_short_password(): void
    {
        $this->actingAs($this->admin());

        Livewire::test(CreateUser::class)
            ->fillForm([
                'name' => 'Editor',
                'email' => 'editor@example.com',
                'password' => 'abc',
                'role' => User::ROLE_CLIENT,
            ])
            ->call('create')
            ->assertHasFormErrors(['password']);

        Livewire::test(CreateUser::class)
            ->fillForm([
                'name' => 'Editor',
                'email' => 'editor@example.com',
                'password' => 'abcd',
                'role' => User::ROLE_CLIENT,
            ])
            ->call('create')
            ->assertHasNoFormErrors();

        $this->assertTrue(User::firstWhere('email', 'editor@example.com')->hasRole(User::ROLE_CLIENT));
    }

    public function test_admin_role_requires_strong_password(): void
    {
        $this->actingAs($this->admin());

        Livewire::test(CreateUser::class)
            ->fillForm([
                'name' => 'Second admin',
                'email' => 'admin2@example.com',
                'password' => 'abcd',
                'role' => User::ROLE_ADMIN,
            ])
            ->call('create')
            ->assertHasFormErrors(['password']);

        Livewire::test(CreateUser::class)
            ->fillForm([
                'name' => 'Second admin',
                'email' => 'admin2@example.com',
                'password' => 'Str0ngPassword',
                'role' => User::ROLE_ADMIN,
            ])
            ->call('create')
            ->assertHasNoFormErrors();
    }

    public function test_editing_without_password_keeps_old_one(): void
    {
        $this->actingAs($this->admin());
        $client = $this->client();

        Livewire::test(EditUser::class, ['record' => $client->getKey()])
            ->fillForm(['name' => 'Renamed', 'password' => ''])
            ->call('save')
            ->assertHasNoFormErrors();

        $client->refresh();
        $this->assertSame('Renamed', $client->name);
        $this->assertTrue(Hash::check('password', $client->password));
        $this->assertTrue($client->hasRole(User::ROLE_CLIENT));
    }

    public function test_admin_can_promote_client_but_not_change_own_role(): void
    {
        $admin = $this->admin();
        $this->actingAs($admin);
        $client = $this->client();

        Livewire::test(EditUser::class, ['record' => $client->getKey()])
            ->assertFormSet(['role' => User::ROLE_CLIENT])
            ->fillForm(['role' => User::ROLE_ADMIN])
            ->call('save')
            ->assertHasNoFormErrors();

        $this->assertTrue($client->fresh()->hasRole(User::ROLE_ADMIN));

        Livewire::test(EditUser::class, ['record' => $admin->getKey()])
            ->assertFormFieldDisabled('role');
    }
}
