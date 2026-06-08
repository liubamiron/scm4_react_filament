<?php

namespace App\Filament\Resources\TransparencyDocuments\Pages;

use App\Filament\Resources\TransparencyDocuments\TransparencyDocumentResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditTransparencyDocument extends EditRecord
{
    protected static string $resource = TransparencyDocumentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
