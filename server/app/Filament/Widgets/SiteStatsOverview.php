<?php

namespace App\Filament\Widgets;

use App\Models\ContactMessage;
use App\Models\Event;
use App\Models\LawDocument;
use App\Models\Page;
use App\Models\Partner;
use App\Models\TransparencyDocument;
use App\Models\User;
use Carbon\CarbonImmutable;
use Filament\Support\Icons\Heroicon;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class SiteStatsOverview extends StatsOverviewWidget
{
    protected static ?int $sort = 10;

    protected ?string $heading = 'Prezentare generală / Общий обзор';

    protected function getColumns(): int
    {
        return 4;
    }

    protected function getStats(): array
    {
        $today = CarbonImmutable::today();
        $monthAgo = $today->subDays(29);

        $unread = ContactMessage::where('is_read', false)->count();
        $messages30 = ContactMessage::where('created_at', '>=', $monthAgo)->count();
        $events = Event::count();
        $upcomingEvents = Event::whereDate('date', '>=', $today)->count();
        $events30 = Event::where('created_at', '>=', $monthAgo)->count();

        return [
            Stat::make('Mesaje necitite / Непрочитанные', $unread)
                ->description($unread > 0 ? 'Așteaptă răspuns / Ждут ответа' : 'Toate citite / Все прочитаны')
                ->descriptionIcon($unread > 0 ? Heroicon::Clock : Heroicon::CheckCircle)
                ->color($unread > 0 ? 'warning' : 'success'),

            Stat::make('Mesaje (30 zile) / Сообщения (30 дн.)', $messages30)
                ->description('din '.ContactMessage::count().' în total / всего')
                ->descriptionIcon(Heroicon::Envelope)
                ->chart(self::dailyCounts(ContactMessage::query(), $monthAgo, 30))
                ->color('info'),

            Stat::make('Evenimente / События', $events)
                ->description("{$upcomingEvents} viitoare / предстоящих")
                ->descriptionIcon(Heroicon::CalendarDays)
                ->color('primary'),

            Stat::make('Evenimente noi (30 zile)', $events30)
                ->description('adăugate / добавлено за 30 дн.')
                ->descriptionIcon(Heroicon::PlusCircle)
                ->chart(self::dailyCounts(Event::query(), $monthAgo, 30))
                ->color('primary'),

            Stat::make('Pagini / Страницы', Page::count())
                ->descriptionIcon(Heroicon::DocumentText)
                ->description(Page::where('type', 'service')->count().' servicii / услуг'),

            Stat::make('Parteneri / Партнёры', Partner::count())
                ->descriptionIcon(Heroicon::BuildingOffice2)
                ->description('pe site / на сайте'),

            Stat::make('Documente / Документы', TransparencyDocument::count() + LawDocument::count())
                ->descriptionIcon(Heroicon::Scale)
                ->description(TransparencyDocument::count().' transparență · '.LawDocument::count().' legislație'),

            Stat::make('Utilizatori / Пользователи', User::count())
                ->descriptionIcon(Heroicon::Users)
                ->description('cu acces la panou / с доступом'),
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
