<?php

namespace App\Services;

use App\Models\ApiAuditLog;
use Illuminate\Http\Request;

class ApiAuditLogger
{
    public static function log(
        Request $request,
        string $endpoint,
        int $httpStatus,
        string $status,
        ?string $message = null,
        ?array $responseData = null,
    ): void {
        $requestData = $request->all();
        $productSlug = $requestData['product_slug'] ?? null;
        $licenseKey = $requestData['license_key'] ?? null;
        $domain = $requestData['domain'] ?? null;

        ApiAuditLog::create([
            'endpoint' => $endpoint,
            'method' => $request->getMethod(),
            'product_slug' => $productSlug,
            'license_key' => $licenseKey,
            'domain' => $domain,
            'ip_address' => $request->ip(),
            'http_status' => $httpStatus,
            'status' => $status,
            'message' => $message,
            'request_payload' => self::sanitizePayload($requestData),
            'response_data' => $responseData,
        ]);
    }

    /**
     * Remove sensitive data from request payload for logging
     */
    private static function sanitizePayload(array $data): array
    {
        $sensitive = ['password', 'secret', 'token', 'api_key'];

        foreach ($sensitive as $key) {
            if (isset($data[$key])) {
                $data[$key] = '***REDACTED***';
            }
        }

        return $data;
    }
}
