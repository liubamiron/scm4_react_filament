<?php

namespace App\Filament\Resources\LawDocuments;

use App\Filament\Resources\LawDocuments\Pages\CreateLawDocument;
use App\Filament\Resources\LawDocuments\Pages\EditLawDocument;
use App\Filament\Resources\LawDocuments\Pages\ListLawDocuments;
use App\Filament\Resources\LawDocuments\Schemas\LawDocumentForm;
use App\Filament\Resources\LawDocuments\Tables\LawDocumentsTable;
use App\Models\LawDocument;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

// The public "Legislație" page: a flat, ordered list of acts, each an
// uploaded PDF or a link to the official text.
class LawDocumentResource extends Resource
{
    protected static ?string $model = LawDocument::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedScale;

    protected static ?string $navigationLabel = 'Legislație';

    protected static ?string $modelLabel = 'Act legislativ';

    protected static ?string $pluralModelLabel = 'Legislație';

    protected static ?string $recordTitleAttribute = 'title_ro';

    public static function form(Schema $schema): Schema
    {
        return LawDocumentForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return LawDocumentsTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListLawDocuments::route('/'),
            'create' => CreateLawDocument::route('/create'),
            'edit' => EditLawDocument::route('/{record}/edit'),
        ];
    }
}
