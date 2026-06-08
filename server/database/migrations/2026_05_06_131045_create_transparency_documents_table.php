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
        Schema::create('transparency_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transparency_category_id')->constrained()->cascadeOnDelete();
            $table->string('title_ro');
            $table->string('title_ru')->nullable();
            $table->string('file_path');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transparency_documents');
    }
};
