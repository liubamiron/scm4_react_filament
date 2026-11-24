<?php

namespace App\Filament\Resources\ApiRequests;

use App\Filament\Resources\ApiRequests\Pages\ListApiRequests;
use App\Models\ApiRequest;
use App\Models\BlockedIp;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Model;
use UnitEnum;

// Read-only list of public API calls (written by LogApiRequest). Super admin only.
class ApiRequestResource extends Resource
{
    protected static ?string $model = ApiRequest::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedSignal;

    protected static string|UnitEnum|null $navigationGroup = 'Setări / Настройки';

    protected static ?string $navigationLabel = 'API Requests';

    protected static ?string $modelLabel = 'Cerere API / API-запрос';

    protected static ?string $pluralModelLabel = 'Cereri API / API-запросы';

    protected static ?int $navigationSort = 91;

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
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('created_at')
                    ->label('Data / Дата')
                    ->dateTime('d.m.Y H:i:s')
                    ->sortable(),
                TextColumn::make('ip')
                    ->label('IP')
                    ->searchable()
                    ->copyable()
                    ->badge()
                    ->color(fn (string $state) => BlockedIp::isBlocked($state) ? 'danger' : 'gray'),
                TextColumn::make('method')
                    ->label('Metodă')
                    ->toggleable(),
                TextColumn::make('path')
                    ->label('Adresă / Путь')
                    ->searchable()
                    ->limit(60),
                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (int $state) => match (true) {
                        $state >= 500 => 'danger',
                        $state >= 400 => 'warning',
                        default => 'success',
                    }),
                TextColumn::make('user_agent')
                    ->label('Browser')
                    ->limit(50)
                    ->tooltip(fn (ApiRequest $record) => $record->user_agent)
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Filter::make('today')
                    ->label('Doar azi / Только сегодня')
                    ->query(fn ($query) => $query->where('created_at', '>=', today())),
                SelectFilter::make('status')
                    ->label('Status')
                    ->options([
                        'ok' => '2xx–3xx',
                        'client' => '4xx',
                        'server' => '5xx',
                    ])
                    ->query(fn ($query, array $data) => match ($data['value'] ?? null) {
                        'ok' => $query->where('status', '<', 400),
                        'client' => $query->whereBetween('status', [400, 499]),
                        'server' => $query->where('status', '>=', 500),
                        default => $query,
                    }),
            ])
            ->recordActions([
                Action::make('block')
                    ->label('Blochează / Блок')
                    ->icon(Heroicon::NoSymbol)
                    ->color('danger')
                    ->visible(fn (ApiRequest $record) => ! BlockedIp::isBlocked($record->ip))
                    ->schema([
                        TextInput::make('reason')
                            ->label('Motiv / Причина')
                            ->maxLength(255),
                    ])
                    ->action(function (ApiRequest $record, array $data) {
                        BlockedIp::firstOrCreate(['ip' => $record->ip], ['reason' => $data['reason'] ?? null]);
                        Notification::make()->title("IP {$record->ip} blocat / заблокирован")->success()->send();
                    }),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListApiRequests::route('/'),
        ];
    }
}
