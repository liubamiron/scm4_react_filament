<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            // Where the page is listed. Both off → reachable by URL only.
            $table->boolean('show_in_header')->default(true)->after('image');
            $table->boolean('show_in_footer')->default(true)->after('show_in_header');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->dropColumn(['show_in_header', 'show_in_footer']);
        });
    }
};
