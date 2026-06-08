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
        Schema::create('contacts', function (Blueprint $table) {
                $table->id();
                $table->integer('sort_order')->default(0); // For the "Nr." column
                $table->string('department_ro');           // Secția
                $table->string('department_ru')->nullable();
                $table->string('staff_name_ro');            // Nume / Prenume
                $table->string('staff_name_ru')->nullable();
                $table->string('position_ro')->nullable();  // Ex: "Șef secție"
                $table->string('position_ru')->nullable();
                $table->text('phone_numbers');              // Can store multiple numbers
                $table->timestamps();
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};
