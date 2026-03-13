<?php

namespace App\Filament\Exporters;

use App\Models\License;
use Filament\Actions\Exports\ExportColumn;
use Filament\Actions\Exports\Exporter;
use Filament\Actions\Exports\Models\Export;

class LicenseExporter extends Exporter
{
    protected static ?string $model = License::class;

    public static function getColumns(): array
    {
        return [
            ExportColumn::make('license_key')
                ->label('License Key'),
            ExportColumn::make('product.name')
                ->label('Product'),
            ExportColumn::make('plan.name')
                ->label('Plan'),
            ExportColumn::make('customer.name')
                ->label('Customer'),
            ExportColumn::make('customer.email')
                ->label('Email'),
            ExportColumn::make('status')
                ->label('Status'),
            ExportColumn::make('purchased_at')
                ->label('Purchased At'),
            ExportColumn::make('expires_at')
                ->label('Expires At'),
            ExportColumn::make('notes')
                ->label('Notes'),
        ];
    }

    public static function getFileName(Export $export): string
    {
        return "licenses-{$export->getKey()}.csv";
    }
}
