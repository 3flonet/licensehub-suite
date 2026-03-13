<?php

namespace App\Console\Commands;

use App\Settings\FonnteSettings;
use App\Settings\MailSettings;
use App\Settings\MidtransSettings;
use Illuminate\Console\Command;

class SeedSettingsFromEnv extends Command
{
    protected $signature = 'settings:seed-from-env';
    protected $description = 'Seed database settings from .env values';

    public function handle(): void
    {
        // Midtrans
        $midtrans = app(MidtransSettings::class);
        $midtrans->merchant_id   = env('MIDTRANS_MERCHANT_ID', '');
        $midtrans->client_key    = env('MIDTRANS_CLIENT_KEY', '');
        $midtrans->server_key    = env('MIDTRANS_SERVER_KEY', '');
        $midtrans->is_production = (bool) env('MIDTRANS_IS_PRODUCTION', false);
        $midtrans->save();
        $this->info('✅ Midtrans settings saved.');

        // Fonnte
        $fonnte = app(FonnteSettings::class);
        $fonnte->token  = env('FONNTE_TOKEN', '');
        $fonnte->sender = preg_replace('/[^0-9]/', '', env('WHATSAPP_NUMBER', ''));
        $fonnte->save();
        $this->info('✅ Fonnte settings saved.');

        // Mail
        $mail = app(MailSettings::class);
        $mail->host         = env('MAIL_HOST', '127.0.0.1') ?? '';
        $mail->port         = (string)(env('MAIL_PORT', '2525') ?? '2525');
        $mail->username     = env('MAIL_USERNAME', '') ?? '';
        $mail->password     = env('MAIL_PASSWORD', '') ?? '';
        $mail->encryption   = env('MAIL_ENCRYPTION', 'tls') ?? 'tls';
        $mail->from_address = env('MAIL_FROM_ADDRESS', 'no-reply@licensehub.app') ?? '';
        $mail->from_name    = env('MAIL_FROM_NAME', 'LicenseHub') ?? '';
        $mail->save();
        $this->info('✅ Mail settings saved.');

        $this->info('');
        $this->info('All settings have been seeded from .env into the database!');
        $this->info('You can now manage them at: /admin/general-settings');
    }
}
