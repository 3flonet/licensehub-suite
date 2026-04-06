<?php

namespace App\Services;

use App\Settings\FonnteSettings;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    /**
     * Send message via Fonnte API
     *
     * @param  string  $target  Target phone number (e.g. 08123456789)
     * @param  string  $message  Message content
     */
    public static function sendMessage(string $target, string $message): bool
    {
        $settings = app(FonnteSettings::class);
        $token = $settings->token ?: config('services.fonnte.token');

        if (! $token) {
            Log::error('Fonnte token is not configured.');

            return false;
        }

        try {
            // Bersihkan nomor dari karakter non-digit (+, -, spasi)
            $cleanNumber = preg_replace('/[^0-9]/', '', $target);

            // Jika nomor dimulai dengan 0, ubah jadi 62
            if (strpos($cleanNumber, '0') === 0) {
                $cleanNumber = '62'.substr($cleanNumber, 1);
            }

            $response = Http::withHeaders([
                'Authorization' => $token,
            ])->post('https://api.fonnte.com/send', [
                'target' => $cleanNumber,
                'message' => $message,
                // countryCode tidak perlu jika nomor sudah lengkap dengan 62
            ]);

            if ($response->successful()) {
                Log::info("WhatsApp message sent to {$target}");

                return true;
            }

            Log::error("Fonnte API error for {$target}: ".$response->body());

            return false;
        } catch (\Exception $e) {
            Log::error("Failed to send WhatsApp message to {$target}: ".$e->getMessage());

            return false;
        }
    }
}
