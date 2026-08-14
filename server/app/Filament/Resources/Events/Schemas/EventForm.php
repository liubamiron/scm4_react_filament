<?php

namespace App\Filament\Resources\Events\Schemas;

use App\Filament\Forms\Components\TinyMceEditor;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class EventForm
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
                                    ->required()
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(fn ($state, $set) => $set('slug', Str::slug($state))),

                                TinyMceEditor::make('description_ro')
                                    ->label('Descriere')
                                    ->required()
                                    ->columnSpanFull(),

                                TinyMceEditor::make('content_ro')
                                    ->label('Conținut')
                                    ->required()
                                    ->columnSpanFull(),
                            ]),

                        Tab::make('RU')
                            ->label('Русский')
                            ->icon('heroicon-o-language')
                            ->schema([
                                TextInput::make('title_ru')
                                    ->label('Заголовок'),

                                TinyMceEditor::make('description_ru')
                                    ->label('Описание')
                                    ->columnSpanFull(),

                                TinyMceEditor::make('content_ru')
                                    ->label('Содержание')
                                    ->columnSpanFull(),
                            ]),
                    ])
                    ->columnSpanFull(),

                TextInput::make('slug')
                    ->label('Slug (URL)')
                    ->required()
                    ->unique('events', 'slug', ignoreRecord: true),

                DatePicker::make('date')
                    ->label('Data evenimentului')
                    ->required(),

                FileUpload::make('image')
                    ->label('Imagine')
                    ->image()
                    ->disk('public')
                    ->directory('events')
                    ->visibility('public')
                    ->imageEditor(),
            ]);
    }
}
