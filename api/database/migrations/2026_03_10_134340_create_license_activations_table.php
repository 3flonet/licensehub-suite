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
        Schema::create('license_activations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('license_id');
            $table->string('domain');
            $table->string('ip_address')->nullable();
            $table->enum('status', ['active', 'deactivated'])->default('active');
            $table->timestamp('activated_at')->nullable();
            $table->timestamp('last_ping_at')->nullable();
            $table->timestamp('deactivated_at')->nullable();
            $table->timestamps();
            $table->foreign('license_id')->references('id')->on('licenses')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('license_activations');
    }
};
