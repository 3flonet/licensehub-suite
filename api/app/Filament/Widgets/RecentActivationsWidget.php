<?php

namespace App\Filament\Widgets;

use App\Models\LicenseActivation;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class RecentActivationsWidget extends BaseWidget
{
    protected static ?int $sort = 2;

    protected int | string | array $columnSpan = 'full';

    public static function getTitle(): string
    {
        return 'Recent License Activations';
    }

    public function table(Table $table): Table
    {
        return $table
            ->query(
                LicenseActivation::query()
                    ->with(['license.product', 'license.customer'])
                    ->latest('activated_at')
                    ->limit(10)
            )
            ->columns([
                TextColumn::make('license.license_key')
                    ->label('License Key')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('license.product.name')
                    ->label('Product')
                    ->searchable(),

                TextColumn::make('license.customer.name')
                    ->label('Customer')
                    ->searchable(),

                TextColumn::make('domain')
                    ->label('Domain')
                    ->searchable()
                    ->sortable(),

                BadgeColumn::make('license.status')
                    ->label('Status')
                    ->colors([
                        'success' => 'active',
                        'danger' => 'revoked',
                        'warning' => 'suspended',
                        'secondary' => 'expired',
                    ]),

                TextColumn::make('activated_at')
                    ->label('Activated At')
                    ->dateTime('M d, Y H:i')
                    ->sortable(),
            ])
            ->defaultPaginationPageOption(10)
            ->paginated([10]);
    }
}
