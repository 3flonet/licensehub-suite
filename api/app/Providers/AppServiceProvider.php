<?php

namespace App\Providers;

use App\Models\License;
use App\Observers\LicenseObserver;
use App\Settings\FonnteSettings;
use App\Settings\MailSettings;
use App\Settings\MidtransSettings;
use Illuminate\Support\ServiceProvider;
use Illuminate\Auth\Notifications\ResetPassword;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     * Overrides config values from database-stored settings at runtime.
     */
    public function boot(): void
    {
        License::observe(LicenseObserver::class);

        ResetPassword::createUrlUsing(function (object $notifiable, string $token) {
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
            return $frontendUrl . '/reset-password?token=' . $token . '&email=' . urlencode($notifiable->getEmailForPasswordReset());
        });

        // Only attempt to load settings if the table exists (prevents crash in CI/testing)
        try {
            if (!\Illuminate\Support\Facades\Schema::hasTable('settings')) {
                return;
            }
        } catch (\Throwable $e) {
            return;
        }

        try {
            // ── Midtrans Dynamic Settings ─────────────────────
            $midtrans = app(MidtransSettings::class);
            if (!empty($midtrans->server_key)) {
                config([
                    'services.midtrans.merchant_id'   => $midtrans->merchant_id,
                    'services.midtrans.client_key'    => $midtrans->client_key,
                    'services.midtrans.server_key'    => $midtrans->server_key,
                    'services.midtrans.is_production' => $midtrans->is_production,
                ]);
            }

            // ── Fonnte Dynamic Settings ───────────────────────
            $fonnte = app(FonnteSettings::class);
            if (!empty($fonnte->token)) {
                config([
                    'services.fonnte.token'  => $fonnte->token,
                    'services.fonnte.sender' => $fonnte->sender,
                ]);
            }

            // ── Mail Dynamic Settings ─────────────────────────
            $mail = app(MailSettings::class);
            if (!empty($mail->host)) {
                config([
                    'mail.mailers.smtp.host'       => $mail->host,
                    'mail.mailers.smtp.port'       => $mail->port,
                    'mail.mailers.smtp.username'   => $mail->username,
                    'mail.mailers.smtp.password'   => $mail->password,
                    'mail.mailers.smtp.encryption' => $mail->encryption,
                    'mail.from.address'            => $mail->from_address,
                    'mail.from.name'               => $mail->from_name,
                ]);
            }
        } catch (\Throwable $e) {
            // Silently fail if DB not ready (e.g., during migrations)
        }
    }
}
