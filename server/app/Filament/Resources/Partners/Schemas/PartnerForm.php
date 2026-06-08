<?php

namespace App\Filament\Resources\Partners\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\FileUpload;
use Filament\Schemas\Schema;

class PartnerForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->schema([
                TextInput::make('name')
                    ->label('Nume Partener')
                    ->required()
                    ->columnSpan(1),

                FileUpload::make('logo')
                    ->label('Logo Partener')
                    ->disk('public')
                    ->image()
                    ->directory('partners')
                    ->visibility('public')
                    ->openable()
                    ->downloadable()
                    ->imageEditor()
                    ->required()
                    ->columnSpan(1),

                TextInput::make('link')
                    ->label('Link Website')
                    ->url()
                    ->columnSpanFull(),

                TextInput::make('sort_order')
                    ->numeric()
                    ->default(0)
                    ->columnSpan(1),

                Toggle::make('is_active')
                    ->label('Activ')
                    ->default(true)
                    ->inline(false)
                    ->columnSpan(1),
            ])
            ->columns(2);
    }
}
