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
        Schema::create('orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('customer_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('plan_id')->constrained('license_plans')->onDelete('cascade');
            $table->decimal('amount', 15, 2);
            $table->string('currency')->default('IDR');
            $table->string('status')->default('pending'); // pending, processing, completed, failed, cancelled
            $table->string('payment_id')->nullable(); // Midtrans transaction ID
            $table->string('payment_method')->nullable();
            $table->json('payment_metadata')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
