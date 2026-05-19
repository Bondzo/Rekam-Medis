<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
public function up(): void
{
    Schema::create('payments', function (Blueprint $table) {
        $table->id();

        $table->foreignId('medical_record_id')
            ->constrained()
            ->cascadeOnDelete();

        $table->decimal('admin_fee', 12, 2)->default(0);

        $table->decimal('doctor_fee', 12, 2)->default(0);

        $table->decimal('medicine_fee', 12, 2)->default(0);

        $table->decimal('total_payment', 12, 2);

        $table->enum('payment_method', [
            'cash',
            'transfer',
            'qris'
        ]);

        $table->date('payment_date');

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
