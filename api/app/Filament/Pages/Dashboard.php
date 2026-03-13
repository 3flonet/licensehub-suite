<?php

namespace App\Filament\Pages;

use Filament\Pages\Dashboard as BaseDashboard;
use Filament\Widgets\Widget;

class Dashboard extends BaseDashboard
{
    protected int | string | array $columnSpan = 'full';

    public function getWidgets(): array
    {
        return [
            \App\Filament\Widgets\StatsOverviewWidget::class,
            \App\Filament\Widgets\SalesOverview::class,
            \App\Filament\Widgets\SalesChart::class,
            \App\Filament\Widgets\RecentActivationsWidget::class,
            \App\Filament\Widgets\ExpiringLicensesWidget::class,
        ];
    }

    public static function getNavigationIcon(): ?string
    {
        return 'heroicon-o-home';
    }

    public static function getNavigationLabel(): string
    {
        return 'Dashboard';
    }
}
