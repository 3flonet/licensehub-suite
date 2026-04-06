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
        Schema::table('license_plans', function (Blueprint $blueprint) {
            $blueprint->json('features')->nullable()->after('max_domains');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('license_plans', function (Blueprint $blueprint) {
            $blueprint->dropColumn('features');
        });
    }
};
