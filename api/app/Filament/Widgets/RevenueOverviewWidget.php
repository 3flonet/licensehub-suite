<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Carbon\Carbon;

class RevenueOverviewWidget extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $totalRevenue = Order::where('status', 'completed')->sum('amount');
        $monthlyRevenue = Order::where('status', 'completed')
            ->whereYear('completed_at', now()->year)
            ->whereMonth('completed_at', now()->month)
            ->sum('amount');
        
        $pendingOrders = Order::where('status', 'pending')->count();
        $successfulPayments = Order::where('status', 'completed')->count();

        // Calculate growth (simple example)
        $lastMonthRevenue = Order::where('status', 'completed')
            ->whereMonth('completed_at', now()->subMonth()->month)
            ->sum('amount');
            
        $diff = $monthlyRevenue - $lastMonthRevenue;
        $trend = $diff >= 0 ? 'increase' : 'decrease';
        $trendIcon = $diff >= 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down';
        $trendColor = $diff >= 0 ? 'success' : 'danger';

        return [
            Stat::make('Total Revenue', 'Rp ' . number_format($totalRevenue, 0, ',', '.'))
                ->description('Lifetime earnings')
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('success'),

            Stat::make('Monthly Revenue', 'Rp ' . number_format($monthlyRevenue, 0, ',', '.'))
                ->description($diff >= 0 ? '+' . number_format($diff, 0, ',', '.') . ' from last month' : number_format($diff, 0, ',', '.') . ' from last month')
                ->descriptionIcon($trendIcon)
                ->color($trendColor),

            Stat::make('Successful Payments', $successfulPayments)
                ->description('Completed transactions')
                ->descriptionIcon('heroicon-m-shopping-bag')
                ->color('primary'),

            Stat::make('Pending Orders', $pendingOrders)
                ->description('Orders awaiting payment')
                ->descriptionIcon('heroicon-m-clock')
                ->color('warning'),
        ];
    }
}
