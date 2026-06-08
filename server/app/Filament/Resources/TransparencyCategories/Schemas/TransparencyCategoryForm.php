<?php

namespace App\Filament\Resources\TransparencyCategories\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class TransparencyCategoryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
                    ->components([
                        TextInput::make('name_ro')
                            ->label('Nume Categorie (RO)')
                            ->required()
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn ($state, $set) => $set('slug', Str::slug($state)))
                            ->columnSpan(1),

                        TextInput::make('name_ru')
                            ->label('Nume Categorie (RU)')
                            ->columnSpan(1),

                        TextInput::make('slug')
                            ->label('Slug (URL)')
                            ->required()
                            ->unique('transparency_categories', 'slug', ignoreRecord: true)
                            ->columnSpan(1),

                        TextInput::make('sort_order')
                            ->label('Ordine')
                            ->numeric()
                            ->default(0)
                            ->required()
                            ->columnSpan(1),
                    ])
                    ->columns(2);
    }
}
