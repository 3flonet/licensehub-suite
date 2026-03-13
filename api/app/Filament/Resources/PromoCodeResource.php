<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PromoCodeResource\Pages;
use App\Filament\Resources\PromoCodeResource\RelationManagers;
use App\Models\PromoCode;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Forms\Get;

class PromoCodeResource extends Resource
{
    protected static ?string $model = PromoCode::class;

    protected static ?string $navigationIcon = 'heroicon-o-ticket';
    protected static ?string $navigationLabel = 'Promo Codes';
    protected static ?int $navigationSort = 4;
    protected static ?string $navigationGroup = 'Storefront';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('General Information')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->label('Campaign Name')
                            ->placeholder('e.g. Black Friday Sale')
                            ->required(),
                        Forms\Components\TextInput::make('code')
                            ->label('Promo Code')
                            ->placeholder('e.g. BLACKFRIDAY50')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->extraAttributes(['style' => 'text-transform: uppercase']),
                        Forms\Components\Select::make('type')
                            ->label('Discount Type')
                            ->options([
                                'percentage' => 'Percentage (%)',
                                'fixed' => 'Fixed Amount',
                            ])
                            ->default('percentage')
                            ->required()
                            ->live(),
                        Forms\Components\TextInput::make('value')
                            ->numeric()
                            ->required()
                            ->prefix(fn (Get $get) => $get('type') === 'fixed' ? 'IDR' : null)
                            ->suffix(fn (Get $get) => $get('type') === 'percentage' ? '%' : null),
                        Forms\Components\TextInput::make('max_discount_amount')
                            ->label('Max Discount Amount (Optional)')
                            ->numeric()
                            ->prefix('IDR')
                            ->helperText('Applies only if type is percentage')
                            ->visible(fn (Get $get) => $get('type') === 'percentage'),
                    ])->columns(2),

                Forms\Components\Section::make('Targeting & Scope')
                    ->description('Leave blank to apply to all products and plans.')
                    ->schema([
                        Forms\Components\Select::make('product_id')
                            ->relationship('product', 'name')
                            ->label('Specific Product')
                            ->searchable()
                            ->preload()
                            ->live()
                            ->helperText('Leave empty to apply to all products in the store.'),
                        Forms\Components\Select::make('license_plan_id')
                            ->relationship('licensePlan', 'name', fn (Builder $query, Get $get) => 
                                $get('product_id') ? $query->where('product_id', $get('product_id')) : $query
                            )
                            ->label('Specific Plan')
                            ->searchable()
                            ->preload()
                            ->helperText('Leave empty to apply to all plans. Note: If a product is selected above, only its plans will appear here.'),
                    ])->columns(2),

                Forms\Components\Section::make('Usage Limits & Validity')
                    ->schema([
                        Forms\Components\TextInput::make('min_order_amount')
                            ->numeric()
                            ->prefix('IDR')
                            ->helperText('Minimum subtotal required to use this code.'),
                        Forms\Components\TextInput::make('max_uses')
                            ->label('Total Usage Limits')
                            ->numeric()
                            ->helperText('Maximum number of times this code can be used in total (by anyone). Leave empty for unlimited.'),
                        Forms\Components\Toggle::make('is_reusable')
                            ->label('Reusable by User')
                            ->default(false)
                            ->helperText('If off, each user can only use this code once.'),
                        Forms\Components\DateTimePicker::make('starts_at')
                            ->label('Start Date & Time'),
                        Forms\Components\DateTimePicker::make('expires_at')
                            ->label('Expiration Date & Time'),
                        Forms\Components\Toggle::make('is_active')
                            ->default(true),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('code')
                    ->searchable()
                    ->badge()
                    ->color('success')
                    ->sortable()
                    ->copyable(),
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('type')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'percentage' => 'info',
                        'fixed' => 'warning',
                    }),
                Tables\Columns\TextColumn::make('value')
                    ->formatStateUsing(fn ($state, $record) => $record->type === 'fixed' ? 'IDR ' . number_format($state, 0, ',', '.') : $state . '%'),
                Tables\Columns\TextColumn::make('used_count')
                    ->label('Uses')
                    ->formatStateUsing(fn ($state, $record) => $state . ($record->max_uses ? ' / ' . $record->max_uses : ''))
                    ->sortable(),
                Tables\Columns\TextColumn::make('expires_at')
                    ->dateTime()
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean(),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('is_active'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
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
            'index' => Pages\ListPromoCodes::route('/'),
            'create' => Pages\CreatePromoCode::route('/create'),
            'edit' => Pages\EditPromoCode::route('/{record}/edit'),
        ];
    }
}
