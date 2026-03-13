<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;

class User extends Authenticatable implements FilamentUser
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Izinkan akses ke Admin Panel
     */
    public function canAccessPanel(Panel $panel): bool
    {
        // Untuk testing, kita izinkan SEMUA user yang sudah login.
        // Nanti kalau sudah aman, Boss bisa ganti jadi:
        // return str_ends_with($this->email, '@3flo.net');
        return true;
    }
}
