<?php

namespace App\Filament\Resources\LicenseActivationResource\Pages;

use App\Filament\Resources\LicenseActivationResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditLicenseActivation extends EditRecord
{
    protected static string $resource = LicenseActivationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
