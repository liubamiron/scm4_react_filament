<?php

namespace App\Filament\Resources;

use App\Filament\Resources\Page\Pages;
use App\Models\Page;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Forms;
use Filament\Tables;
use Filament\Tables\Table;

// UNIFIED FILAMENT v4 ACTIONS
use Filament\Actions\EditAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\BulkActionGroup;

// SCHEMA LAYOUT COMPONENTS
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;

use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\FileUpload;
use App\Filament\Forms\Components\TinyMceEditor;

class PageResource extends Resource
{
    protected static ?string $model = Page::class;

    public static function form(Schema $schema): Schema
    {
       return $schema
           ->components([

               Forms\Components\Select::make('type')
                   ->options([
                       'general' => '📄 General',
                       'about' => '📋 Despre Noi',
                       'service' => '🏥 Servicii Medicale',
                       'section' => '🏢 Secții',
                       'partnership' => '🤝 Parteneriat',
                       'contact' => '📞 Contact',
                   ])
                   ->default('general')
                   ->live()
                   ->native(false)
                   ->columnSpanFull(),

               Forms\Components\TextInput::make('slug')
                   ->required()
                   ->unique(ignoreRecord: true)
                   ->columnSpanFull(),

               Section::make('Setarile pentru pagina Principala')
                   ->schema([
                       Toggle::make('is_featured')
                           ->label('Arata')
                           ->inline(false),

                       FileUpload::make('image')
                           ->image()
                           ->disk('public')
                           ->directory('pages-thumbnails')
                           ->visibility('public'),
                   ])
                   ->columns(2),

               // Contacts
               Section::make()
                   ->visible(fn (Get $get) => $get('type') === 'contact')
                   ->schema([
                       Repeater::make('contact_list')
                           ->schema([
                               Forms\Components\TextInput::make('nr')
                                   ->numeric(),

                               Forms\Components\TextInput::make('dept_ro')
                                   ->required(),

                               Forms\Components\TextInput::make('dept_ru'),

                               Forms\Components\TextInput::make('name_ro'),

                               Forms\Components\TextInput::make('name_ru'),

                               Forms\Components\Textarea::make('phones')
                                   ->rows(2),
                           ])
                           ->columns(2)
                           ->collapsible(),
                   ]),

               // Multilingual Content
               Tabs::make('Content')
                   ->tabs([
                       Tab::make('RO')
                           ->schema([
                               Forms\Components\TextInput::make('title_ro')
                                   ->required(),

                               TinyMceEditor::make('content_ro')
                                   ->required(),
                           ]),

                       Tab::make('RU')
                           ->schema([
                               Forms\Components\TextInput::make('title_ru')
                                   ->required(),

                               TinyMceEditor::make('content_ru')
                                   ->required(),
                           ]),
                   ])
                   ->columnSpanFull(),
           ]);
    }

   public static function table(Table $table): Table
   {
       return $table
           ->columns([
               Tables\Columns\TextColumn::make('type')->badge(),
               Tables\Columns\TextColumn::make('title_ro')->label('Titlu (RO)'),
               Tables\Columns\TextColumn::make('slug'),
           ])
           ->filters([
               Tables\Filters\SelectFilter::make('type')
                   ->options([
                       'about' => 'Despre Noi',
                       'service' => 'Servicii',
                       'partnership' => 'Parteneriat',
                   ]),
           ])
           ->actions([
               EditAction::make(),
           ])
           ->bulkActions([
               BulkActionGroup::make([
                   DeleteBulkAction::make(),
               ]),
           ]);
   }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPages::route('/'),
            'create' => Pages\CreatePage::route('/create'),
            'edit' => Pages\EditPage::route('/{record}/edit'),
        ];
    }
}
