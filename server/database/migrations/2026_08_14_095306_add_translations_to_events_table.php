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
        Schema::table('events', function (Blueprint $table) {
             $table->renameColumn('title', 'title_ro');
                        $table->renameColumn('description', 'description_ro');
                        $table->renameColumn('content', 'content_ro');

                        $table->string('title_ru')->nullable()->after('title_ro');
                        $table->text('description_ru')->nullable()->after('description_ro');
                        $table->longText('content_ru')->nullable()->after('content_ro');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
        {
            Schema::table('events', function (Blueprint $table) {
                $table->dropColumn([
                    'title_ru',
                    'description_ru',
                    'content_ru',
                ]);

                $table->renameColumn('title_ro', 'title');
                $table->renameColumn('description_ro', 'description');
                $table->renameColumn('content_ro', 'content');
            });
        }
};
