<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('law_documents', function (Blueprint $table) {
            $table->id();
            $table->string('title_ro', 500);
            $table->string('title_ru', 500)->nullable();
            // A document is either an uploaded PDF or a link to the official
            // text (legis.md, ms.gov.md); the form requires one of the two.
            $table->string('file_path')->nullable();
            $table->string('url', 1000)->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('law_documents');
    }
};
