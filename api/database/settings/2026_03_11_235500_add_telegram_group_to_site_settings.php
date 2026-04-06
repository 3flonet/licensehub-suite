<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('site.telegram_group', null);
    }

    public function down(): void
    {
        $this->migrator->delete('site.telegram_group');
    }
};
