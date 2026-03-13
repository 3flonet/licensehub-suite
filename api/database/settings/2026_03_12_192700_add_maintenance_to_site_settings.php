<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('site.is_maintenance_mode', false);
        $this->migrator->add('site.maintenance_message', 'LicenseHub is currently undergoing scheduled maintenance. Please check back soon.');
    }
    
    public function down(): void
    {
        $this->migrator->delete('site.is_maintenance_mode');
        $this->migrator->delete('site.maintenance_message');
    }
};
