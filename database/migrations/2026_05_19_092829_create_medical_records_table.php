<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
public function up(): void
{
    Schema::create('medical_records', function (Blueprint $table) {
        $table->id();

        $table->foreignId('patient_id')
            ->constrained()
            ->cascadeOnDelete();

        $table->foreignId('doctor_id')
            ->constrained()
            ->cascadeOnDelete();

        $table->foreignId('queue_id')
            ->nullable()
            ->constrained()
            ->nullOnDelete();

        $table->text('complaint');

        $table->text('physical_examination');

        $table->text('diagnosis');

        $table->text('medical_treatment');

        $table->date('record_date');

        $table->text('notes')->nullable();

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medical_records');
    }
};
