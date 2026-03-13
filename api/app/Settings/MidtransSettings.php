<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class MidtransSettings extends Settings
{
    public string $merchant_id;
    public string $client_key;
    public string $server_key;
    public bool $is_production;

    public static function group(): string
    {
        return 'midtrans';
    }

    public static function encrypted(): array
    {
        return [
            'server_key',
            'client_key',
        ];
    }
}
