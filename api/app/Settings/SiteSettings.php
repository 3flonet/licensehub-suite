<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class SiteSettings extends Settings
{
    public string $site_name;

    public string $site_tagline;

    public string $site_description;

    public string $site_keywords;

    public string $site_url;

    public ?string $site_logo;

    public ?string $site_logo_dark;

    public ?string $site_favicon;

    public ?string $og_image_url;

    public string $twitter_handle;

    public string $support_email;

    public string $support_whatsapp;

    public ?string $telegram_group;

    public string $company_name;

    public string $company_address;

    // Maintenance Mode
    public bool $is_maintenance_mode;

    public string $maintenance_message;

    // Social Links
    public ?string $social_facebook;

    public ?string $social_instagram;

    public ?string $social_github;

    public ?string $social_linkedin;

    public ?string $social_youtube;

    public static function group(): string
    {
        return 'site';
    }
}
