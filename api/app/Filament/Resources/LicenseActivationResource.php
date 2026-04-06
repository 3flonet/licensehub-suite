<?php

namespace App\Filament\Resources;

use App\Filament\Resources\LicenseActivationResource\Pages;
use App\Models\LicenseActivation;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class LicenseActivationResource extends Resource
{
    protected static ?string $model = LicenseActivation::class;

    protected static ?string $navigationIcon = 'heroicon-o-globe-alt';

    protected static ?string $navigationLabel = 'Activations';

    protected static ?int $navigationSort = 6;

    protected static ?string $navigationGroup = 'Management';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('license_id')
                    ->relationship('license', 'license_key')
                    ->required(),
                Forms\Components\TextInput::make('domain')
                    ->required(),
                Forms\Components\TextInput::make('ip_address'),
                Forms\Components\Select::make('status')
                    ->options([
                        'active' => 'Active',
                        'deactivated' => 'Deactivated',
                    ]),
                Forms\Components\DateTimePicker::make('activated_at'),
                Forms\Components\DateTimePicker::make('last_ping_at'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('license.license_key')
                    ->searchable(),
                Tables\Columns\TextColumn::make('domain')
                    ->searchable(),
                Tables\Columns\TextColumn::make('status')
                    ->badge(),
                Tables\Columns\TextColumn::make('activated_at')
                    ->dateTime(),
                Tables\Columns\TextColumn::make('last_ping_at')
                    ->dateTime(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status'),
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
            'index' => Pages\ListLicenseActivations::route('/'),
            'create' => Pages\CreateLicenseActivation::route('/create'),
            'edit' => Pages\EditLicenseActivation::route('/{record}/edit'),
        ];
    }
}
