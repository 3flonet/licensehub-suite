<?php

namespace App\Filament\Pages;

use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Section;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Auth\EditProfile;

class AdminProfile extends EditProfile
{
    protected static ?string $navigationIcon = 'heroicon-o-user-circle';

    public function getTitle(): string
    {
        return 'My Profile';
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                // ── Info Section ──────────────────────────────────────────────
                Section::make('Personal Information')
                    ->description('Update your name and email address.')
                    ->icon('heroicon-o-user')
                    ->schema([
                        Placeholder::make('created_at')
                            ->label('Account Created')
                            ->content(fn () => auth()->user()?->created_at?->diffForHumans() ?? '-'),

                        Placeholder::make('email_verified_at')
                            ->label('Email Verified')
                            ->content(fn () => auth()->user()?->email_verified_at
                                ? '✅ '.auth()->user()->email_verified_at->toFormattedDateString()
                                : '⚠️ Not verified'),

                        $this->getNameFormComponent()
                            ->label('Full Name')
                            ->placeholder('Admin Name')
                            ->required(),

                        $this->getEmailFormComponent()
                            ->label('Email Address')
                            ->placeholder('admin@example.com')
                            ->required(),
                    ])->columns(2),

                // ── Change Password Section ────────────────────────────────────
                Section::make('Change Password')
                    ->description('Leave blank to keep your current password.')
                    ->icon('heroicon-o-lock-closed')
                    ->schema([
                        $this->getPasswordFormComponent()
                            ->label('New Password')
                            ->placeholder('Minimum 8 characters')
                            ->revealable(),

                        $this->getPasswordConfirmationFormComponent()
                            ->label('Confirm New Password')
                            ->placeholder('Re-enter new password')
                            ->revealable(),
                    ])->columns(2),
            ]);
    }

    protected function getSavedNotification(): ?Notification
    {
        return Notification::make()
            ->title('✅ Profile updated successfully!')
            ->success();
    }

    protected function getFormActions(): array
    {
        return [
            $this->getSaveFormAction()
                ->label('Save Changes')
                ->icon('heroicon-o-check-circle'),
        ];
    }
}
