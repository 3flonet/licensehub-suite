<?php

namespace App\Filament\Resources\ProductResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class LicensePlansRelationManager extends RelationManager
{
    protected static string $relationship = 'licensePlans';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),
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
                    ->required()
                    ->prefix('IDR'),
                Forms\Components\TextInput::make('max_domains')
                    ->numeric()
                    ->default(1)
                    ->minValue(1),
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
                Forms\Components\Toggle::make('allow_domain_transfer')
                    ->default(false),
                Forms\Components\TextInput::make('max_transfer_count')
                    ->numeric()
                    ->default(0),
                Forms\Components\Toggle::make('is_active')
                    ->default(true),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('name')
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('billing_model')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'one_time' => 'success',
                        'annual' => 'warning',
                        'monthly' => 'info',
                        'trial' => 'gray',
                    }),
                Tables\Columns\TextColumn::make('price')
                    ->money('IDR')
                    ->sortable(),
                Tables\Columns\TextColumn::make('max_domains')
                    ->label('Domains')
                    ->numeric(),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean(),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make(),
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
}
