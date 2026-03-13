<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('site.site_logo', null);
        $this->migrator->add('site.site_favicon', null);
    }

    public function down(): void
    {
        $this->migrator->delete('site.site_logo');
        $this->migrator->delete('site.site_favicon');
    }
};
