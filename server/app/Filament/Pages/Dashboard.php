<?php

namespace App\Filament\Pages;

use App\Filament\Widgets\MedicalDaysWidget;
use App\Filament\Widgets\PendingEventsWidget;
use App\Filament\Widgets\SiteStatsOverview;
use App\Filament\Widgets\VisitsOverview;
use Filament\Pages\Dashboard as BaseDashboard;

class Dashboard extends BaseDashboard
{
    // Only what needs attention: unread messages, events waiting to be
    // published, and the medical-days calendar.
    public function getWidgets(): array
    {
        return [
            SiteStatsOverview::class,
            VisitsOverview::class, // super admin only (canView)
            PendingEventsWidget::class,
            MedicalDaysWidget::class,
        ];
    }
}
