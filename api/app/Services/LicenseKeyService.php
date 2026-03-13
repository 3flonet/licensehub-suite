<?php

namespace App\Services;

use Illuminate\Support\Str;

class LicenseKeyService
{
    /**
     * Generate a unique license key in format: 3FLO-XXXX-XXXX-XXXX-XXXX
     */
    public static function generate(): string
    {
        do {
            $key = $this->generateKey();
        } while ($this->keyExists($key));

        return $key;
    }

    private function generateKey(): string
    {
        $segments = [];
        for ($i = 0; $i < 4; $i++) {
            $segments[] = Str::upper(Str::random(4));
        }

        return '3FLO-' . implode('-', $segments);
    }

    private function keyExists(string $key): bool
    {
        return \DB::table('licenses')->where('license_key', $key)->exists();
    }

    /**
     * Generate API secret for product
     */
    public static function generateApiSecret(): string
    {
        do {
            $secret = Str::random(40);
        } while (\DB::table('products')->where('api_secret', $secret)->exists());

        return $secret;
    }
}
