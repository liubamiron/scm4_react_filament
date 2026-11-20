<?php

namespace App\Filament\Widgets;

use App\Support\MedicalDays;
use Carbon\CarbonImmutable;
use Filament\Widgets\Widget;

// Calendar of important health days (current + next year) on the dashboard.
class MedicalDaysWidget extends Widget
{
    protected string $view = 'filament.widgets.medical-days';

    protected int|string|array $columnSpan = 'full';

    protected static ?int $sort = 40;

    protected function getViewData(): array
    {
        $today = CarbonImmutable::today();

        return [
            'today' => $today,
            'upcoming' => MedicalDays::upcoming($today, 4),
            'years' => [
                $today->year => MedicalDays::forYear($today->year),
                $today->year + 1 => MedicalDays::forYear($today->year + 1),
            ],
        ];
    }
}
