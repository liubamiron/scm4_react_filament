<?php

namespace App\Filament\Widgets;

use App\Models\ContactMessage;
use Carbon\CarbonImmutable;
use Filament\Widgets\ChartWidget;

class MessagesChart extends ChartWidget
{
    protected static ?int $sort = 20;

    protected ?string $heading = 'Mesaje primite (ultimele 30 zile) / Сообщения за 30 дней';

    protected ?string $maxHeight = '260px';

    protected function getData(): array
    {
        $from = CarbonImmutable::today()->subDays(29);

        return [
            'datasets' => [
                [
                    'label' => 'Mesaje / Сообщения',
                    'data' => SiteStatsOverview::dailyCounts(ContactMessage::query(), $from, 30),
                    'borderColor' => '#0ea5e9',
                    'backgroundColor' => 'rgba(14, 165, 233, 0.15)',
                    'fill' => true,
                    'tension' => 0.35,
                ],
            ],
            'labels' => collect(range(0, 29))
                ->map(fn (int $i) => $from->addDays($i)->format('d.m'))
                ->all(),
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }

    protected function getOptions(): array
    {
        return [
            'plugins' => ['legend' => ['display' => false]],
            'scales' => ['y' => ['beginAtZero' => true, 'ticks' => ['precision' => 0]]],
        ];
    }
}
