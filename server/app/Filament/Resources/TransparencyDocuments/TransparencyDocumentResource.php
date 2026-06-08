<?php

namespace App\Filament\Resources\TransparencyDocuments;

use App\Filament\Resources\TransparencyDocuments\Pages\CreateTransparencyDocument;
use App\Filament\Resources\TransparencyDocuments\Pages\EditTransparencyDocument;
use App\Filament\Resources\TransparencyDocuments\Pages\ListTransparencyDocuments;
use App\Filament\Resources\TransparencyDocuments\Schemas\TransparencyDocumentForm;
use App\Filament\Resources\TransparencyDocuments\Tables\TransparencyDocumentsTable;
use App\Models\TransparencyDocument;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class TransparencyDocumentResource extends Resource
{
    protected static ?string $model = TransparencyDocument::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'content';

    public static function form(Schema $schema): Schema
    {
        return TransparencyDocumentForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return TransparencyDocumentsTable::configure($table);
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
            'index' => ListTransparencyDocuments::route('/'),
            'create' => CreateTransparencyDocument::route('/create'),
            'edit' => EditTransparencyDocument::route('/{record}/edit'),
        ];
    }
}
