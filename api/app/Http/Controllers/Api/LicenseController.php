<?php

namespace App\Http\Controllers\Api;

use App\Models\License;
use App\Models\LicenseActivation;
use App\Models\Product;
use App\Services\ApiAuditLogger;
use Illuminate\Http\Request;

class LicenseController
{
    /**
     * Get product from middleware
     */
    private function getProduct(Request $request): Product
    {
        return $request->attributes->get('api_product');
    }

    /**
     * POST /api/v1/licenses/verify
     */
    public function verify(Request $request)
    {
        try {
            $validated = $request->validate([
                'license_key' => 'required|string',
                'domain' => 'required|string',
                'app_version' => 'nullable|string',
            ]);

            $product = $this->getProduct($request);

            $license = License::where('license_key', $validated['license_key'])
                ->where('product_id', $product->id)
                ->with('plan', 'customer')
                ->first();

            if (!$license) {
                $response = ['status' => 'invalid', 'message' => 'License key is not valid.'];
                ApiAuditLogger::log($request, '/licenses/verify', 422, 'invalid', 'License key not found.', $response);
                return response()->json($response, 422);
            }

            if (in_array($license->status, ['revoked', 'suspended'])) {
                $response = ['status' => $license->status, 'message' => "License has been {$license->status}."];
                ApiAuditLogger::log($request, '/licenses/verify', 422, $license->status, "License {$license->status}.", $response);
                return response()->json($response, 422);
            }

            if ($license->expires_at && now()->isAfter($license->expires_at)) {
                $license->update(['status' => 'expired']);
                $response = ['status' => 'expired', 'message' => 'License has expired.'];
                ApiAuditLogger::log($request, '/licenses/verify', 422, 'expired', 'License expired.', $response);
                return response()->json($response, 422);
            }

            $activationCount = $license->activations()->where('status', 'active')->count();
            if ($activationCount >= $license->plan->max_domains && $license->plan->max_domains > 0) {
                $existing = $license->activations()->where('domain', $validated['domain'])->where('status', 'active')->exists();
                if (!$existing) {
                    $response = ['status' => 'max_domains_exceeded', 'message' => "Max {$license->plan->max_domains} domain(s)."];
                    ApiAuditLogger::log($request, '/licenses/verify', 422, 'max_domains_exceeded', "Max domains exceeded.", $response);
                    return response()->json($response, 422);
                }
            }

            $activation = LicenseActivation::updateOrCreate(
                ['license_id' => $license->id, 'domain' => $validated['domain']],
                ['status' => 'active', 'ip_address' => $request->ip(), 'last_ping_at' => now(), 'activated_at' => now()]
            );

            if ($license->status === 'pending') {
                $license->update(['status' => 'active']);
            }

            // Calculate grace period end date
            $gracePeriodUntil = null;
            if ($license->expires_at && $license->plan->grace_period_days > 0) {
                $gracePeriodUntil = $license->expires_at->addDays($license->plan->grace_period_days)->toIso8601String();
            }

            $responseData = [
                'status' => 'active',
                'message' => 'License activated successfully.',
                'timestamp' => now()->toISOString(),
                'license' => [
                    'key' => $license->license_key,
                    'status' => $license->status,
                    'plan' => $license->plan->name,
                    'expires_at' => $license->expires_at?->toIso8601String(),
                    'grace_period_until' => $gracePeriodUntil,
                    'grace_period_days' => $license->plan->grace_period_days,
                    'max_domains' => $license->plan->max_domains,
                ],
                'customer' => ['name' => $license->customer->name, 'email' => $license->customer->email],
                'activation' => [
                    'domain' => $activation->domain,
                    'activated_at' => $activation->activated_at?->toIso8601String(),
                    'last_ping_at' => $activation->last_ping_at?->toIso8601String(),
                ],
            ];

            // Tambahkan Digital Signature
            $responseData['signature'] = $this->signResponse($responseData, $product->api_secret);

            ApiAuditLogger::log($request, '/licenses/verify', 200, 'active', 'License verified and activated.', $responseData);
            return response()->json($responseData, 200);
        } catch (\Exception $e) {
            $response = ['status' => 'error', 'message' => $e->getMessage()];
            ApiAuditLogger::log($request, '/licenses/verify', 500, 'error', $e->getMessage(), $response);
            return response()->json($response, 500);
        }
    }

    /**
     * POST /api/v1/licenses/ping
     */
    public function ping(Request $request)
    {
        try {
            $validated = $request->validate([
                'license_key' => 'required|string',
                'domain' => 'required|string',
            ]);

            $product = $this->getProduct($request);

            $license = License::where('license_key', $validated['license_key'])
                ->where('product_id', $product->id)
                ->with('plan')
                ->first();

            if (!$license) {
                $response = ['status' => 'invalid', 'message' => 'License key is not valid.'];
                ApiAuditLogger::log($request, '/licenses/ping', 422, 'invalid', 'License not found.', $response);
                return response()->json($response, 422);
            }

            $activation = LicenseActivation::where('license_id', $license->id)
                ->where('domain', $validated['domain'])
                ->first();

            if (!$activation) {
                $response = ['status' => 'invalid', 'message' => 'Domain not activated.'];
                ApiAuditLogger::log($request, '/licenses/ping', 422, 'invalid', 'Domain not activated.', $response);
                return response()->json($response, 422);
            }

            $activation->update(['last_ping_at' => now(), 'ip_address' => $request->ip()]);

            // Calculate grace period end date
            $gracePeriodUntil = null;
            if ($license->expires_at && $license->plan->grace_period_days > 0) {
                $gracePeriodUntil = $license->expires_at->addDays($license->plan->grace_period_days)->toIso8601String();
            }

            $responseData = [
                'status' => 'success',
                'message' => 'Ping successful.',
                'timestamp' => now()->toISOString(),
                'data' => [
                    'license' => [
                        'key' => $license->license_key,
                        'status' => $license->status,
                        'plan' => $license->plan->name,
                        'expires_at' => $license->expires_at?->toIso8601String(),
                        'grace_period_until' => $gracePeriodUntil,
                        'grace_period_days' => $license->plan->grace_period_days,
                    ],
                    'activation' => [
                        'domain' => $activation->domain,
                        'ip_address' => $activation->ip_address,
                        'last_ping_at' => $activation->last_ping_at?->toIso8601String(),
                        'activated_at' => $activation->activated_at?->toIso8601String(),
                    ],
                ],
            ];

            // Tambahkan Digital Signature
            $responseData['signature'] = $this->signResponse($responseData, $product->api_secret);

            ApiAuditLogger::log($request, '/licenses/ping', 200, 'success', 'Ping successful.', $responseData);
            return response()->json($responseData, 200);
        } catch (\Exception $e) {
            $response = ['status' => 'error', 'message' => $e->getMessage()];
            ApiAuditLogger::log($request, '/licenses/ping', 500, 'error', $e->getMessage(), $response);
            return response()->json($response, 500);
        }
    }

    /**
     * POST /api/v1/licenses/deactivate
     */
    public function deactivate(Request $request)
    {
        try {
            $validated = $request->validate([
                'license_key' => 'required|string',
                'domain' => 'required|string',
            ]);

            $product = $this->getProduct($request);

            $license = License::where('license_key', $validated['license_key'])
                ->where('product_id', $product->id)
                ->with('plan')
                ->first();

            if (!$license) {
                $response = ['status' => 'invalid', 'message' => 'License key is not valid.'];
                ApiAuditLogger::log($request, '/licenses/deactivate', 422, 'invalid', 'License not found.', $response);
                return response()->json($response, 422);
            }

            if (!$license->plan->allow_domain_transfer) {
                $response = ['status' => 'not_allowed', 'message' => 'Domain transfer not allowed.'];
                ApiAuditLogger::log($request, '/licenses/deactivate', 422, 'not_allowed', 'Domain transfer not allowed.', $response);
                return response()->json($response, 422);
            }

            $activation = LicenseActivation::where('license_id', $license->id)
                ->where('domain', $validated['domain'])
                ->first();

            if (!$activation) {
                $response = ['status' => 'invalid', 'message' => 'Domain not activated.'];
                ApiAuditLogger::log($request, '/licenses/deactivate', 422, 'invalid', 'Domain not activated.', $response);
                return response()->json($response, 422);
            }

            $activation->update(['status' => 'deactivated', 'deactivated_at' => now()]);

            $responseData = ['status' => 'deactivated', 'message' => 'Domain deactivated.'];
            ApiAuditLogger::log($request, '/licenses/deactivate', 200, 'deactivated', 'Domain deactivated.', $responseData);
            return response()->json($responseData, 200);
        } catch (\Exception $e) {
            $response = ['status' => 'error', 'message' => $e->getMessage()];
            ApiAuditLogger::log($request, '/licenses/deactivate', 500, 'error', $e->getMessage(), $response);
            return response()->json($response, 500);
        }
    }

    /**
     * GET /api/v1/licenses/info
     */
    public function info(Request $request)
    {
        try {
            $validated = $request->validate([
                'license_key' => 'required|string',
            ]);

            $product = $this->getProduct($request);

            $license = License::where('license_key', $validated['license_key'])
                ->where('product_id', $product->id)
                ->with('plan', 'customer')
                ->first();

            if (!$license) {
                $response = ['status' => 'invalid', 'message' => 'License key is not valid.'];
                ApiAuditLogger::log($request, '/licenses/info', 422, 'invalid', 'License not found.', $response);
                return response()->json($response, 422);
            }

            $activations = $license->activations()->where('status', 'active')->get(['domain', 'activated_at', 'last_ping_at']);

            // Calculate grace period end date
            $gracePeriodUntil = null;
            if ($license->expires_at && $license->plan->grace_period_days > 0) {
                $gracePeriodUntil = $license->expires_at->addDays($license->plan->grace_period_days)->toIso8601String();
            }

            $responseData = [
                'status' => 'success',
                'license' => [
                    'key' => $license->license_key,
                    'status' => $license->status,
                    'product' => $product->name,
                    'plan' => $license->plan->name,
                    'customer' => $license->customer->name,
                    'purchased_at' => $license->purchased_at?->toIso8601String(),
                    'expires_at' => $license->expires_at?->toIso8601String(),
                    'grace_period_until' => $gracePeriodUntil,
                    'grace_period_days' => $license->plan->grace_period_days,
                    'max_domains' => $license->plan->max_domains,
                    'domains_used' => $activations->count(),
                ],
                'activations' => $activations,
            ];

            ApiAuditLogger::log($request, '/licenses/info', 200, 'success', 'License info retrieved.', $responseData);
            return response()->json($responseData, 200);
        } catch (\Exception $e) {
            $response = ['status' => 'error', 'message' => $e->getMessage()];
            ApiAuditLogger::log($request, '/licenses/info', 500, 'error', $e->getMessage(), $response);
            return response()->json($response, 500);
        }
    }

    /**
     * Create a secure digital signature for the response
     */
    private function signResponse(array $data, string $secret): string
    {
        // Remove existing signature if any
        unset($data['signature']);
        
        // Canonicalize data (sort keys) to ensure consistent hashing
        ksort($data);
        
        $json = json_encode($data);
        return hash_hmac('sha256', $json, $secret);
    }
}
