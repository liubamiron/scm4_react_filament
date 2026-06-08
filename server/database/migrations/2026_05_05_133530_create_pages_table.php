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
       Schema::create('pages', function (Blueprint $table) {
               $table->id();
               $table->string('type'); // 'about', 'service', etc.
               $table->string('slug')->unique();

               // Multilingual Content
               $table->string('title_ro');
               $table->text('content_ro');
               $table->string('title_ru')->nullable();
               $table->text('content_ru')->nullable();

               $table->timestamps();
           });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pages');
    }
};
