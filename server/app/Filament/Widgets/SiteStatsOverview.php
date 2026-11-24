<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\ContactMessages\ContactMessageResource;
use App\Models\ContactMessage;
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
}
