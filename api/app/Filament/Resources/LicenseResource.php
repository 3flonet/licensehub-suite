<?php

namespace App\Filament\Resources;

use App\Filament\Exporters\LicenseExporter;
use App\Filament\Resources\LicenseResource\Pages;
use App\Jobs\SendWhatsAppMessageJob;
use App\Mail\LicenseIssuedMailable;
use App\Models\License;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Actions\Action;
use Filament\Tables\Actions\ActionGroup;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Js;

class LicenseResource extends Resource
{
    protected static ?string $model = License::class;

    protected static ?string $navigationIcon = 'heroicon-o-key';

    protected static ?string $navigationLabel = 'Licenses';

    protected static ?int $navigationSort = 4;

    protected static ?string $navigationGroup = 'Management';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('product_id')
                    ->relationship('product', 'name')
                    ->required(),
                Forms\Components\Select::make('plan_id')
                    ->relationship('plan', 'name')
                    ->required(),
                Forms\Components\Select::make('customer_id')
                    ->relationship('customer', 'name')
                    ->required(),
                Forms\Components\Select::make('order_id')
                    ->relationship('order', 'id')
                    ->label('Source Order')
                    ->searchable()
                    ->helperText('The order that generated this license'),
                Forms\Components\TextInput::make('license_key')
                    ->unique(ignoreRecord: true)
                    ->helperText('Auto-generated'),
                Forms\Components\Select::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'active' => 'Active',
                        'expired' => 'Expired',
                        'revoked' => 'Revoked',
                        'suspended' => 'Suspended',
                    ])
                    ->default('pending'),
                Forms\Components\DateTimePicker::make('purchased_at'),
                Forms\Components\DateTimePicker::make('expires_at'),
                Forms\Components\Textarea::make('notes'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('license_key')
                    ->searchable(),
                Tables\Columns\TextColumn::make('product.name'),
                Tables\Columns\TextColumn::make('customer.name'),
                Tables\Columns\TextColumn::make('order.id')
                    ->label('Order')
                    ->fontFamily('mono')
                    ->size('xs')
                    ->limit(8)
                    ->url(fn (License $record): ?string => $record->order_id ? OrderResource::getUrl('edit', ['record' => $record->order_id]) : null),
                Tables\Columns\TextColumn::make('status')
                    ->badge(),
                Tables\Columns\TextColumn::make('purchased_at')
                    ->dateTime(),
                Tables\Columns\TextColumn::make('expires_at')
                    ->dateTime(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                ActionGroup::make([
                    Action::make('sendEmail')
                        ->label('Send Email')
                        ->icon('heroicon-m-envelope')
                        ->color('info')
                        ->requiresConfirmation()
                        ->action(function (License $record) {
                            try {
                                Mail::to($record->customer->email)->queue(new LicenseIssuedMailable($record));
                                Notification::make()
                                    ->title('Email added to queue')
                                    ->success()
                                    ->send();
                            } catch (\Exception $e) {
                                Notification::make()
                                    ->title('Failed to queue email')
                                    ->body($e->getMessage())
                                    ->danger()
                                    ->send();
                            }
                        }),
                    Action::make('sendWhatsApp')
                        ->label('Send WhatsApp')
                        ->icon('heroicon-m-phone')
                        ->color('success')
                        ->requiresConfirmation()
                        ->action(function (License $record) {
                            try {
                                SendWhatsAppMessageJob::dispatch(
                                    $record->customer->phone,
                                    $record->getFormattedMessage()
                                );

                                Notification::make()
                                    ->title('WhatsApp message added to queue')
                                    ->success()
                                    ->send();
                            } catch (\Exception $e) {
                                Notification::make()
                                    ->title('Failed to queue WhatsApp')
                                    ->danger()
                                    ->send();
                            }
                        }),
                    Action::make('copyMessage')
                        ->label('Copy Message')
                        ->icon('heroicon-m-clipboard')
                        ->color('success')
                        ->action(function (License $record, $livewire) {
                            $livewire->js('
                                (function() {
                                    const text = '.Js::from($record->getFormattedMessage()).";
                                    if (navigator.clipboard && window.isSecureContext) {
                                        navigator.clipboard.writeText(text).catch(err => {
                                            copyFallback(text);
                                        });
                                    } else {
                                        copyFallback(text);
                                    }

                                    function copyFallback(content) {
                                        const el = document.createElement('textarea');
                                        el.value = content;
                                        el.setAttribute('readonly', '');
                                        el.style.position = 'absolute';
                                        el.style.left = '-9999px';
                                        document.body.appendChild(el);
                                        el.select();
                                        document.execCommand('copy');
                                        document.body.removeChild(el);
                                    }
                                })();
                            ");

                            Notification::make()
                                ->title('Message copied to clipboard')
                                ->success()
                                ->send();
                        }),
                    Action::make('suspend')
                        ->label('Suspend')
                        ->icon('heroicon-m-pause')
                        ->color('warning')
                        ->hidden(fn (License $record) => in_array($record->status, ['suspended', 'revoked']))
                        ->requiresConfirmation()
                        ->action(fn (License $record) => $record->update(['status' => 'suspended'])),
                    Action::make('revoke')
                        ->label('Revoke')
                        ->icon('heroicon-m-x-mark')
                        ->color('danger')
                        ->hidden(fn (License $record) => $record->status === 'revoked')
                        ->requiresConfirmation()
                        ->action(fn (License $record) => $record->update(['status' => 'revoked'])),
                ]),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\BulkAction::make('suspend')
                        ->label('Suspend Selected')
                        ->icon('heroicon-m-pause')
                        ->color('warning')
                        ->requiresConfirmation()
                        ->action(fn ($records) => $records->each(fn ($record) => $record->update(['status' => 'suspended']))),
                    Tables\Actions\BulkAction::make('revoke')
                        ->label('Revoke Selected')
                        ->icon('heroicon-m-x-mark')
                        ->color('danger')
                        ->requiresConfirmation()
                        ->action(fn ($records) => $records->each(fn ($record) => $record->update(['status' => 'revoked']))),
                    Tables\Actions\ExportBulkAction::make()
                        ->exporter(LicenseExporter::class),
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListLicenses::route('/'),
            'create' => Pages\CreateLicense::route('/create'),
            'edit' => Pages\EditLicense::route('/{record}/edit'),
        ];
    }
}
