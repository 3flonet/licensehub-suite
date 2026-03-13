<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        // --- Midtrans ---
        $this->migrator->add('midtrans.merchant_id', '');
        $this->migrator->add('midtrans.client_key', '');
        $this->migrator->add('midtrans.server_key', '');
        $this->migrator->add('midtrans.is_production', false);

        // --- Fonnte WhatsApp ---
        $this->migrator->add('fonnte.token', '');
        $this->migrator->add('fonnte.sender', '');

        // --- Mail / SMTP ---
        $this->migrator->add('mail.host', 'smtp.mailtrap.io');
        $this->migrator->add('mail.port', '2525');
        $this->migrator->add('mail.username', '');
        $this->migrator->add('mail.password', '');
        $this->migrator->add('mail.encryption', 'tls');
        $this->migrator->add('mail.from_address', 'no-reply@licensehub.app');
        $this->migrator->add('mail.from_name', 'LicenseHub');
    }
};
