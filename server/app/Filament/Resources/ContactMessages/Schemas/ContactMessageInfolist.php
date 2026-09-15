<?php

namespace App\Filament\Resources\ContactMessages\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ContactMessageInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Expeditor')
                    ->columns(3)
                    ->components([
                        TextEntry::make('name')
                            ->label('Nume'),
                        TextEntry::make('email')
                            ->label('E-mail')
                            ->copyable()
                            ->url(fn ($record) => 'mailto:'.$record->email),
                        TextEntry::make('created_at')
                            ->label('Primit la')
                            ->dateTime('d.m.Y H:i'),
                    ]),
                Section::make('Mesaj')
                    ->components([
                        TextEntry::make('message')
                            ->hiddenLabel()
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
