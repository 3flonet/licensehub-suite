<?php

namespace App\Http\Middleware;

use App\Models\Product;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ValidateApiProductSecret
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $secret = $request->header('X-Product-Secret');

        if (! $secret) {
            return response()->json([
                'status' => 'unauthorized',
                'message' => 'X-Product-Secret header is required.',
            ], 401);
        }

        // Verify secret exists in products table
        $product = Product::where('api_secret', $secret)->first();
        if (! $product) {
            return response()->json([
                'status' => 'unauthorized',
                'message' => 'Invalid API secret.',
            ], 401);
        }

        // Store product in request for later use
        $request->attributes->add(['api_product' => $product]);

        return $next($request);
    }
}
