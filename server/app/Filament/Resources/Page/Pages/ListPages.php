<?php

namespace App\Filament\Resources\Page\Pages;

use App\Filament\Resources\PageResource;
use App\Models\Page;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Schemas\Components\Tabs\Tab;
use Illuminate\Database\Eloquent\Builder;

class ListPages extends ListRecords
{
    protected static string $resource = PageResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }

    // One tab per page type, so editors filter by category with a click.
    public function getTabs(): array
    {
        $counts = Page::query()
            ->selectRaw('type, count(*) as total')
            ->groupBy('type')
            ->pluck('total', 'type');

        $tabs = [
            'all' => Tab::make('Toate / Все')->badge($counts->sum()),
        ];

        foreach (PageResource::TYPES as $type => $label) {
            $tabs[$type] = Tab::make($label)
                ->badge($counts[$type] ?? 0)
                ->modifyQueryUsing(fn (Builder $query) => $query->where('type', $type));
        }

        return $tabs;
    }
}
