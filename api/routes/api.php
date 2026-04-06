<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CustomerLicenseController;
use App\Http\Controllers\Api\LicenseController;
use App\Http\Controllers\Api\PasswordResetController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\PromoCodeController;
use App\Http\Controllers\Api\SupportController;
use App\Models\Faq;
use App\Models\License;
use App\Models\LicenseActivation;
use App\Models\Product;
use App\Settings\MidtransSettings;
use App\Settings\SiteSettings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Version 1
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // --- Public Storefront API ---
    Route::get('/settings/site', function () {
        $site = app(SiteSettings::class)->toArray();
        $midtrans = app(MidtransSettings::class);

        $site['midtrans'] = [
            'client_key' => $midtrans->client_key,
            'is_production' => $midtrans->is_production,
        ];

        return $site;
    });

    Route::get('/products', function () {
        return Product::where('is_active', true)->with('licensePlans')->get();
    });

    Route::get('/faqs', function () {
        return Faq::where('is_active', true)
            ->orderBy('sort_order')
            ->get();
    });

    Route::get('/products/{product:slug}', function (Product $product) {
        return $product->load('licensePlans');
    });

    Route::post('/support/contact', [SupportController::class, 'contact'])->middleware('throttle:5,1');

    // --- Promotions ---
    Route::post('/promos/validate', [PromoCodeController::class, 'validateCode'])->middleware('throttle:5,1');

    // --- Authentication ---
    Route::middleware('throttle:5,1')->group(function () {
        Route::post('/auth/register', [AuthController::class, 'register']);
        Route::post('/auth/login', [AuthController::class, 'login']);
        Route::post('/auth/forgot-password', [PasswordResetController::class, 'sendResetLinkEmail'])->name('password.email');
        Route::post('/auth/reset-password', [PasswordResetController::class, 'reset'])->name('password.update');
    });

    // --- License API (Protected by Product Secret) ---
    Route::middleware(['api.product.secret', 'throttle:60,1'])->group(function () {
        // POST { license_key, domain, product_slug } → aktifkan domain
        Route::post('/licenses/verify', [LicenseController::class, 'verify']);
        // POST { license_key, domain, product_slug } → heartbeat harian
        Route::post('/licenses/ping', [LicenseController::class, 'ping']);
        // GET  { license_key, domain, product_slug } → info lisensi + daftar domain
        Route::get('/licenses/info', [LicenseController::class, 'info']);
        // POST { license_key, domain, product_slug } → deaktifkan domain
        Route::post('/licenses/deactivate', [LicenseController::class, 'deactivate']);
    });

    // --- Protected Portal API ---
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/user', [AuthController::class, 'me']);
        Route::patch('/user', [AuthController::class, 'updateProfile']);
        Route::post('/user/change-password', [AuthController::class, 'changePassword']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        // Licenses
        Route::get('/portal/licenses', [CustomerLicenseController::class, 'index']);
        Route::get('/portal/licenses/{license}', [CustomerLicenseController::class, 'show']);
        Route::delete('/portal/activations/{activation}', [CustomerLicenseController::class, 'deactivate']);

        // Payments
        Route::post('/portal/payments/snap-token', [PaymentController::class, 'createSnapToken']);
        Route::get('/portal/orders', function (Request $request) {
            return $request->user()->orders()->with('plan.product')->latest()->get();
        });
    });

    // --- Webhooks (Public) ---
    Route::post('/webhooks/midtrans', [PaymentController::class, 'webhook']);

    // --- Public Stats for Shields.io (README Dynamic Badges) ---
    Route::get('/stats/total-licenses', function () {
        $count = License::count();

        return response()->json([
            'schemaVersion' => 1,
            'label' => 'Licenses Processed',
            'message' => number_format($count),
            'color' => '007bff',
        ]);
    });

    Route::get('/stats/total-activations', function () {
        $count = LicenseActivation::where('status', 'active')->count();

        return response()->json([
            'schemaVersion' => 1,
            'label' => 'Active Installs',
            'message' => number_format($count),
            'color' => '28a745',
        ]);
    });
});
