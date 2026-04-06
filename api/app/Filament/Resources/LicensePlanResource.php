<?php

namespace App\Filament\Resources;

use App\Filament\Resources\LicensePlanResource\Pages;
use App\Models\LicensePlan;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class LicensePlanResource extends Resource
{
    protected static ?string $model = LicensePlan::class;

    protected static ?string $navigationIcon = 'heroicon-o-document-text';

    protected static ?string $navigationLabel = 'License Plans';

    protected static ?int $navigationSort = 2;

    protected static ?string $navigationGroup = 'Management';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('product_id')
                    ->relationship('product', 'name')
                    ->required()
                    ->searchable()
                    ->preload()
                    ->loadingMessage('Loading products...')
                    ->searchPrompt('Type to search products...')
                    ->noSearchResultsMessage('No products found.'),
                Forms\Components\TextInput::make('name')
                    ->required(),
                Forms\Components\Select::make('billing_model')
                    ->options([
                        'one_time' => 'One Time',
                        'annual' => 'Annual',
                        'monthly' => 'Monthly',
                        'trial' => 'Trial',
                    ])
                    ->required(),
                Forms\Components\TextInput::make('price')
                    ->numeric()
                    ->required(),
                Forms\Components\TextInput::make('max_domains')
                    ->numeric()
                    ->default(1),
                Forms\Components\TextInput::make('validity_days')
                    ->numeric()
                    ->default(0)
                    ->helperText('0 = Lifetime'),
                Forms\Components\TextInput::make('grace_period_days')
                    ->numeric()
                    ->default(7),
                Forms\Components\TextInput::make('trial_days')
                    ->numeric()
                    ->default(0),
                Forms\Components\Toggle::make('allow_domain_transfer'),
                Forms\Components\TextInput::make('max_transfer_count')
                    ->numeric()
                    ->default(0),
                Forms\Components\Toggle::make('is_active')
                    ->default(true),
                Forms\Components\Section::make('Comparison Features')
                    ->description('Add features that will be shown in the pricing comparison table.')
                    ->schema([
                        Forms\Components\Repeater::make('features')
                            ->schema([
                                Forms\Components\TextInput::make('name')
                                    ->label('Feature Name')
                                    ->placeholder('e.g. Domain Transfer')
                                    ->required(),
                                Forms\Components\TextInput::make('value')
                                    ->label('Value / Text')
                                    ->placeholder('e.g. Yes / Unlimited / 3 Times'),
                                Forms\Components\Toggle::make('is_enabled')
                                    ->label('Show Icon (Check/Cross)')
                                    ->default(true),
                            ])
                            ->columns(3)
                            ->itemLabel(fn (array $state): ?string => $state['name'] ?? null)
                            ->grid(1)
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('product.name')
                    ->sortable(),
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('billing_model'),
                Tables\Columns\TextColumn::make('price'),
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
            'index' => Pages\ListLicensePlans::route('/'),
            'create' => Pages\CreateLicensePlan::route('/create'),
            'edit' => Pages\EditLicensePlan::route('/{record}/edit'),
        ];
    }
}
