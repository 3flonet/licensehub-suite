<?php

namespace App\Providers\Filament;

use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Navigation\MenuItem;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Support\Facades\FilamentView;
use Filament\View\PanelsRenderHook;
use Filament\Widgets;
use App\Filament\Pages\Dashboard;
use App\Filament\Pages\AdminProfile;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades\Blade;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        $hasSettingsTable = false;
        try {
            $hasSettingsTable = \Illuminate\Support\Facades\Schema::hasTable('settings');
        } catch (\Throwable $e) {}

        $siteName = '3Flo LicenseHub';
        if ($hasSettingsTable) {
            $siteName = rescue(fn () => app(\App\Settings\SiteSettings::class)->site_name, '3Flo LicenseHub');
        }
        
        $siteLogo = asset('logo.png');
        $logo = rescue(fn () => app(\App\Settings\SiteSettings::class)->site_logo, null);
        if ($logo) {
            $siteLogo = asset('storage/' . $logo);
        }

        $siteLogoDark = null;
        $logoDark = rescue(fn () => app(\App\Settings\SiteSettings::class)->site_logo_dark, null);
        if ($logoDark) {
            $siteLogoDark = asset('storage/' . $logoDark);
        }

        $siteFavicon = asset('logo.png');
        $favicon = rescue(fn () => app(\App\Settings\SiteSettings::class)->site_favicon, null);
        if ($favicon) {
            $siteFavicon = asset('storage/' . $favicon);
        }

        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->login()
            // ── Brand ──────────────────────────────────────────────────
            ->brandName($siteName)
            ->brandLogo($siteLogo)
            ->darkModeBrandLogo($siteLogoDark ?: $siteLogo)
            ->brandLogoHeight('2rem')
            ->favicon($siteFavicon)
            // ── Colors ─────────────────────────────────────────────────
            ->colors([
                'primary' => Color::Amber,
            ])
            // ── Profile ────────────────────────────────────────────────
            ->profile(AdminProfile::class, isSimple: false)
            ->userMenuItems([
                MenuItem::make()
                    ->label('My Profile')
                    ->icon('heroicon-o-user-circle')
                    ->url(fn() => AdminProfile::getUrl()),
            ])
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\\Filament\\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\\Filament\\Pages')
            ->pages([
                Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\\Filament\\Widgets')
            ->widgets([
                Widgets\AccountWidget::class,
                Widgets\FilamentInfoWidget::class,
            ])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ]);
    }

    public function boot(): void
    {
        // Inject custom meta tags ke semua halaman admin
        FilamentView::registerRenderHook(
            PanelsRenderHook::HEAD_END,
            function (): string {
                $hasSettingsTable = false;
                try {
                    $hasSettingsTable = \Illuminate\Support\Facades\Schema::hasTable('settings');
                } catch (\Throwable $e) {}

                $siteName = '3Flo LicenseHub';
                if ($hasSettingsTable) {
                    $siteName = rescue(fn () => app(\App\Settings\SiteSettings::class)->site_name, '3Flo LicenseHub');
                }
                
                $ogImage = asset('og-image.png');
                if ($og = rescue(fn () => app(\App\Settings\SiteSettings::class)->og_image_url, null)) {
                    $ogImage = str_starts_with($og, '/') ? url($og) : asset('storage/' . $og);
                }
                
                $siteFavicon = asset('logo.png');
                if ($favicon = rescue(fn () => app(\App\Settings\SiteSettings::class)->site_favicon, null)) {
                    $siteFavicon = asset('storage/' . $favicon);
                }

                return Blade::render('
                    <meta name="description" content="{{ $siteName }} — Admin Panel. Kelola lisensi, order, customer, dan konfigurasi sistem." />
                    <meta name="robots" content="noindex, nofollow" />
                    <meta property="og:title" content="{{ $siteName }} — Admin" />
                    <meta property="og:description" content="Professional License Management System by 3Flo." />
                    <meta property="og:image" content="{{ $ogImage }}" />
                    <meta property="og:type" content="website" />
                    <meta name="theme-color" content="#0F172A" />
                    <meta name="twitter:card" content="summary" />
                    <meta name="twitter:title" content="{{ $siteName }} Admin" />
                    <link rel="apple-touch-icon" href="{{ $siteFavicon }}" />
                ', [
                    'siteName' => $siteName,
                    'ogImage' => $ogImage,
                    'siteFavicon' => $siteFavicon,
                ]);
            }
        );
    }
}
