<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            if (!Schema::hasColumn('payments', 'snap_token')) {
                $table->text('snap_token')->nullable()->after('status');
            }

            if (!Schema::hasColumn('payments', 'midtrans_order_id')) {
                $table->string('midtrans_order_id')->nullable()->unique()->after('snap_token');
            }
        });

        if (DB::getDriverName() === 'mysql') {
            DB::statement(
                "ALTER TABLE payments MODIFY payment_method ENUM('cash', 'transfer', 'qris', 'midtrans') NOT NULL"
            );
        }
    }

    public function down(): void
    {
        if (DB::getDriverName() === 'mysql') {
            DB::statement(
                "ALTER TABLE payments MODIFY payment_method ENUM('cash', 'transfer', 'qris') NOT NULL"
            );
        }
    }
};
