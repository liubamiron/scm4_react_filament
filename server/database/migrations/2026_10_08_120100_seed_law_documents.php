<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

// The acts that used to be hand-written links in the `legislatie` page body.
// Their PDFs lived on the old site and are gone, so each now points to the
// official text. The two geriatric orders have no copy online yet: they are
// created inactive and appear on the site once someone uploads the PDF.
return new class extends Migration
{
    public function up(): void
    {
        if (DB::table('law_documents')->exists()) {
            return;
        }

        $legis = fn (int $id) => "https://www.legis.md/cautare/getResults?doc_id={$id}&lang=ro";

        $rows = [
            ['Ordin MS RM nr. 1022 din 30.12.2015 cu privire la organizarea serviciilor de îngrijiri paliative', 'https://www.scribd.com/document/409330933/Ordin-Nr-1022-Din-30-12-2015-Cu-Privire-La-Organizarea-Serviciilor-de-Ingrijiri-Paliative-0'],
            ['Ordin nr. 884 din 30.12.2010 cu privire la aprobarea Standardului Național de Îngrijiri Paliative', 'https://ms.gov.md/wp-content/uploads/2020/06/15097-Ordin20E284962088420din2030.12.201020Cu20privire20la20aprobarea20Standardului20NaC5A3ional20de20C38Engrijiri20Paliative.pdf'],
            ['Standardul Național de Îngrijiri Paliative', 'https://ms.gov.md/wp-content/uploads/2020/06/15098-Standardi20NaC5A3ional20de20C38Engrijiri20Paliative.pdf'],
            ['Ordinul Ministerului Sănătății nr. 619 din 07.09.2010 — Regulamentul de activitate al Centrului Național de Geriatrie și Gerontologie', null],
            ['Ordinul Ministerului Sănătății nr. 602 din 24.07.2015 cu privire la modificarea ordinului nr. 619 din 07.09.2010 cu privire la activitatea serviciului geriatric din RM', null],
            ['Legea nr. 264 din 27.10.2005 cu privire la exercitarea profesiunii de medic', $legis(110649)],
            ['Legea nr. 263 din 27.10.2005 cu privire la drepturile și responsabilitățile pacientului', $legis(133163)],
            ['Legea nr. 133 din 08.07.2011 privind protecția datelor cu caracter personal', $legis(10607)],
            ['Legea nr. 547 din 25.12.2003 a asistenței sociale', $legis(27520)],
            ['Legea nr. 123 din 18.06.2010 cu privire la serviciile sociale', $legis(112516)],
        ];

        $now = now();

        DB::table('law_documents')->insert(array_map(fn ($row, $i) => [
            'title_ro' => $row[0],
            'url' => $row[1],
            'sort_order' => $i + 1,
            'is_active' => $row[1] !== null,
            'created_at' => $now,
            'updated_at' => $now,
        ], $rows, array_keys($rows)));
    }

    public function down(): void
    {
        DB::table('law_documents')->truncate();
    }
};
