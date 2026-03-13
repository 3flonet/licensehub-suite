<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Carbon\Carbon;

class SalesOverview extends BaseWidget
{
    protected function getStats(): array
    {
        $totalRevenue = Order::where('status', 'completed')->sum('amount');
        $monthlyRevenue = Order::where('status', 'completed')
            ->whereMonth('completed_at', Carbon::now()->month)
            ->whereYear('completed_at', Carbon::now()->year)
            ->sum('amount');
        
        $totalOrders = Order::where('status', 'completed')->count();
        $monthlyOrders = Order::where('status', 'completed')
            ->whereMonth('completed_at', Carbon::now()->month)
            ->whereYear('completed_at', Carbon::now()->year)
            ->count();

        return [
            Stat::make('Total Revenue', 'IDR ' . number_format($totalRevenue, 0, ',', '.'))
                ->description('Total completed sales')
                ->descriptionIcon('heroicon-m-banknotes')
                ->chart([7, 2, 10, 3, 15, 4, 17])
                ->color('success'),

            Stat::make('Monthly Revenue', 'IDR ' . number_format($monthlyRevenue, 0, ',', '.'))
                ->description('Revenue this month')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('primary'),

            Stat::make('Total Orders', $totalOrders)
                ->description('Completed transactions')
                ->descriptionIcon('heroicon-m-shopping-cart')
                ->color('info'),

            Stat::make('Monthly Orders', $monthlyOrders)
                ->description('Orders this month')
                ->descriptionIcon('heroicon-m-calendar')
                ->color('warning'),
        ];
    }
}
