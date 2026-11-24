<?php

namespace App\Filament\Resources\BlockedIps;

use App\Filament\Resources\BlockedIps\Pages\ManageBlockedIps;
use App\Models\BlockedIp;
use BackedEnum;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use UnitEnum;

// IPs refused by the public API (BlockBlockedIps middleware). Super admin only.
class BlockedIpResource extends Resource
{
    protected static ?string $model = BlockedIp::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedNoSymbol;

    protected static string|UnitEnum|null $navigationGroup = 'Setări / Настройки';

    protected static ?string $navigationLabel = 'Blocked IPs';

    protected static ?string $modelLabel = 'IP blocat / Заблокированный IP';

    protected static ?string $pluralModelLabel = 'IP blocate / Заблокированные IP';

    protected static ?int $navigationSort = 92;

    public static function canAccess(): bool
    {
        return auth()->user()?->can('view system') ?? false;
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('ip')
                ->label('IP')
                ->required()
                ->ip()
                ->unique(ignoreRecord: true)
                // Blocking yourself would also lock you out of the site's API.
                ->notIn(fn () => [request()->ip()])
                ->validationMessages(['not_in' => 'Acesta este IP-ul dvs. / Это ваш IP.']),
            TextInput::make('reason')
                ->label('Motiv / Причина')
                ->maxLength(255),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('ip')->label('IP')->searchable()->copyable(),
                TextColumn::make('reason')->label('Motiv / Причина')->placeholder('—')->wrap(),
                TextColumn::make('created_at')->label('Blocat la / Заблокирован')->dateTime('d.m.Y H:i')->sortable(),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make()->label('Deblochează / Разблокировать'),
            ])
            ->toolbarActions([
                DeleteBulkAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageBlockedIps::route('/'),
        ];
    }
}
