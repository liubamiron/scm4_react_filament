<?php

namespace App\Filament\Resources\LawDocuments\Schemas;

use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;

class LawDocumentForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Denumirea actului / Название акта')
                    ->icon('heroicon-o-language')
                    ->schema([
                        Tabs::make('Titluri')
                            ->tabs([
                                Tab::make('RO')
                                    ->schema([
                                        TextInput::make('title_ro')
                                            ->label('Titlu (RO)')
                                            ->required()
                                            ->maxLength(500)
                                            ->placeholder('Ex: Legea nr. 263 din 27.10.2005 cu privire la drepturile pacientului'),
                                    ]),

                                Tab::make('RU')
                                    ->schema([
                                        TextInput::make('title_ru')
                                            ->label('Название (RU)')
                                            ->maxLength(500)
                                            ->placeholder('Опционально'),
                                    ]),
                            ])
                            ->columnSpanFull(),
                    ]),

                Section::make('Document / Документ')
                    ->icon('heroicon-o-document-arrow-up')
                    ->description('Încărcați PDF-ul sau indicați linkul oficial (legis.md). / Загрузите PDF или укажите официальную ссылку.')
                    ->schema([
                        FileUpload::make('file_path')
                            ->label('Fișier PDF')
                            ->disk('public')
                            ->directory('legislatie')
                            ->acceptedFileTypes(['application/pdf'])
                            ->maxSize(20480)
                            ->helperText('Doar PDF (max 20 MB)')
                            ->downloadable()
                            ->preserveFilenames()
                            ->requiredWithout('url')
                            ->hintActions([
                                Action::make('preview')
                                    ->label('Previzualizare')
                                    ->icon('heroicon-o-eye')
                                    ->url(fn ($state) => $state ? asset('storage/'.(is_array($state) ? reset($state) : $state)) : null, true)
                                    ->visible(fn ($state) => filled($state) && ! is_array($state)),
                            ])
                            ->columnSpanFull(),

                        TextInput::make('url')
                            ->label('Link extern')
                            ->url()
                            ->maxLength(1000)
                            ->prefixIcon('heroicon-o-link')
                            ->placeholder('https://www.legis.md/cautare/getResults?doc_id=...')
                            ->helperText('Folosit doar dacă nu este încărcat un PDF.')
                            ->requiredWithout('file_path')
                            ->columnSpanFull(),
                    ]),

                Section::make()
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('sort_order')
                                ->label('Ordine')
                                ->numeric()
                                ->default(0),

                            Toggle::make('is_active')
                                ->label('Activ')
                                ->default(true)
                                ->inline(false),
                        ]),
                    ]),
            ]);
    }
}
