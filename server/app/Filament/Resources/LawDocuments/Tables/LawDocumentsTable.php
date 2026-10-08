<?php

namespace App\Filament\Resources\LawDocuments\Tables;

use App\Models\LawDocument;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class LawDocumentsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->columns([
                TextColumn::make('sort_order')
                    ->label('#')
                    ->sortable(),
                TextColumn::make('title_ro')
                    ->label('Titlu')
                    ->wrap()
                    ->searchable(),
                TextColumn::make('source')
                    ->label('Sursă')
                    ->state(fn (LawDocument $record) => $record->file_path ? 'PDF' : ($record->url ? 'Link' : '—'))
                    ->icon(fn (string $state) => match ($state) {
                        'PDF' => 'heroicon-o-document-text',
                        'Link' => 'heroicon-o-link',
                        default => 'heroicon-o-exclamation-triangle',
                    })
                    ->color(fn (string $state) => $state === '—' ? 'danger' : 'gray')
                    ->badge(),
                IconColumn::make('is_active')
                    ->label('Activ')
                    ->boolean(),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
