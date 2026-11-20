{{-- The panel has no custom Tailwind theme, so utility classes here would not be compiled: styles are scoped below. --}}
<x-filament-widgets::widget>
    <style>
        .md-cal { display: grid; gap: 1.25rem; }
        .md-head { display: flex; align-items: center; gap: .5rem; font-weight: 600; font-size: 1rem; }
        .md-sub { font-size: .8rem; color: rgb(107 114 128); margin-top: .15rem; }
        .md-next { display: grid; gap: .75rem; grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr)); }
        .md-card { border: 1px solid rgb(229 231 235); border-radius: .75rem; padding: .85rem 1rem; display: flex; gap: .85rem; align-items: flex-start; }
        .md-card.is-today { border-color: rgb(245 158 11); background: rgb(255 251 235); }
        .md-date { flex: none; width: 3.1rem; text-align: center; border-radius: .5rem; background: rgb(254 243 199); color: rgb(146 64 14); padding: .3rem 0; line-height: 1.1; }
        .md-date b { display: block; font-size: 1.25rem; }
        .md-date span { font-size: .7rem; text-transform: uppercase; letter-spacing: .03em; }
        .md-name { font-weight: 600; font-size: .875rem; line-height: 1.3; }
        .md-ru { font-size: .78rem; color: rgb(107 114 128); line-height: 1.3; margin-top: .15rem; }
        .md-in { font-size: .75rem; color: rgb(217 119 6); font-weight: 600; margin-top: .3rem; }
        .md-years { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(22rem, 1fr)); }
        .md-year > summary { cursor: pointer; font-weight: 600; font-size: .9rem; padding: .5rem 0; }
        .md-table { width: 100%; font-size: .82rem; border-collapse: collapse; }
        .md-table td { padding: .45rem .5rem; border-top: 1px solid rgb(243 244 246); vertical-align: top; }
        .md-table td:first-child { white-space: nowrap; color: rgb(107 114 128); width: 1%; }
        .md-table tr.is-past td { opacity: .45; }
        .md-badge { display: inline-block; font-size: .68rem; font-weight: 600; border-radius: 999px; padding: .05rem .45rem; margin-left: .3rem; background: rgb(219 234 254); color: rgb(30 64 175); }
        .dark .md-card { border-color: rgb(255 255 255 / .1); }
        .dark .md-card.is-today { background: rgb(245 158 11 / .1); }
        .dark .md-date { background: rgb(245 158 11 / .15); color: rgb(252 211 77); }
        .dark .md-table td { border-color: rgb(255 255 255 / .06); }
        .dark .md-badge { background: rgb(59 130 246 / .2); color: rgb(147 197 253); }
    </style>

    <x-filament::section>
        <div class="md-cal">
            <div>
                <div class="md-head">
                    <x-filament::icon icon="heroicon-o-calendar-days" style="width:1.25rem;height:1.25rem;color:rgb(217 119 6)" />
                    Zile importante în medicină / Важные дни в медицине
                </div>
                <div class="md-sub">Următoarele zile de sănătate marcate în Republica Moldova / Ближайшие даты</div>
            </div>

            <div class="md-next">
                @foreach ($upcoming as $day)
                    @php($diff = (int) $today->diffInDays($day['on']))
                    <div @class(['md-card', 'is-today' => $diff === 0])>
                        <div class="md-date">
                            <b>{{ $day['on']->format('d') }}</b>
                            <span>{{ $day['on']->locale('ro')->translatedFormat('M') }}</span>
                        </div>
                        <div>
                            <div class="md-name">{{ $day['ro'] }}</div>
                            <div class="md-ru">{{ $day['ru'] }}</div>
                            <div class="md-in">
                                @if ($diff === 0)
                                    Astăzi / Сегодня
                                @elseif ($diff === 1)
                                    Mâine / Завтра
                                @else
                                    peste {{ $diff }} zile / через {{ $diff }} дн.
                                @endif
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>

            <div class="md-years">
                @foreach ($years as $year => $days)
                    <details class="md-year" @if ($loop->first) open @endif>
                        <summary>Calendar {{ $year }}</summary>
                        <table class="md-table">
                            @foreach ($days as $day)
                                <tr @class(['is-past' => $day['on']->lt($today)])>
                                    <td>{{ $day['on']->locale('ro')->translatedFormat('d M, D') }}</td>
                                    <td>
                                        {{ $day['ro'] }}
                                        @if ($day['national'] ?? false)
                                            <span class="md-badge">MD</span>
                                        @endif
                                        <div class="md-ru">{{ $day['ru'] }}</div>
                                    </td>
                                </tr>
                            @endforeach
                        </table>
                    </details>
                @endforeach
            </div>
        </div>
    </x-filament::section>
</x-filament-widgets::widget>
