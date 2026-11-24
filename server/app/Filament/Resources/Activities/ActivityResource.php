<?php

namespace App\Filament\Resources\Activities;

use App\Filament\Resources\Activities\Pages\ListActivities;
use App\Models\User;
use BackedEnum;
use Filament\Actions\ViewAction;
use Filament\Infolists\Components\KeyValueEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Models\Activity;
use UnitEnum;

// Read-only audit trail: who created / changed / deleted what in the admin.
// Entries are written by the LogsChanges trait on every model.
class ActivityResource extends Resource
{
    protected static ?string $model = Activity::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedClipboardDocumentList;

    protected static string|UnitEnum|null $navigationGroup = 'Setări / Настройки';

    protected static ?string $navigationLabel = 'Activity Log';

    protected static ?string $modelLabel = 'Activitate / Действие';

    protected static ?string $pluralModelLabel = 'Jurnal activitate / Журнал действий';

    protected static ?int $navigationSort = 95;

    public const EVENTS = [
        'created' => 'Creat / Создано',
        'updated' => 'Modificat / Изменено',
        'deleted' => 'Șters / Удалено',
    ];

    public static function canAccess(): bool
    {
        return auth()->user()?->can('view system') ?? false;
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function canEdit(Model $record): bool
    {
        return false;
    }

    public static function canDelete(Model $record): bool
    {
        return false;
    }

    public static function table(Table $table): Table
    {
        return $table
            ->modifyQueryUsing(fn ($query) => $query->with('causer'))
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('created_at')
                    ->label('Data / Дата')
                    ->dateTime('d.m.Y H:i')
                    ->sortable(),
                TextColumn::make('causer.name')
                    ->label('Utilizator / Пользователь')
                    ->placeholder('Sistem / Система')
                    ->searchable(),
                TextColumn::make('event')
                    ->label('Acțiune / Действие')
                    ->badge()
                    ->formatStateUsing(fn (?string $state) => self::EVENTS[$state] ?? $state)
                    ->color(fn (?string $state) => match ($state) {
                        'created' => 'success',
                        'updated' => 'warning',
                        'deleted' => 'danger',
                        default => 'gray',
                    }),
                TextColumn::make('subject_type')
                    ->label('Tip / Тип')
                    ->formatStateUsing(fn (?string $state) => $state ? class_basename($state) : '—'),
                TextColumn::make('subject_label')
                    ->label('Înregistrare / Запись')
                    ->state(fn (Activity $record) => self::subjectLabel($record))
                    ->limit(50)
                    ->wrap(),
                TextColumn::make('changed')
                    ->label('Câmpuri / Поля')
                    ->state(fn (Activity $record) => implode(', ', array_keys($record->properties['attributes'] ?? $record->properties['old'] ?? [])))
                    ->limit(60)
                    ->wrap()
                    ->toggleable(),
            ])
            ->filters([
                SelectFilter::make('event')
                    ->label('Acțiune / Действие')
                    ->options(self::EVENTS),
                SelectFilter::make('subject_type')
                    ->label('Tip / Тип')
                    ->options(fn () => Activity::query()->distinct()->pluck('subject_type')
                        ->filter()
                        ->mapWithKeys(fn ($type) => [$type => class_basename($type)])
                        ->all()),
                // `causer` is a morphTo, which ->relationship() can't query.
                SelectFilter::make('causer_id')
                    ->label('Utilizator / Пользователь')
                    ->options(fn () => User::orderBy('name')->pluck('name', 'id')->all())
                    ->query(fn ($query, array $data) => $query->when(
                        $data['value'] ?? null,
                        fn ($q, $id) => $q->where('causer_type', (new User)->getMorphClass())->where('causer_id', $id),
                    )),
            ])
            ->recordActions([
                ViewAction::make(),
            ]);
    }

    public static function infolist(Schema $schema): Schema
    {
        return $schema->components([
            TextEntry::make('created_at')->label('Data / Дата')->dateTime('d.m.Y H:i:s'),
            TextEntry::make('causer.name')->label('Utilizator / Пользователь')->placeholder('Sistem / Система'),
            TextEntry::make('event')->label('Acțiune / Действие')
                ->formatStateUsing(fn (?string $state) => self::EVENTS[$state] ?? $state),
            TextEntry::make('subject_label')->label('Înregistrare / Запись')
                ->state(fn (Activity $record) => class_basename($record->subject_type ?? '').' · '.self::subjectLabel($record)),
            KeyValueEntry::make('old')->label('Înainte / Было')
                ->state(fn (Activity $record) => self::flatten($record->properties['old'] ?? []))
                ->columnSpanFull(),
            KeyValueEntry::make('new')->label('După / Стало')
                ->state(fn (Activity $record) => self::flatten($record->properties['attributes'] ?? []))
                ->columnSpanFull(),
        ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListActivities::route('/'),
        ];
    }

    /** A human name for the logged record, even after it has been deleted. */
    private static function subjectLabel(Activity $record): string
    {
        $values = $record->subject?->getAttributes()
            ?? $record->properties['old']
            ?? $record->properties['attributes']
            ?? [];

        foreach (['title_ro', 'name_ro', 'name', 'title', 'slug', 'email'] as $key) {
            if (! empty($values[$key]) && is_scalar($values[$key])) {
                return (string) $values[$key];
            }
        }

        return '#'.$record->subject_id;
    }

    /** KeyValueEntry shows strings only; HTML bodies are trimmed to stay readable. */
    private static function flatten(array $values): array
    {
        return collect($values)->map(function ($value) {
            $text = is_scalar($value) || $value === null
                ? (string) $value
                : json_encode($value, JSON_UNESCAPED_UNICODE);

            return str(strip_tags($text))->squish()->limit(300)->toString();
        })->all();
    }
}
