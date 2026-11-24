<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\ApiRequests\ApiRequestResource;
use App\Models\ApiRequest;
use Carbon\CarbonImmutable;
use Filament\Support\Icons\Heroicon;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

// Visit numbers from the API request log. A "visitor" is a distinct IP per
// day — approximate (an office behind one IP counts once). Super admin only.
class VisitsOverview extends StatsOverviewWidget
{
    protected static ?int $sort = 15;

    protected ?string $heading = 'Vizite pe site / Посещения сайта';

    public static function canView(): bool
    {
        return auth()->user()?->can('view system') ?? false;
    }

    protected function getColumns(): int
    {
        return 3;
    }

    protected function getStats(): array
    {
        $from = CarbonImmutable::today()->subDays(29);

        // DATE() + COUNT(DISTINCT) work the same on MySQL (prod) and sqlite (tests).
        $days = ApiRequest::where('created_at', '>=', $from)
            ->selectRaw('DATE(created_at) as day, COUNT(DISTINCT ip) as visitors, COUNT(*) as hits')
            ->groupBy('day')
            ->get()
            ->keyBy('day');

        $series = fn (string $field) => collect(range(0, 29))
            ->map(fn (int $i) => (int) ($days[$from->addDays($i)->toDateString()]->{$field} ?? 0))
            ->all();

        $today = $days[CarbonImmutable::today()->toDateString()] ?? null;
        $unique30 = ApiRequest::where('created_at', '>=', $from)->distinct()->count('ip');
        $url = ApiRequestResource::getUrl('index');

        return [
            Stat::make('Vizitatori azi / Посетители сегодня', (int) ($today->visitors ?? 0))
                ->description('IP-uri unice / уникальные IP')
                ->descriptionIcon(Heroicon::Users)
                ->chart($series('visitors'))
                ->color('primary')
                ->url($url),

            Stat::make('Cereri azi / Запросы сегодня', (int) ($today->hits ?? 0))
                ->description('apeluri API / обращения к API')
                ->descriptionIcon(Heroicon::Signal)
                ->chart($series('hits'))
                ->color('info')
                ->url($url),

            Stat::make('Vizitatori (30 zile) / за 30 дней', $unique30)
                ->description('IP-uri unice / уникальные IP')
                ->descriptionIcon(Heroicon::CalendarDays)
                ->color('success')
                ->url($url),
        ];
    }
}
