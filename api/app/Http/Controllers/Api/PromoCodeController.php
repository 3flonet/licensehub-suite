<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LicensePlan;
use App\Models\PromoCode;
use Illuminate\Http\Request;

class PromoCodeController extends Controller
{
    /**
     * Validate a promo code against a cart of items (License Plans)
     */
    public function validateCode(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.plan_id' => 'required|exists:license_plans,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $codeStr = strtoupper($request->code);
        $promo = PromoCode::where('code', $codeStr)->first();

        if (! $promo) {
            return response()->json(['message' => 'Promo code not found or invalid.'], 404);
        }

        if (! $promo->isValid()) {
            return response()->json(['message' => 'This promo code has expired or reached its usage limit.'], 400);
        }

        // Calculate subtotal and collect valid target items
        $subtotal = 0;
        $validItemsSubtotal = 0;
        $items = [];

        foreach ($request->items as $itemReq) {
            $plan = LicensePlan::find($itemReq['plan_id']);
            $itemTotal = $plan->price * $itemReq['quantity'];
            $subtotal += $itemTotal;

            // Check if this item is eligible for the promo
            $isEligible = true;

            if ($promo->product_id && $plan->product_id !== $promo->product_id) {
                $isEligible = false;
            }

            if ($promo->license_plan_id && $plan->id !== $promo->license_plan_id) {
                $isEligible = false;
            }

            if ($isEligible) {
                $validItemsSubtotal += $itemTotal;
            }

            $items[] = [
                'plan_id' => $plan->id,
                'price' => $plan->price,
                'quantity' => $itemReq['quantity'],
                'eligible' => $isEligible,
            ];
        }

        if ($validItemsSubtotal == 0) {
            return response()->json(['message' => 'This promo code is not applicable to any items in your cart.'], 400);
        }

        if ($promo->min_order_amount && $subtotal < $promo->min_order_amount) {
            return response()->json([
                'message' => 'Minimum order amount of IDR '.number_format($promo->min_order_amount, 0, ',', '.').' not met.',
            ], 400);
        }

        // Calculate Discount
        $discountAmount = 0;

        if ($promo->type === 'percentage') {
            $discountAmount = $validItemsSubtotal * ($promo->value / 100);

            // Apply max discount cap if set
            if ($promo->max_discount_amount && $discountAmount > $promo->max_discount_amount) {
                $discountAmount = $promo->max_discount_amount;
            }
        } elseif ($promo->type === 'fixed') {
            // Distribute fixed discount across eligible items, capped at the valid items subtotal
            $discountAmount = min($promo->value, $validItemsSubtotal);
        }

        return response()->json([
            'message' => 'Promo code applied successfully.',
            'promo' => [
                'id' => $promo->id,
                'code' => $promo->code,
                'name' => $promo->name,
                'type' => $promo->type,
                'value' => $promo->value,
            ],
            'original_subtotal' => $subtotal,
            'discount_amount' => $discountAmount,
            'final_total' => max(0, $subtotal - $discountAmount),
        ]);
    }
}
