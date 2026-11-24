{{-- The panel has no custom Tailwind theme, so utility classes would not be compiled: styles are scoped below. --}}
<x-filament-panels::page>
    <style>
        .lg-bar { display: flex; flex-wrap: wrap; gap: .75rem; align-items: center; }
        .lg-bar select, .lg-bar input { border: 1px solid rgb(209 213 219); border-radius: .5rem; padding: .4rem .6rem; font-size: .875rem; background: transparent; color: inherit; }
        .lg-bar input { flex: 1 1 14rem; }
        .lg-meta { font-size: .8rem; color: rgb(107 114 128); }
        .lg-list { display: grid; gap: .5rem; }
        .lg-entry { border: 1px solid rgb(229 231 235); border-radius: .6rem; padding: .6rem .8rem; font-size: .82rem; }
        .lg-entry > summary { cursor: pointer; display: flex; gap: .6rem; align-items: baseline; list-style: none; }
        .lg-entry > summary::-webkit-details-marker { display: none; }
        .lg-date { flex: none; color: rgb(107 114 128); font-variant-numeric: tabular-nums; }
        .lg-msg { overflow-wrap: anywhere; }
        .lg-lvl { flex: none; font-size: .68rem; font-weight: 700; text-transform: uppercase; border-radius: 999px; padding: .05rem .5rem; background: rgb(229 231 235); color: rgb(55 65 81); }
        .lg-lvl.emergency, .lg-lvl.alert, .lg-lvl.critical, .lg-lvl.error { background: rgb(254 226 226); color: rgb(153 27 27); }
        .lg-lvl.warning { background: rgb(254 243 199); color: rgb(146 64 14); }
        .lg-lvl.notice, .lg-lvl.info { background: rgb(219 234 254); color: rgb(30 64 175); }
        .lg-ctx { margin-top: .5rem; max-height: 24rem; overflow: auto; font-size: .75rem; white-space: pre; background: rgb(249 250 251); border-radius: .4rem; padding: .6rem; }
        .dark .lg-bar select, .dark .lg-bar input { border-color: rgb(255 255 255 / .15); }
        .dark .lg-bar option { background: rgb(24 24 27); }
        .dark .lg-entry { border-color: rgb(255 255 255 / .1); }
        .dark .lg-lvl { background: rgb(255 255 255 / .1); color: rgb(212 212 216); }
        .dark .lg-lvl.emergency, .dark .lg-lvl.alert, .dark .lg-lvl.critical, .dark .lg-lvl.error { background: rgb(239 68 68 / .2); color: rgb(252 165 165); }
        .dark .lg-lvl.warning { background: rgb(245 158 11 / .2); color: rgb(252 211 77); }
        .dark .lg-lvl.notice, .dark .lg-lvl.info { background: rgb(59 130 246 / .2); color: rgb(147 197 253); }
        .dark .lg-ctx { background: rgb(255 255 255 / .04); }
    </style>

    @if (empty($files))
        <x-filament::section>Nu există fișiere de jurnal / Файлов журнала нет.</x-filament::section>
    @else
        <x-filament::section>
            <div class="lg-bar">
                <select wire:model.live="file" aria-label="Fișier / Файл">
                    @foreach ($files as $name)
                        <option value="{{ $name }}">{{ $name }}</option>
                    @endforeach
                </select>
                <select wire:model.live="level" aria-label="Nivel / Уровень">
                    <option value="">Toate nivelurile / Все уровни</option>
                    @foreach ($levels as $lvl)
                        <option value="{{ $lvl }}">{{ $lvl }} ({{ $counts[$lvl] ?? 0 }})</option>
                    @endforeach
                </select>
                <input type="search" wire:model.live.debounce.400ms="search" placeholder="Caută / Поиск…">
            </div>
            <div class="lg-meta" style="margin-top:.6rem">
                {{ number_format($size / 1024, 0, ',', ' ') }} KB ·
                {{ $total }} înregistrări / записей
                @if ($total > $limit)
                    · se afișează ultimele {{ $limit }} / показаны последние {{ $limit }}
                @endif
            </div>
        </x-filament::section>

        <div class="lg-list">
            @forelse ($entries as $entry)
                <details class="lg-entry" wire:key="{{ $loop->index }}-{{ $entry['date'] }}">
                    <summary>
                        <span class="lg-date">{{ $entry['date'] }}</span>
                        <span class="lg-lvl {{ $entry['level'] }}">{{ $entry['level'] }}</span>
                        <span class="lg-msg">{{ \Illuminate\Support\Str::limit($entry['message'], 300) }}</span>
                    </summary>
                    @if (strlen($entry['message']) > 300 || $entry['context'] !== '')
                        <div class="lg-ctx">{{ $entry['message'] }}@if ($entry['context'] !== '')

{{ $entry['context'] }}@endif</div>
                    @endif
                </details>
            @empty
                <x-filament::section>Nimic găsit / Ничего не найдено.</x-filament::section>
            @endforelse
        </div>
    @endif
</x-filament-panels::page>
