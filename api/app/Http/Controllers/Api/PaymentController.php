<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\License;
use App\Models\LicensePlan;
use App\Models\Order;
use App\Models\PromoCode;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Midtrans\Config;
use Midtrans\Notification;
use Midtrans\Snap;

class PaymentController extends Controller
{
    public function __construct()
    {
        Config::$serverKey = config('services.midtrans.server_key');
        Config::$isProduction = config('services.midtrans.is_production');
        Config::$isSanitized = config('services.midtrans.is_sanitized');
        Config::$is3ds = config('services.midtrans.is_3ds');
    }

    /**
     * Create Snap Token for Midtrans
     */
    public function createSnapToken(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:license_plans,id',
            'promo_code' => 'nullable|string',
        ]);

        $plan = LicensePlan::with('product')->findOrFail($request->plan_id);
        $customer = $request->user();

        $originalAmount = $plan->price;
        $discountAmount = 0;
        $appliedPromo = null;

        // Verify promo code if provided
        if ($request->promo_code) {
            $promo = PromoCode::where('code', strtoupper($request->promo_code))->first();

            if ($promo && $promo->isValid()) {
                $isEligible = true;

                if ($promo->product_id && $plan->product_id !== $promo->product_id) {
                    $isEligible = false;
                }
                if ($promo->license_plan_id && $plan->id !== $promo->license_plan_id) {
                    $isEligible = false;
                }
                if ($promo->min_order_amount && $originalAmount < $promo->min_order_amount) {
                    $isEligible = false;
                }

                if ($isEligible) {
                    $appliedPromo = $promo;
                    if ($promo->type === 'percentage') {
                        $discountAmount = $originalAmount * ($promo->value / 100);
                        if ($promo->max_discount_amount && $discountAmount > $promo->max_discount_amount) {
                            $discountAmount = $promo->max_discount_amount;
                        }
                    } else {
                        $discountAmount = min($promo->value, $originalAmount);
                    }
                }
            } elseif ($promo) {
                return response()->json(['message' => 'Kode promo ini sudah tidak berlaku.'], 400);
            }
        }

        $finalAmount = max(0, $originalAmount - $discountAmount);

        // 1. Create Order in Pending State
        $order = Order::create([
            'customer_id' => $customer->id,
            'plan_id' => $plan->id,
            'amount' => $finalAmount,
            'currency' => 'IDR',
            'status' => 'pending',
            'promo_code_id' => $appliedPromo?->id, // If you have this column
        ]);

        // 2. Prepare Midtrans Payload
        $frontendUrl = rtrim(env('FRONTEND_URL', 'http://127.0.0.1:3000'), '/');

        $params = [
            'transaction_details' => [
                'order_id' => $order->id,
                'gross_amount' => (int) $finalAmount,
            ],
            'customer_details' => [
                'first_name' => $customer->name,
                'email' => $customer->email,
                'phone' => $customer->phone,
            ],
            'item_details' => [
                [
                    'id' => $plan->id,
                    'price' => (int) $originalAmount,
                    'quantity' => 1,
                    'name' => $plan->product->name.' - '.$plan->name,
                ],
            ],
            'callbacks' => [
                'finish' => $frontendUrl.'/payment-success',
            ],
        ];

        // Add Discount Item
        if ($discountAmount > 0 && $appliedPromo) {
            $params['item_details'][] = [
                'id' => 'PROMO-'.$appliedPromo->code,
                'price' => -(int) $discountAmount,
                'quantity' => 1,
                'name' => 'Discount ('.$appliedPromo->code.')',
            ];
        }

        try {
            $snapToken = Snap::getSnapToken($params);

            // 3. Save Snap Token to Order for "Resume Payment" feature
            $order->update(['snap_token' => $snapToken]);

            return response()->json(['snap_token' => $snapToken, 'order_id' => $order->id]);
        } catch (\Exception $e) {
            Log::error('Midtrans Snap Token Error: '.$e->getMessage());

            return response()->json(['message' => 'Gagal membuat token pembayaran'], 500);
        }
    }

    /**
     * Handle Midtrans Webhook Notification with Security Verification
     */
    public function webhook(Request $request)
    {
        // Respon cepat untuk "Tes URL" dari Midtrans (Permintaan Tanpa Body)
        if (empty($request->all())) {
            return response()->json(['message' => 'Webhook receiver is active'], 200);
        }

        try {
            $notification = new Notification;

            // --- VERIFIKASI SIGNATURE (High Compatibility Mode) ---
            $serverKey = config('services.midtrans.server_key');
            $orderId = $notification->order_id;
            $statusCode = $notification->status_code;
            $grossAmount = $notification->gross_amount;

            // 1. Try with original string amount (as-is from JSON)
            $signatureKey = hash('sha512', $orderId.$statusCode.$grossAmount.$serverKey);

            // 2. Try with .00 format (Classic Midtrans Requirement)
            if ($signatureKey !== $notification->signature_key) {
                $amountWithDecimals = number_format((float) $grossAmount, 2, '.', '');
                $signatureKey = hash('sha512', $orderId.$statusCode.$amountWithDecimals.$serverKey);
            }

            // 3. Try with Integer format
            if ($signatureKey !== $notification->signature_key) {
                $intAmount = (int) $grossAmount;
                $signatureKey = hash('sha512', $orderId.$statusCode.$intAmount.$serverKey);
            }

            if ($signatureKey !== $notification->signature_key) {
                Log::critical('PAYMENT SECURITY ALERT: Invalid Webhook Signature!', [
                    'received_sig' => $notification->signature_key,
                    'order_id' => $orderId,
                    'payload' => $request->all(),
                ]);

                return response()->json(['message' => 'Invalid signature'], 403);
            }

            $transaction = $notification->transaction_status;
            $type = $notification->payment_type;
            $fraud = $notification->fraud_status;

            $order = Order::find($orderId);

            if (! $order) {
                return response()->json(['message' => 'Notification received, order not found'], 200);
            }

            // --- Logika Penentuan Status Sukses (Lebih Fleksibel) ---
            $isSuccess = false;

            if ($transaction == 'capture') {
                if ($type == 'credit_card') {
                    if ($fraud == 'challenge') {
                        $order->status = 'pending';
                    } else {
                        $isSuccess = true;
                    }
                }
            } elseif ($transaction == 'settlement' || $statusCode == '200') {
                $isSuccess = true;
            } elseif ($transaction == 'deny') {
                $order->status = 'failed';
            } elseif ($transaction == 'expire') {
                $order->status = 'expired';
            } elseif ($transaction == 'cancel') {
                $order->status = 'cancelled';
            }

            $order->payment_id = $notification->transaction_id;
            $order->payment_method = $type;

            if ($isSuccess) {
                $order->status = 'completed';
                if (! $order->completed_at) {
                    $order->completed_at = now();
                }
            }

            $order->save();

            // Trigger fulfillment ONLY after the order is saved as 'completed'
            if ($isSuccess && $order->status === 'completed') {
                $this->handleFulfillment($order);
            }

            return response()->json(['message' => 'Webhook handled']);

        } catch (\Exception $e) {
            Log::error('Midtrans Webhook Error: '.$e->getMessage());

            // JIKA ERRORNYA KARENA TRANSAKSI TIDAK ADA (SAAT TES URL DENGAN ID PALSU)
            // KITA TETAP KASIH STATUS 200 BIAR MIDTRANS SENANG DAN BISA SIMPAN URL
            if (str_contains($e->getMessage(), "Transaction doesn't exist")) {
                return response()->json(['message' => 'Test notification received successfully'], 200);
            }

            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    /**
     * Handle Success/Fulfillment with Promo Race Condition prevention
     */
    private function handleFulfillment(Order $order)
    {
        $license = DB::transaction(function () use ($order) {
            // 1. Double check order status
            $order = Order::lockForUpdate()->find($order->id);
            if ($order->status !== 'completed') {
                return null;
            }

            // 2. Prevent duplicate license
            if (License::where('order_id', $order->id)->exists()) {
                return null;
            }

            // 3. Handle Promo Usage (Delayed until success to prevent exhaustion attacks)
            if ($order->promo_code_id) {
                $promo = PromoCode::lockForUpdate()->find($order->promo_code_id);
                if ($promo) {
                    $promo->increment('used_count');
                }
            }

            $plan = $order->plan;
            $license = License::create([
                'customer_id' => $order->customer_id,
                'product_id' => $plan->product_id,
                'plan_id' => $plan->id,
                'order_id' => $order->id,
                'status' => 'active',
                'purchased_at' => now(),
                'expires_at' => $plan->validity_days ? now()->addDays($plan->validity_days) : null,
            ]);

            return $license;
        });

        if ($license) {
            // KIRIM NOTIFIKASI SECARA LANGSUNG (Sync)
            try {
                $license->load(['customer', 'product', 'plan']);
                $notifier = new NotificationService;
                $notifier->sendLicenseDelivery($license);
            } catch (\Exception $e) {
                Log::error("Failed to send automatic notifications for order {$order->id}: ".$e->getMessage());
            }
        }
    }
}
