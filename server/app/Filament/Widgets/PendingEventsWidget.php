<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\Events\EventResource;
use App\Models\Event;
use Filament\Actions\Action;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;
use Illuminate\Database\Eloquent\Builder;

// Upcoming events saved as hidden, waiting for someone to publish them.
class PendingEventsWidget extends TableWidget
{
    protected static ?int $sort = 20;

    protected int|string|array $columnSpan = 'full';

    public static function pendingQuery(): Builder
    {
        return Event::query()
            ->where('is_published', false)
            ->whereDate('date', '>=', today());
    }

    public function table(Table $table): Table
    {
        return $table
            ->heading('Evenimente în așteptarea publicării / События, ожидающие публикации')
            ->query(fn () => self::pendingQuery()->orderBy('date'))
            ->columns([
                ImageColumn::make('image')
                    ->label(''),
                TextColumn::make('title_ro')
                    ->label('Titlu / Заголовок')
                    ->wrap(),
                TextColumn::make('date')
                    ->label('Data / Дата')
                    ->date('d.m.Y'),
            ])
            ->recordActions([
                Action::make('publish')
                    ->label('Publică / Опубликовать')
                    ->icon(Heroicon::Eye)
                    ->color('success')
                    ->requiresConfirmation()
                    ->action(fn (Event $record) => $record->update(['is_published' => true])),
                Action::make('edit')
                    ->label('Editează / Изменить')
                    ->icon(Heroicon::PencilSquare)
                    ->url(fn (Event $record) => EventResource::getUrl('edit', ['record' => $record])),
            ])
            ->emptyStateHeading('Niciun eveniment în așteptare / Нет ожидающих событий')
            ->emptyStateIcon(Heroicon::CheckCircle)
            ->paginated(false);
    }
}
