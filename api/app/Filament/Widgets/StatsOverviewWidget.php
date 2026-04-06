<?php

namespace App\Filament\Widgets;

use App\Models\License;
use Carbon\Carbon;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverviewWidget extends BaseWidget
{
    protected function getStats(): array
    {
        $totalLicenses = License::count();
        $activeLicenses = License::where('status', 'active')->count();
        $expiredLicenses = License::where('status', 'expired')->count();
        $suspendedLicenses = License::where('status', 'suspended')->count();

        $expiringInDays = License::where('status', 'active')
            ->whereDate('expires_at', '<=', Carbon::now()->addDays(7))
            ->whereDate('expires_at', '>', Carbon::now())
            ->count();

        return [
            Stat::make('Total Licenses', $totalLicenses)
                ->description('All licenses in system')
                ->descriptionIcon('heroicon-m-key')
                ->color('info'),

            Stat::make('Active Licenses', $activeLicenses)
                ->description('Currently valid licenses')
                ->descriptionIcon('heroicon-m-check-circle')
                ->color('success'),

            Stat::make('Expired Licenses', $expiredLicenses)
                ->description('No longer valid')
                ->descriptionIcon('heroicon-m-x-circle')
                ->color('danger'),

            Stat::make('Expiring Soon', $expiringInDays)
                ->description('Will expire in next 7 days')
                ->descriptionIcon('heroicon-m-exclamation-circle')
                ->color('warning'),
        ];
    }
}
