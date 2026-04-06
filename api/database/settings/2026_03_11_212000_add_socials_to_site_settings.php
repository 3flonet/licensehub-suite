<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('site.social_facebook', null);
        $this->migrator->add('site.social_instagram', null);
        $this->migrator->add('site.social_github', 'https://github.com/3flo');
        $this->migrator->add('site.social_linkedin', null);
        $this->migrator->add('site.social_youtube', null);
    }

    public function down(): void
    {
        $this->migrator->delete('site.social_facebook');
        $this->migrator->delete('site.social_instagram');
        $this->migrator->delete('site.social_github');
        $this->migrator->delete('site.social_linkedin');
        $this->migrator->delete('site.social_youtube');
    }
};
