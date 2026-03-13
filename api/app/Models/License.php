<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class License extends Model
{
    use HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'product_id',
        'plan_id',
        'customer_id',
        'order_id',
        'license_key',
        'status',
        'purchased_at',
        'expires_at',
        'notes',
    ];

    protected $casts = [
        'purchased_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    /**
     * Boot the model
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (!$model->license_key) {
                // Generate unique license key
                do {
                    $segment1 = strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 4));
                    $segment2 = strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 4));
                    $segment3 = strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 4));
                    $segment4 = strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 4));
                    $key = '3FLO-' . $segment1 . '-' . $segment2 . '-' . $segment3 . '-' . $segment4;
                } while (self::where('license_key', $key)->exists());

                $model->license_key = $key;
            }

            // Set purchase date if not set
            if (!$model->purchased_at) {
                $model->purchased_at = now();
            }

            // Set status default
            if (!$model->status) {
                $model->status = 'pending';
            }
        });
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(LicensePlan::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function activations(): HasMany
    {
        return $this->hasMany(LicenseActivation::class);
    }
    
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Get formatted message for WhatsApp/Text
     */
    public function getFormattedMessage(): string
    {
        $product = $this->product;
        $customer = $this->customer;
        $plan = $this->plan;

        return "Halo *{$customer->name}* 👋\n\n" .
            "Terima kasih telah membeli *{$product->name} v{$product->version}*!\n\n" .
            "Berikut detail lisensi Anda:\n\n" .
            "🔑 *LICENSE KEY*\n" .
            "`{$this->license_key}`\n\n" .
            "📥 *Link Download Source Code*\n" .
            "{$product->download_url}\n\n" .
            "📖 *Dokumentasi Instalasi*\n" .
            "{$product->documentation_url}\n\n" .
            "─────────────────────\n" .
            "⚠️ *Catatan Penting*\n" .
            "• Key ini hanya untuk *{$plan->max_domains} domain*\n" .
            "• Jangan bagikan key Anda\n" .
            "• Simpan pesan ini sebagai bukti\n\n" .
            "Butuh bantuan instalasi? Hubungi kami di " . env('WHATSAPP_NUMBER') . " ya 🙂";
    }
}
