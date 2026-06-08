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
        Schema::table('services', function (Blueprint $table) {
                   $table->dropColumn(['title', 'description']);
                   $table->string('slug')->unique()->after('id');

                           $table->string('title_ro')->after('slug');
                           $table->string('title_ru')->after('title_ro');

                           $table->text('excerpt_ro')->nullable()->after('title_ru');
                           $table->text('excerpt_ru')->nullable()->after('excerpt_ro');

                           $table->longText('content_ro')->nullable()->after('excerpt_ru');
                           $table->longText('content_ru')->nullable()->after('content_ro');

                           $table->boolean('is_active')->default(true)->after('image');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            //
        });
    }
};
