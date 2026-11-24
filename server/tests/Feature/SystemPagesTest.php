<?php

namespace Tests\Feature;

use App\Filament\Resources\ApiRequests\Pages\ListApiRequests;
use App\Filament\Resources\Users\Pages\EditUser;
use App\Filament\Widgets\VisitsOverview;
use App\Models\ApiRequest;
use App\Models\BlockedIp;
use App\Models\Partner;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Spatie\Activitylog\Models\Activity;
use Tests\TestCase;

class SystemPagesTest extends TestCase
{
    use RefreshDatabase;

    private const SYSTEM_PAGES = [
        '/admin/activities',
        '/admin/api-requests',
        '/admin/blocked-ips',
        '/admin/log-viewer',
    ];

    private function userWithRole(string $role): User
    {
        return User::factory()->create()->assignRole($role);
    }

    public function test_only_super_admin_can_open_system_pages(): void
    {
        $super = $this->userWithRole(User::ROLE_SUPER_ADMIN);

        foreach (self::SYSTEM_PAGES as $url) {
            $this->actingAs($super)->get($url)->assertOk();
        }

        foreach ([User::ROLE_ADMIN, User::ROLE_CLIENT] as $role) {
            $user = $this->userWithRole($role);
            foreach (self::SYSTEM_PAGES as $url) {
                $this->actingAs($user)->get($url)->assertForbidden();
            }
        }
    }

    public function test_guests_cannot_open_log_viewer(): void
    {
        $this->get('/admin/log-viewer')->assertForbidden();
        $this->getJson('/admin/log-viewer/api/files')->assertForbidden();
    }

    public function test_settings_menu_and_visits_are_hidden_from_admin(): void
    {
        $this->actingAs($this->userWithRole(User::ROLE_ADMIN));
        $this->get('/admin')->assertOk()
            ->assertDontSee('Setări / Настройки')
            ->assertDontSee('Log Viewer');
        $this->assertFalse(VisitsOverview::canView());

        $this->actingAs($this->userWithRole(User::ROLE_SUPER_ADMIN));
        $this->get('/admin')->assertOk()
            ->assertSee('Setări / Настройки')
            ->assertSee('Log Viewer');
        $this->assertTrue(VisitsOverview::canView());
    }

    public function test_admin_cannot_edit_super_admin_or_grant_the_role(): void
    {
        $admin = $this->userWithRole(User::ROLE_ADMIN);
        $super = $this->userWithRole(User::ROLE_SUPER_ADMIN);
        $client = $this->userWithRole(User::ROLE_CLIENT);

        $this->assertFalse($admin->can('update', $super));
        $this->assertFalse($admin->can('delete', $super));
        $this->assertTrue($super->can('update', $admin));
        $this->assertArrayNotHasKey(User::ROLE_SUPER_ADMIN, $admin->assignableRoles());

        // Even a hand-crafted request can't promote someone.
        $this->actingAs($admin);
        Livewire::test(EditUser::class, ['record' => $client->getRouteKey()])
            ->fillForm(['role' => User::ROLE_SUPER_ADMIN])
            ->call('save')
            ->assertHasFormErrors(['role']);
        $this->assertFalse($client->fresh()->hasRole(User::ROLE_SUPER_ADMIN));
    }

    public function test_api_calls_are_logged_and_counted_as_visits(): void
    {
        $this->getJson('/api/partners', ['User-Agent' => 'TestBrowser'])->assertOk();
        $this->getJson('/api/events')->assertOk();

        $this->assertSame(2, ApiRequest::count());
        $first = ApiRequest::first();
        $this->assertSame('/api/partners', $first->path);
        $this->assertSame(200, $first->status);
        $this->assertSame('TestBrowser', $first->user_agent);

        $this->actingAs($this->userWithRole(User::ROLE_SUPER_ADMIN));
        Livewire::test(VisitsOverview::class)->assertSee('Vizitatori azi');
        Livewire::test(ListApiRequests::class)->assertCanSeeTableRecords(ApiRequest::all());
    }

    public function test_blocked_ip_gets_403_and_unblocking_restores_access(): void
    {
        $blocked = BlockedIp::create(['ip' => '127.0.0.1', 'reason' => 'spam']);

        $this->getJson('/api/partners')->assertForbidden();
        $this->postJson('/api/contact-messages', [])->assertForbidden();
        $this->assertSame(403, ApiRequest::latest('id')->first()->status); // still logged

        $blocked->delete();
        $this->getJson('/api/partners')->assertOk();
    }

    public function test_block_action_on_api_requests_page(): void
    {
        $request = ApiRequest::create(['ip' => '10.0.0.9', 'method' => 'GET', 'path' => '/api/x', 'status' => 200]);

        $this->actingAs($this->userWithRole(User::ROLE_SUPER_ADMIN));
        Livewire::test(ListApiRequests::class)
            ->callTableAction('block', $request, ['reason' => 'scraper']);

        $this->assertTrue(BlockedIp::isBlocked('10.0.0.9'));
    }

    public function test_old_api_requests_are_pruned(): void
    {
        ApiRequest::create(['ip' => '1.1.1.1', 'method' => 'GET', 'path' => '/a', 'status' => 200])
            ->forceFill(['created_at' => now()->subDays(91)])->save();
        ApiRequest::create(['ip' => '1.1.1.1', 'method' => 'GET', 'path' => '/b', 'status' => 200]);

        $this->artisan('model:prune', ['--model' => [ApiRequest::class]])->assertSuccessful();

        $this->assertSame(['/b'], ApiRequest::pluck('path')->all());
    }

    public function test_activity_log_records_who_changed_what(): void
    {
        $super = $this->userWithRole(User::ROLE_SUPER_ADMIN);
        $this->actingAs($super);

        $partner = Partner::create(['name' => 'Original', 'logo' => 'p.png', 'link' => 'https://example.com']);
        $partner->fresh()->update(['name' => 'Renamed']);

        $update = Activity::forSubject($partner)->where('event', 'updated')->first();
        $this->assertTrue($update->causer->is($super));
        $this->assertSame(['name'], array_keys($update->properties['attributes']));
        $this->get('/admin/activities')->assertOk();
    }
}
