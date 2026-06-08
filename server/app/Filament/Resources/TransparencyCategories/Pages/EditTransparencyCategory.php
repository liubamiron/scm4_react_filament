<?php

namespace App\Filament\Resources\TransparencyCategories\Pages;

use App\Filament\Resources\TransparencyCategories\TransparencyCategoryResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditTransparencyCategory extends EditRecord
{
    protected static string $resource = TransparencyCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
