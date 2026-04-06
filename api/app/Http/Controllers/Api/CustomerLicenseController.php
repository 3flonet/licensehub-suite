<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LicenseActivation;
use Illuminate\Http\Request;

class CustomerLicenseController extends Controller
{
    /**
     * List current customer's licenses
     */
    public function index(Request $request)
    {
        $licenses = $request->user()->licenses()
            ->with(['product', 'plan'])
            ->latest()
            ->get();

        return response()->json($licenses);
    }

    /**
     * Get license detail
     */
    public function show(Request $request, $id)
    {
        $license = $request->user()->licenses()
            ->with(['product', 'plan', 'activations'])
            ->findOrFail($id);

        return response()->json($license);
    }

    /**
     * Deactivate a domain
     */
    public function deactivate(Request $request, $activationId)
    {
        $activation = LicenseActivation::whereHas('license', function ($query) use ($request) {
            $query->where('customer_id', $request->user()->id);
        })->findOrFail($activationId);

        $activation->delete();

        return response()->json(['message' => 'Domain deactivated successfully']);
    }
}
