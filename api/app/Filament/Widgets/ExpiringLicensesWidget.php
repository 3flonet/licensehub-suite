<?php

namespace App\Filament\Widgets;

use App\Models\License;
use Carbon\Carbon;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class ExpiringLicensesWidget extends BaseWidget
{
    protected static ?int $sort = 3;

    protected int|string|array $columnSpan = 'full';

    public static function getTitle(): string
    {
        return 'Licenses Expiring Soon (Next 30 Days)';
    }

    public function table(Table $table): Table
    {
        return $table
            ->query(
                License::query()
                    ->with(['product', 'customer'])
                    ->where('status', 'active')
                    ->whereDate('expires_at', '<=', Carbon::now()->addDays(30))
                    ->whereDate('expires_at', '>', Carbon::now())
                    ->orderBy('expires_at', 'asc')
            )
            ->columns([
                TextColumn::make('license_key')
                    ->label('License Key')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('product.name')
                    ->label('Product')
                    ->searchable(),

                TextColumn::make('customer.name')
                    ->label('Customer')
                    ->searchable(),

                TextColumn::make('customer.email')
                    ->label('Email')
                    ->searchable(),

                TextColumn::make('expires_at')
                    ->label('Expires At')
                    ->dateTime('M d, Y')
                    ->sortable()
                    ->color(
                        fn (License $record) => $record->expires_at->diffInDays() <= 7 ? 'danger' : 'warning'
                    ),

                BadgeColumn::make('days_remaining')
                    ->label('Days Remaining')
                    ->getStateUsing(fn (License $record) => $record->expires_at->diffInDays())
                    ->colors([
                        'danger' => fn ($state) => $state <= 7,
                        'warning' => fn ($state) => $state <= 14,
                        'info' => fn ($state) => $state <= 30,
                    ]),
            ])
            ->defaultPaginationPageOption(10)
            ->paginated([10]);
    }
}
