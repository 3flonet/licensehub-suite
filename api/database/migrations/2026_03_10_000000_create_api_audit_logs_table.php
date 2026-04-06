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
        Schema::create('api_audit_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('endpoint'); // e.g., /licenses/verify
            $table->string('method'); // POST, GET, etc
            $table->string('product_slug')->nullable();
            $table->string('license_key')->nullable();
            $table->string('domain')->nullable();
            $table->string('ip_address')->nullable();
            $table->integer('http_status'); // 200, 422, etc
            $table->string('status'); // 'success', 'invalid', 'revoked', etc
            $table->text('message')->nullable();
            $table->longText('request_payload')->nullable();
            $table->longText('response_data')->nullable();
            $table->timestamps();

            // Indexes for querying
            $table->index('endpoint');
            $table->index('product_slug');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('api_audit_logs');
    }
};
