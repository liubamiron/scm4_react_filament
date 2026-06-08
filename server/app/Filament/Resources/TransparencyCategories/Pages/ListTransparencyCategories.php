<?php

namespace App\Filament\Resources\TransparencyCategories\Pages;

use App\Filament\Resources\TransparencyCategories\TransparencyCategoryResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListTransparencyCategories extends ListRecords
{
    protected static string $resource = TransparencyCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
