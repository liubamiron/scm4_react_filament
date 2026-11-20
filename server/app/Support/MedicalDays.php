<?php

namespace App\Support;

use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

/**
 * The most important health awareness days marked in the Republic of
 * Moldova: main WHO/international days plus national professional days.
 *
 * `date` is either a fixed "MM-DD" or a relative strtotime phrase without
 * the year ("third sunday of october"), resolved for each year.
 */
class MedicalDays
{
    public const DAYS = [
        ['date' => '02-04', 'ro' => 'Ziua Mondială de Luptă împotriva Cancerului', 'ru' => 'Всемирный день борьбы против рака'],
        ['date' => 'last day of february', 'ro' => 'Ziua Bolilor Rare', 'ru' => 'День редких заболеваний'],
        ['date' => '03-24', 'ro' => 'Ziua Mondială de Luptă împotriva Tuberculozei', 'ru' => 'Всемирный день борьбы с туберкулёзом'],
        ['date' => '04-07', 'ro' => 'Ziua Mondială a Sănătății', 'ru' => 'Всемирный день здоровья'],
        ['date' => '04-24', 'ro' => 'Săptămâna Europeană a Imunizării (24–30 aprilie)', 'ru' => 'Европейская неделя иммунизации (24–30 апреля)'],
        ['date' => '05-05', 'ro' => 'Ziua Mondială a Igienei Mâinilor', 'ru' => 'Всемирный день гигиены рук'],
        ['date' => '05-12', 'ro' => 'Ziua Internațională a Asistentului Medical', 'ru' => 'Международный день медицинской сестры'],
        ['date' => '05-17', 'ro' => 'Ziua Mondială a Hipertensiunii Arteriale', 'ru' => 'Всемирный день борьбы с артериальной гипертонией'],
        ['date' => '05-31', 'ro' => 'Ziua Mondială fără Tutun', 'ru' => 'Всемирный день без табака'],
        ['date' => '06-01', 'ro' => 'Ziua Internațională a Ocrotirii Copiilor', 'ru' => 'Международный день защиты детей'],
        ['date' => '06-14', 'ro' => 'Ziua Mondială a Donatorului de Sânge', 'ru' => 'Всемирный день донора крови'],
        ['date' => '07-28', 'ro' => 'Ziua Mondială de Luptă împotriva Hepatitei', 'ru' => 'Всемирный день борьбы с гепатитом'],
        ['date' => '09-17', 'ro' => 'Ziua Mondială a Siguranței Pacientului', 'ru' => 'Всемирный день безопасности пациентов'],
        ['date' => '09-29', 'ro' => 'Ziua Mondială a Inimii', 'ru' => 'Всемирный день сердца'],
        ['date' => '10-10', 'ro' => 'Ziua Mondială a Sănătății Mintale', 'ru' => 'Всемирный день психического здоровья'],
        ['date' => 'third sunday of october', 'ro' => 'Ziua Lucrătorului Medical și Farmaceutic (Republica Moldova)', 'ru' => 'День медицинского и фармацевтического работника (Республика Молдова)', 'national' => true],
        ['date' => '10-29', 'ro' => 'Ziua Mondială de Luptă împotriva Accidentului Vascular Cerebral', 'ru' => 'Всемирный день борьбы с инсультом'],
        ['date' => '11-14', 'ro' => 'Ziua Mondială de Luptă împotriva Diabetului', 'ru' => 'Всемирный день борьбы с диабетом'],
        ['date' => '11-18', 'ro' => 'Săptămâna Mondială de Conștientizare a Rezistenței Antimicrobiene (18–24 noiembrie)', 'ru' => 'Всемирная неделя осведомлённости о противомикробной резистентности (18–24 ноября)'],
        ['date' => '12-01', 'ro' => 'Ziua Mondială de Luptă împotriva HIV/SIDA', 'ru' => 'Всемирный день борьбы со СПИДом'],
    ];

    /** Every day resolved to its date in the given year, sorted by date. */
    public static function forYear(int $year): Collection
    {
        return collect(self::DAYS)
            ->map(fn (array $day) => [...$day, 'on' => self::resolve($day['date'], $year)])
            ->sortBy('on')
            ->values();
    }

    /** The next $limit days on or after $from, wrapping into next year. */
    public static function upcoming(CarbonImmutable $from, int $limit): Collection
    {
        $from = $from->startOfDay();

        return self::forYear($from->year)
            ->concat(self::forYear($from->year + 1))
            ->filter(fn (array $day) => $day['on']->gte($from))
            ->take($limit)
            ->values();
    }

    private static function resolve(string $date, int $year): CarbonImmutable
    {
        if (preg_match('/^\d{2}-\d{2}$/', $date)) {
            return CarbonImmutable::createFromFormat('!Y-m-d', "{$year}-{$date}");
        }

        return CarbonImmutable::parse("{$date} {$year}")->startOfDay();
    }
}
