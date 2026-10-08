<?php

namespace App\Filament\Resources\LawDocuments\Pages;

use App\Filament\Resources\LawDocuments\LawDocumentResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListLawDocuments extends ListRecords
{
    protected static string $resource = LawDocumentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
