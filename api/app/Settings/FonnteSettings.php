<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class FonnteSettings extends Settings
{
    public string $token;

    public string $sender;

    public static function group(): string
    {
        return 'fonnte';
    }

    public static function encrypted(): array
    {
        return [
            'token',
        ];
    }
}
