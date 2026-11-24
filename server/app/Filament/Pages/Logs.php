<?php

namespace App\Filament\Pages;

use App\Support\LogReader;
use BackedEnum;
use Filament\Pages\Page;
use Filament\Support\Icons\Heroicon;
use Livewire\Attributes\Url;
use UnitEnum;

/**
 * Read-only viewer for storage/logs, so errors on the shared hosting can be
 * checked without SSH. Admin only: logs can contain request data.
 */
class Logs extends Page
{
    private const LIMIT = 200;

    protected string $view = 'filament.pages.logs';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedDocumentMagnifyingGlass;

    protected static string|UnitEnum|null $navigationGroup = 'Setări / Настройки';

    protected static ?string $navigationLabel = 'Log Viewer';

    protected static ?string $title = 'Jurnale de erori / Журналы ошибок';

    protected static ?int $navigationSort = 100;

    #[Url]
    public ?string $file = null;

    #[Url]
    public string $level = '';

    #[Url(as: 'q')]
    public string $search = '';

    public static function canAccess(): bool
    {
        return auth()->user()?->can('manage users') ?? false;
    }

    public function mount(): void
    {
        if (LogReader::path($this->file) === null) {
            $this->file = LogReader::files()[0] ?? null;
        }
        if (! in_array($this->level, LogReader::LEVELS, true)) {
            $this->level = '';
        }
    }

    protected function getViewData(): array
    {
        $path = LogReader::path($this->file);
        $entries = $path ? LogReader::entries($path) : collect();

        $filtered = $entries
            ->when($this->level !== '', fn ($c) => $c->where('level', $this->level))
            ->when(trim($this->search) !== '', fn ($c) => $c->filter(
                fn (array $e) => stripos($e['message'].$e['context'], trim($this->search)) !== false,
            ));

        return [
            'files' => LogReader::files(),
            'levels' => LogReader::LEVELS,
            'counts' => $entries->countBy('level'),
            'total' => $filtered->count(),
            'entries' => $filtered->take(self::LIMIT),
            'limit' => self::LIMIT,
            'size' => $path ? filesize($path) : 0,
        ];
    }
}
