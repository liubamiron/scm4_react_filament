<?php

namespace App\Filament\Widgets;

use App\Models\Event;
use Carbon\CarbonImmutable;
use Filament\Widgets\ChartWidget;

class EventsPerMonthChart extends ChartWidget
{
    protected static ?int $sort = 30;

    protected ?string $heading = 'Evenimente pe lună (12 luni) / События по месяцам';

    protected ?string $maxHeight = '260px';

    protected function getData(): array
    {
        $from = CarbonImmutable::today()->startOfMonth()->subMonths(11);

        $byMonth = Event::whereDate('date', '>=', $from)
            ->whereDate('date', '<=', $from->addMonths(12))
            ->pluck('date')
            ->countBy(fn ($date) => $date->format('Y-m'));

        $months = collect(range(0, 11))->map(fn (int $i) => $from->addMonths($i));

        return [
            'datasets' => [
                [
                    'label' => 'Evenimente / События',
                    'data' => $months->map(fn ($m) => $byMonth[$m->format('Y-m')] ?? 0)->all(),
                    'backgroundColor' => '#f59e0b',
                    'borderRadius' => 4,
                ],
            ],
            'labels' => $months->map(fn ($m) => $m->locale('ro')->translatedFormat('M Y'))->all(),
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }

    protected function getOptions(): array
    {
        return [
            'plugins' => ['legend' => ['display' => false]],
            'scales' => ['y' => ['beginAtZero' => true, 'ticks' => ['precision' => 0]]],
        ];
    }
}
