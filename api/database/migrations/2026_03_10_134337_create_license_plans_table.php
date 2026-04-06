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
        Schema::create('license_plans', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('product_id');
            $table->string('name');
            $table->enum('billing_model', ['one_time', 'annual', 'monthly', 'trial']);
            $table->decimal('price', 12, 2);
            $table->integer('max_domains')->default(1);
            $table->integer('validity_days')->default(0);
            $table->integer('grace_period_days')->default(7);
            $table->boolean('allow_domain_transfer')->default(false);
            $table->integer('max_transfer_count')->default(0);
            $table->integer('trial_days')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('license_plans');
    }
};
