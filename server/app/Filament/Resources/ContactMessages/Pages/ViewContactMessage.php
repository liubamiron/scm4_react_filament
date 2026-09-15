<?php

namespace App\Filament\Resources\ContactMessages\Pages;

use App\Filament\Resources\ContactMessages\ContactMessageResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\ViewRecord;

class ViewContactMessage extends ViewRecord
{
    protected static string $resource = ContactMessageResource::class;

    // Opening a message is what "reads" it — no separate button needed.
    public function mount(int|string $record): void
    {
        parent::mount($record);

        if (! $this->getRecord()->is_read) {
            $this->getRecord()->update(['is_read' => true]);
        }
    }

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
