<?php

namespace App\Filament\Resources\Services\Schemas;

use App\Filament\Forms\Components\TinyMceEditor;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;

class ServiceForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Tabs::make('Languages')
                    ->tabs([
                        Tab::make('RO')
                            ->label('Română')
                            ->icon('heroicon-o-language')
                            ->schema([
                                TextInput::make('title_ro')
                                    ->label('Titlu')
                                    ->required(),

                                Textarea::make('excerpt_ro')
                                    ->label('Descriere scurtă')
                                    ->rows(4),

                                TinyMceEditor::make('content_ro')
                                    ->label('Conținut')
                                    ->columnSpanFull(),
                            ]),

                        Tab::make('RU')
                            ->label('Русский')
                            ->icon('heroicon-o-language')
                            ->schema([
                                TextInput::make('title_ru')
                                    ->label('Заголовок')
                                    ->required(),

                                Textarea::make('excerpt_ru')
                                    ->label('Краткое описание')
                                    ->rows(4),

                                TinyMceEditor::make('content_ru')
                                    ->label('Содержание')
                                    ->columnSpanFull(),
                            ]),
                    ])
                    ->columnSpanFull(),

                TextInput::make('slug')
                    ->label('Slug')
                    ->required()
                    ->unique(ignoreRecord: true),

                FileUpload::make('image')
                    ->label('Imagine')
                    ->image()
                    ->disk('public')
                    ->directory('services')
                    ->visibility('public')
                    ->imageEditor(),

                Toggle::make('is_active')
                    ->label('Activ')
                    ->default(true),
            ]);
    }
}
