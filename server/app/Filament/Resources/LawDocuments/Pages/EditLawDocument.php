<?php

namespace App\Filament\Resources\LawDocuments\Pages;

use App\Filament\Resources\LawDocuments\LawDocumentResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditLawDocument extends EditRecord
{
    protected static string $resource = LawDocumentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
