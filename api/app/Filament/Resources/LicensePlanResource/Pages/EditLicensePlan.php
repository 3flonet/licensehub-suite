<?php

namespace App\Filament\Resources\LicensePlanResource\Pages;

use App\Filament\Resources\LicensePlanResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditLicensePlan extends EditRecord
{
    protected static string $resource = LicensePlanResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
