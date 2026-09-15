<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Services are managed as `pages` rows with `type = 'service'`; the standalone
// table was never exposed through the API and only duplicated that content.
return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('services');
    }

    public function down(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title_ro');
            $table->string('title_ru');
            $table->text('excerpt_ro')->nullable();
            $table->text('excerpt_ru')->nullable();
            $table->longText('content_ro')->nullable();
            $table->longText('content_ru')->nullable();
            $table->string('image')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }
};
