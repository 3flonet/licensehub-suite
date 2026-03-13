<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\License;
use App\Models\LicensePlan;
use App\Models\Product;
use Illuminate\Database\Seeder;

class TestDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Product
        $product = Product::updateOrCreate(
            ['slug' => 'dineflo-pos'],
            [
                'name' => 'Dineflo POS',
                'description' => 'Sistem POS untuk restoran',
                'version' => '2.0.0',
                'api_secret' => 'test-secret-dineflo-pos-12345',
                'download_url' => 'https://releases.dineflo.test/dineflo-pos-2.0.0.zip',
                'documentation_url' => 'https://docs.dineflo.test/pos',
                'is_active' => true,
            ]
        );

        // Create License Plan
        $plan = LicensePlan::updateOrCreate(
            ['product_id' => $product->id, 'name' => 'Lifetime License'],
            [
                'billing_model' => 'one_time',
                'price' => 500000,
                'max_domains' => 1,
                'validity_days' => 0,
                'grace_period_days' => 7,
                'allow_domain_transfer' => true,
                'max_transfer_count' => 5,
                'trial_days' => 0,
                'is_active' => true,
            ]
        );

        // Create Customer
        $customer = Customer::updateOrCreate(
            ['email' => 'budi@dineflo.test'],
            [
                'name' => 'Budi Santoso',
                'phone' => '081234567890',
                'company' => 'Restoran Makan Enak',
            ]
        );

        // Create License (auto-generates key)
        $license = License::where('customer_id', $customer->id)
            ->where('product_id', $product->id)
            ->first();

        if (!$license) {
            $license = License::create([
                'product_id' => $product->id,
                'plan_id' => $plan->id,
                'customer_id' => $customer->id,
                'status' => 'pending',
            ]);
        }

        echo "✓ Product: {$product->slug}\n";
        echo "✓ License Plan: {$plan->name}\n";
        echo "✓ Customer: {$customer->name}\n";
        echo "✓ License Key: {$license->license_key}\n\n";
    }
}
