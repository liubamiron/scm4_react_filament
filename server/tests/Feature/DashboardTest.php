<?php

namespace Tests\Feature;

use App\Filament\Widgets\MedicalDaysWidget;
use App\Filament\Widgets\PendingEventsWidget;
use App\Filament\Widgets\SiteStatsOverview;
use App\Models\Event;
use App\Models\User;
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
        $this->get('/admin/events')->assertOk();

        // Widgets are lazy-loaded, so render each one on its own.
        Livewire::test(SiteStatsOverview::class)->assertOk();
        Livewire::test(PendingEventsWidget::class)->assertSee('Pending edited');
        Livewire::test(MedicalDaysWidget::class)->assertSee('Zile importante în medicină');
    }

    public function test_medical_days_resolve_relative_dates_and_wrap_year(): void
    {
        $day = MedicalDays::forYear(2026)->firstWhere('national', true);
        $this->assertSame('2026-10-18', $day['on']->toDateString()); // 3rd Sunday of Oct

        $upcoming = MedicalDays::upcoming(CarbonImmutable::parse('2026-12-15'), 2);
        $this->assertSame('2027-02-04', $upcoming[0]['on']->toDateString());
    }
}
