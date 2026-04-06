<?php

namespace App\Http\Middleware;

use App\Settings\SiteSettings;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckMaintenanceMode
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $site = app(SiteSettings::class);

        if ($site->is_maintenance_mode) {
            // Allow Admin Panel
            if ($request->is('admin*') || $request->is('livewire*')) {
                return $next($request);
            }

            // Allow Webhooks & Public Settings (Safety)
            if ($request->is('api/v1/webhooks*') || $request->is('api/v1/settings/site')) {
                return $next($request);
            }

            return response()->json([
                'success' => false,
                'status' => 'maintenance',
                'message' => $site->maintenance_message,
            ], 503);
        }

        return $next($request);
    }
}
