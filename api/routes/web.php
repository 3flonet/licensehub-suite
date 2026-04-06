<?php

use Illuminate\Support\Facades\Route;

// Redirect root URL → Admin Panel (works for both artisan serve & Apache)
Route::get('/', fn () => redirect('/admin'));
