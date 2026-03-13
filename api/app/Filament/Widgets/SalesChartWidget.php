<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Widgets\ChartWidget;
use Flowframe\Trend\Trend;
use Flowframe\Trend\TrendValue;
use Illuminate\Support\Facades\DB;

class SalesChartWidget extends ChartWidget
{
    protected static ?string $heading = 'Monthly Revenue';
    
    protected static ?int $sort = 2;

    protected function getData(): array
    {
        // Manual grouping since and potentially missing Trend package
        $data = Order::select(
                DB::raw('SUM(amount) as total'),
                DB::raw("DATE_FORMAT(completed_at, '%Y-%m') as month")
            )
            ->where('status', 'completed')
            ->where('completed_at', '>=', now()->subMonths(6))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return [
            'datasets' => [
                [
                    'label' => 'Revenue (IDR)',
                    'data' => $data->map(fn ($value) => $value->total)->toArray(),
                    'fill' => 'start',
                    'tension' => 0.4,
                    'backgroundColor' => 'rgba(54, 162, 235, 0.2)',
                    'borderColor' => 'rgb(54, 162, 235)',
                ],
            ],
            'labels' => $data->map(fn ($value) => $value->month)->toArray(),
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
