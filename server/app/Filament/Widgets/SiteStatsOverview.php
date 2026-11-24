<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\ContactMessages\ContactMessageResource;
use App\Models\ContactMessage;
use Carbon\CarbonImmutable;
use Filament\Support\Icons\Heroicon;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class SiteStatsOverview extends StatsOverviewWidget
{
    protected static ?int $sort = 10;

    protected function getColumns(): int
    {
        return 2;
    }

    protected function getStats(): array
    {
        $unread = ContactMessage::where('is_read', false)->count();
        $pending = PendingEventsWidget::pendingQuery()->count();

        return [
            Stat::make('Mesaje necitite / Непрочитанные', $unread)
                ->description($unread > 0 ? 'Așteaptă răspuns / Ждут ответа' : 'Toate citite / Все прочитаны')
                ->descriptionIcon($unread > 0 ? Heroicon::Clock : Heroicon::CheckCircle)
                ->color($unread > 0 ? 'warning' : 'success')
                ->url(ContactMessageResource::getUrl('index')),

            Stat::make('Evenimente nepublicate / Неопубликованные события', $pending)
                ->description($pending > 0 ? 'Așteaptă aprobare / Ждут одобрения' : 'Nimic în așteptare / Ничего не ждёт')
                ->descriptionIcon($pending > 0 ? Heroicon::Clock : Heroicon::CheckCircle)
                ->color($pending > 0 ? 'warning' : 'success'),
        ];
    }

    /**
     * Records created per day over $days days starting at $from. Grouped in
     * PHP so it works the same on MySQL (prod) and sqlite (tests).
     *
     * @return list<int>
     */
    public static function dailyCounts($query, CarbonImmutable $from, int $days): array
    {
        $byDay = $query->where('created_at', '>=', $from)
            ->pluck('created_at')
            ->countBy(fn ($at) => $at->format('Y-m-d'));

        return collect(range(0, $days - 1))
            ->map(fn (int $i) => $byDay[$from->addDays($i)->format('Y-m-d')] ?? 0)
            ->all();
    }
}
