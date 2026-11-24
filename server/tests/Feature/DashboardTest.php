<?php

namespace Tests\Feature;

use App\Filament\Widgets\MedicalDaysWidget;
use App\Filament\Widgets\PendingEventsWidget;
use App\Filament\Widgets\SiteStatsOverview;
use App\Models\Event;
use App\Models\User;
use App\Support\LogReader;
use App\Support\MedicalDays;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_with_widgets_renders(): void
    {
        $admin = User::factory()->create()->assignRole(User::ROLE_ADMIN);
        $this->actingAs($admin);

        Event::create([
            'slug' => 'pending', 'title_ro' => 'Pending', 'description_ro' => 'd', 'content_ro' => 'c',
            'date' => today()->addWeek()->toDateString(), 'is_published' => false,
        ])->update(['title_ro' => 'Pending edited']);

        $this->get('/admin')->assertOk();
        $this->get('/admin/activities')->assertOk();
        $this->get('/admin/events')->assertOk();

        // Widgets are lazy-loaded, so render each one on its own.
        Livewire::test(SiteStatsOverview::class)->assertOk();
        Livewire::test(PendingEventsWidget::class)->assertSee('Pending edited');
        Livewire::test(MedicalDaysWidget::class)->assertSee('Zile importante în medicină');
    }

    public function test_only_admin_can_open_logs(): void
    {
        $admin = User::factory()->create()->assignRole(User::ROLE_ADMIN);
        $client = User::factory()->create()->assignRole(User::ROLE_CLIENT);

        $this->actingAs($admin)->get('/admin/logs')->assertOk();
        $this->actingAs($client)->get('/admin/logs')->assertForbidden();
    }

    public function test_log_reader_parses_entries_newest_first(): void
    {
        $path = tempnam(sys_get_temp_dir(), 'log');
        file_put_contents($path, "cut-off tail\n"
            ."[2026-11-20 10:00:00] production.ERROR: Boom {\"x\":1}\n#0 trace line\n"
            ."[2026-11-20 11:00:00] production.INFO: Hello\n");

        $entries = LogReader::entries($path);
        unlink($path);

        $this->assertCount(2, $entries);
        $this->assertSame('info', $entries[0]['level']);
        $this->assertSame('error', $entries[1]['level']);
        $this->assertSame('#0 trace line', $entries[1]['context']);
    }

    public function test_log_reader_rejects_path_traversal(): void
    {
        $this->assertNull(LogReader::path('../../.env'));
        $this->assertNull(LogReader::path(null));
    }

    public function test_medical_days_resolve_relative_dates_and_wrap_year(): void
    {
        $day = MedicalDays::forYear(2026)->firstWhere('national', true);
        $this->assertSame('2026-10-18', $day['on']->toDateString()); // 3rd Sunday of Oct

        $upcoming = MedicalDays::upcoming(CarbonImmutable::parse('2026-12-15'), 2);
        $this->assertSame('2027-02-04', $upcoming[0]['on']->toDateString());
    }
}
