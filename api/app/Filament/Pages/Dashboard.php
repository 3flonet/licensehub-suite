<?php

namespace App\Filament\Pages;

use App\Filament\Widgets\ExpiringLicensesWidget;
use App\Filament\Widgets\RecentActivationsWidget;
use App\Filament\Widgets\SalesChart;
use App\Filament\Widgets\SalesOverview;
use App\Filament\Widgets\StatsOverviewWidget;
use Filament\Pages\Dashboard as BaseDashboard;

class Dashboard extends BaseDashboard
{
    protected int|string|array $columnSpan = 'full';

    public function getWidgets(): array
    {
        return [
            StatsOverviewWidget::class,
            SalesOverview::class,
            SalesChart::class,
            RecentActivationsWidget::class,
            ExpiringLicensesWidget::class,
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
