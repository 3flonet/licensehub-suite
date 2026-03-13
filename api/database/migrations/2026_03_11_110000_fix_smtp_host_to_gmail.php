<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Update mail host to Gmail SMTP (usable with App Password)
        DB::table('settings')
            ->where('group', 'mail')
            ->where('name', 'host')
            ->update(['payload' => json_encode('smtp.gmail.com')]);

        DB::table('settings')
            ->where('group', 'mail')
            ->where('name', 'port')
            ->update(['payload' => json_encode('587')]);

        DB::table('settings')
            ->where('group', 'mail')
            ->where('name', 'encryption')
            ->update(['payload' => json_encode('tls')]);
    }

    public function down(): void {}
};
