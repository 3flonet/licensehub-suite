<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('site.site_name', '3Flo LicenseHub');
        $this->migrator->add('site.site_tagline', 'Professional License Management System');
        $this->migrator->add('site.site_description', 'Platform manajemen lisensi software profesional. Kelola lisensi, aktivasi domain, pembayaran Midtrans, dan notifikasi WhatsApp dalam satu dashboard.');
        $this->migrator->add('site.site_keywords', 'license management, software license, lisensi software, midtrans, license key, domain activation');
        $this->migrator->add('site.site_url', 'https://licensehub.3flo.id');
        $this->migrator->add('site.og_image_url', '/og-image.png');
        $this->migrator->add('site.twitter_handle', '@3flo_id');
        $this->migrator->add('site.support_email', 'support@3flo.id');
        $this->migrator->add('site.support_whatsapp', '6282120664105');
        $this->migrator->add('site.company_name', '3Flo');
        $this->migrator->add('site.company_address', 'Indonesia');
    }

    public function down(): void
    {
        $this->migrator->delete('site.site_name');
        $this->migrator->delete('site.site_tagline');
        $this->migrator->delete('site.site_description');
        $this->migrator->delete('site.site_keywords');
        $this->migrator->delete('site.site_url');
        $this->migrator->delete('site.og_image_url');
        $this->migrator->delete('site.twitter_handle');
        $this->migrator->delete('site.support_email');
        $this->migrator->delete('site.support_whatsapp');
        $this->migrator->delete('site.company_name');
        $this->migrator->delete('site.company_address');
    }
};
