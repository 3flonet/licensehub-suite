<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Re-seed encrypted settings with proper encrypted empty strings
        // so Spatie can decrypt them without error on first load
        $groups = [
            ['group' => 'midtrans', 'name' => 'server_key',   'value' => Crypt::encryptString('')],
            ['group' => 'midtrans', 'name' => 'client_key',   'value' => Crypt::encryptString('')],
            ['group' => 'fonnte',   'name' => 'token',        'value' => Crypt::encryptString('')],
            ['group' => 'mail',     'name' => 'password',     'value' => Crypt::encryptString('')],
        ];

        foreach ($groups as $item) {
            DB::table('settings')
                ->where('group', $item['group'])
                ->where('name', $item['name'])
                ->update(['payload' => json_encode($item['value'])]);
        }
    }

    public function down(): void {}
};
