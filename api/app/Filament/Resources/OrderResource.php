<?php

namespace App\Filament\Resources;

use App\Filament\Resources\OrderResource\Pages;
use App\Models\License;
use App\Models\Order;
use App\Services\NotificationService;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Log;
use Midtrans\Config;
use Midtrans\Transaction;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static ?string $navigationIcon = 'heroicon-o-shopping-cart';

    protected static ?string $navigationGroup = 'Financial';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('customer_id')
                    ->relationship('customer', 'name')
                    ->required()
                    ->searchable(),
                Forms\Components\Select::make('plan_id')
                    ->relationship('plan', 'name')
                    ->required(),
                Forms\Components\TextInput::make('amount')
                    ->numeric()
                    ->required()
                    ->prefix('IDR'),
                Forms\Components\Select::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'completed' => 'Completed',
                        'failed' => 'Failed',
                        'expired' => 'Expired',
                        'cancelled' => 'Cancelled',
                    ])
                    ->required(),
                Forms\Components\TextInput::make('payment_id')
                    ->label('Transaction ID'),
                Forms\Components\TextInput::make('payment_method'),
                Forms\Components\DateTimePicker::make('completed_at'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->label('Order ID')
                    ->searchable()
                    ->fontFamily('mono')
                    ->size('xs')
                    ->limit(12)
                    ->tooltip(fn ($record) => $record->id),
                Tables\Columns\TextColumn::make('customer.name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('plan.product.name')
                    ->label('Product'),
                Tables\Columns\TextColumn::make('plan.name')
                    ->label('Plan'),
                Tables\Columns\TextColumn::make('amount')
                    ->money('IDR')
                    ->sortable(),
                Tables\Columns\BadgeColumn::make('status')
                    ->colors([
                        'warning' => 'pending',
                        'success' => 'completed',
                        'danger' => 'failed',
                        'gray' => 'cancelled',
                    ]),
                Tables\Columns\TextColumn::make('payment_method')
                    ->label('Method')
                    ->placeholder('-'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'completed' => 'Completed',
                        'failed' => 'Failed',
                    ]),
            ])
            ->actions([
                // ─── VERIFY PAYMENT (Query Midtrans API) ──────────────────
                Tables\Actions\Action::make('verifyPayment')
                    ->label('Verify Payment')
                    ->icon('heroicon-o-arrow-path')
                    ->color('warning')
                    ->visible(fn (Order $record) => $record->status === 'pending')
                    ->requiresConfirmation()
                    ->modalHeading('Verify Payment with Midtrans')
                    ->modalDescription('This will query the Midtrans API to check the real payment status for this order.')
                    ->action(function (Order $record) {
                        try {
                            // Setup Midtrans config
                            Config::$serverKey = config('services.midtrans.server_key');
                            Config::$isProduction = config('services.midtrans.is_production');

                            // Query Midtrans for transaction status
                            $status = Transaction::status($record->id);

                            $transactionStatus = $status->transaction_status ?? null;
                            $paymentType = $status->payment_type ?? null;
                            $transactionId = $status->transaction_id ?? null;
                            $fraudStatus = $status->fraud_status ?? null;

                            Log::info("Midtrans status check for Order {$record->id}: ".json_encode($status));

                            // Determine new order status
                            $newStatus = match (true) {
                                in_array($transactionStatus, ['settlement', 'capture']) && $fraudStatus !== 'deny' => 'completed',
                                $transactionStatus === 'pending' => 'pending',
                                in_array($transactionStatus, ['deny', 'cancel', 'cancel']) => 'failed',
                                $transactionStatus === 'expire' => 'expired',
                                default => $record->status,
                            };

                            $record->status = $newStatus;
                            $record->payment_id = $transactionId;
                            $record->payment_method = $paymentType;

                            if ($newStatus === 'completed' && ! $record->completed_at) {
                                $record->completed_at = now();
                                $record->save();

                                // Trigger license generation & notification
                                $existingLicense = License::where('order_id', $record->id)->first();
                                if (! $existingLicense) {
                                    $plan = $record->plan;
                                    $license = License::create([
                                        'customer_id' => $record->customer_id,
                                        'product_id' => $plan->product_id,
                                        'plan_id' => $plan->id,
                                        'order_id' => $record->id,
                                        'status' => 'active',
                                        'purchased_at' => now(),
                                        'expires_at' => $plan->validity_days ? now()->addDays($plan->validity_days) : null,
                                    ]);

                                    $notifier = new NotificationService;
                                    $notifier->sendLicenseDelivery($license);
                                }

                                Notification::make()
                                    ->title('✅ Payment verified & license issued!')
                                    ->body("Order {$record->id} — Status: {$newStatus} | Method: {$paymentType}")
                                    ->success()
                                    ->send();
                            } else {
                                $record->save();
                                Notification::make()
                                    ->title('Status: '.strtoupper($newStatus))
                                    ->body("Midtrans reports: {$transactionStatus} | Method: {$paymentType}")
                                    ->info()
                                    ->send();
                            }

                        } catch (\Exception $e) {
                            Log::error('Midtrans verify error: '.$e->getMessage());
                            Notification::make()
                                ->title('❌ Verification failed!')
                                ->body($e->getMessage())
                                ->danger()
                                ->persistent()
                                ->send();
                        }
                    }),

                Tables\Actions\EditAction::make(),
                Tables\Actions\ViewAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\DeleteBulkAction::make(),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListOrders::route('/'),
            'create' => Pages\CreateOrder::route('/create'),
            'edit' => Pages\EditOrder::route('/{record}/edit'),
        ];
    }
}
