<?php

namespace App\Filament\Resources\TransparencyDocuments\Pages;

use App\Filament\Resources\TransparencyDocuments\TransparencyDocumentResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListTransparencyDocuments extends ListRecords
{
    protected static string $resource = TransparencyDocumentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
