<?php

namespace App\Filament\Resources\TransparencyCategories;

use App\Filament\Resources\TransparencyCategories\Pages\CreateTransparencyCategory;
use App\Filament\Resources\TransparencyCategories\Pages\EditTransparencyCategory;
use App\Filament\Resources\TransparencyCategories\Pages\ListTransparencyCategories;
use App\Filament\Resources\TransparencyCategories\Schemas\TransparencyCategoryForm;
use App\Filament\Resources\TransparencyCategories\Tables\TransparencyCategoriesTable;
use App\Models\TransparencyCategory;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class TransparencyCategoryResource extends Resource
{
    protected static ?string $model = TransparencyCategory::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'content';

    public static function form(Schema $schema): Schema
    {
        return TransparencyCategoryForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return TransparencyCategoriesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListTransparencyCategories::route('/'),
            'create' => CreateTransparencyCategory::route('/create'),
            'edit' => EditTransparencyCategory::route('/{record}/edit'),
        ];
    }
}
