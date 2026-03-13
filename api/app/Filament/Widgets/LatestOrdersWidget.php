<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class LatestOrdersWidget extends BaseWidget
{
    protected static ?int $sort = 3;
    
    protected int | string | array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Order::query()->latest()->limit(5)
            )
            ->columns([
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Time')
                    ->dateTime()
                    ->description(fn (Order $record): string => $record->id),
                Tables\Columns\TextColumn::make('customer.name')
                    ->label('Customer'),
                Tables\Columns\TextColumn::make('plan.product.name')
                    ->label('Product'),
                Tables\Columns\TextColumn::make('amount')
                    ->money('IDR'),
                Tables\Columns\BadgeColumn::make('status')
                    ->colors([
                        'warning' => 'pending',
                        'success' => 'completed',
                        'danger' => 'failed',
                    ]),
            ])
            ->actions([
                Tables\Actions\Action::make('view')
                    ->url(fn (Order $record): string => \App\Filament\Resources\OrderResource::getUrl('edit', ['record' => $record]))
                    ->icon('heroicon-m-eye'),
            ]);
    }
}
