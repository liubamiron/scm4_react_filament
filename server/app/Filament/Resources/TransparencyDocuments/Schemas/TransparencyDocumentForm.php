<?php

namespace App\Filament\Resources\TransparencyDocuments\Schemas;

use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Actions\Action;

use Filament\Schemas\Schema;

class TransparencyDocumentForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([

                Section::make()
                    ->schema([
                        Grid::make(2)->schema([

                            Select::make('transparency_category_id')
                                ->label('Categorie')
                                ->relationship('category', 'name_ro')
                                ->required()
                                ->preload()
                                ->searchable()
                                ->columnSpan(2),

                            Toggle::make('is_active')
                                ->label('Activ')
                                ->default(true)
                                ->inline(false) // makes it align nicer
                                ->columnSpan(2),
                        ])
                    ]),

                // 🌍 Titles with Tabs
                Section::make('Denumirea documentului')
                    ->icon('heroicon-o-language')
                    ->schema([
                        Tabs::make('Titluri')
                            ->tabs([
                                Tab::make('RO')
                                    ->schema([
                                        TextInput::make('title_ro')
                                            ->label('Titlu (RO)')
                                            ->required()
                                            ->placeholder('Ex: Raport anual 2025'),
                                    ]),

                                Tab::make('RU')
                                    ->schema([
                                        TextInput::make('title_ru')
                                            ->label('Titlu (RU)')
                                            ->placeholder('Опционально'),
                                    ]),
                            ])
                            ->columnSpanFull(),
                    ]),

                // 📎 File Upload with Preview Actions
                Section::make('Fișier document')
                    ->icon('heroicon-o-document-arrow-up')
                    ->schema([
                       FileUpload::make('file_path')
                           ->label('Document PDF')
                           ->disk('public')
                           ->directory('transparency')
                           ->acceptedFileTypes(['application/pdf'])
                           ->maxSize(10240)
                           ->helperText('Acceptă doar PDF (max 10MB)')
                           ->downloadable()
                           ->previewable(true)
                           ->preserveFilenames()
                           ->required()
                           ->hintActions([
                               Action::make('preview')
                                   ->label('Previzualizare')
                                   ->icon('heroicon-o-eye')
                                   ->url(fn ($state) => $state ? asset('storage/' . $state) : null, true)
                                   ->visible(fn ($state) => filled($state))
                           ])
                           ->columnSpanFull()
                    ]),
            ]);
    }
}
