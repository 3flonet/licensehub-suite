<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Filament\Resources\ProductResource\RelationManagers;
use App\Models\Product;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static ?string $navigationIcon = 'heroicon-o-cube';
    protected static ?string $navigationLabel = 'Products';
    protected static ?int $navigationSort = 1;
    protected static ?string $navigationGroup = 'Management';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255)
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn (Forms\Set $set, ?string $state) => $set('slug', \Illuminate\Support\Str::slug($state))),
                Forms\Components\TextInput::make('slug')
                    ->required()
                    ->unique(ignoreRecord: true)
                    ->maxLength(255),
                Forms\Components\Textarea::make('description')
                    ->maxLength(65535)
                    ->columnSpanFull(),
                Forms\Components\FileUpload::make('logo')
                    ->image()
                    ->imageEditor()
                    ->imageEditorAspectRatios([
                        '1:1',
                    ])
                    ->directory('product-logos')
                    ->maxSize(2048)
                    ->helperText('Upload a square logo or icon for your product. Max 2MB.')
                    ->columnSpanFull(),
                Forms\Components\TextInput::make('version')
                    ->default('1.0.0'),
                Forms\Components\TextInput::make('api_secret')
                    ->label('Product Secret Key')
                    ->placeholder('Will be generated automatically')
                    ->readOnly()
                    ->helperText('This secret is used by your application to authenticate with the license server.'),
                Forms\Components\TextInput::make('download_url'),
                Forms\Components\TextInput::make('documentation_url'),
                Forms\Components\TextInput::make('changelog_url'),
                Forms\Components\TextInput::make('preview_url')
                    ->label('Preview / Demo URL')
                    ->placeholder('https://demo.myapp.com')
                    ->url(),
                Forms\Components\Toggle::make('is_active')
                    ->default(true),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('logo')
                    ->square()
                    ->defaultImageUrl(url('https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=P')),
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('slug')
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('version'),
                Tables\Columns\TextColumn::make('preview_url')
                    ->label('Demo')
                    ->formatStateUsing(fn ($state) => $state ? 'Live Preview' : null)
                    ->badge()
                    ->color('info')
                    ->icon('heroicon-m-arrow-top-right-on-square')
                    ->iconPosition('after')
                    ->url(fn ($state) => $state, true)
                    ->placeholder('None'),
                Tables\Columns\TextColumn::make('licenses_count')
                    ->label('Active Licenses')
                    ->counts('licenses', fn (Builder $query) => $query->where('status', 'active'))
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_active')
                    ->label('Status')
                    ->boolean(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->toggleable(isToggledHiddenByDefault: true),
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
            RelationManagers\LicensePlansRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
        ];
    }
}
