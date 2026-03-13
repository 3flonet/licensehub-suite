<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Super Admin Account
        User::create([
            'name' => 'Super Admin',
            'email' => 'admin@3flo.net',
            'password' => \Illuminate\Support\Facades\Hash::make('admin123'),
            'email_verified_at' => now(),
        ]);

        // Note: Products, Plans, and Orders are empty for a fresh install.
        // Documentation is available in README.md
    }
}
