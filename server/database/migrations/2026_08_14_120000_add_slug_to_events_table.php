<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->string('slug')->nullable()->after('id');
        });

        // Existing rows predate the column, so derive a slug from the Romanian
        // title and disambiguate collisions with the id.
        $used = [];

        foreach (DB::table('events')->select('id', 'title_ro')->get() as $event) {
            $slug = Str::slug($event->title_ro) ?: 'eveniment';

            if (isset($used[$slug])) {
                $slug = "{$slug}-{$event->id}";
            }

            $used[$slug] = true;

            DB::table('events')->where('id', $event->id)->update(['slug' => $slug]);
        }

        Schema::table('events', function (Blueprint $table) {
            $table->string('slug')->nullable(false)->change();
            $table->unique('slug');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropUnique(['slug']);
            $table->dropColumn('slug');
        });
    }
};
