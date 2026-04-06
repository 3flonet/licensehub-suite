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
            if (! $model->license_key) {
                // Generate unique license key
                do {
                    $segment1 = strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 4));
                    $segment2 = strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 4));
                    $segment3 = strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 4));
                    $segment4 = strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 4));
                    $key = '3FLO-'.$segment1.'-'.$segment2.'-'.$segment3.'-'.$segment4;
                } while (self::where('license_key', $key)->exists());

                $model->license_key = $key;
            }

            // Set purchase date if not set
            if (! $model->purchased_at) {
                $model->purchased_at = now();
            }

            // Set status default
            if (! $model->status) {
                $model->status = 'pending';
            }
        });

        static::updated(function ($license) {
            // Jika lisensi expire, revoked, atau suspended, matikan semua aktivasi domainnya
            if ($license->isDirty('status') && in_array($license->status, ['expired', 'revoked', 'suspended'])) {
                $license->activations()->update([
                    'status' => 'deactivated',
                    'deactivated_at' => now(),
                ]);
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

        return "Halo *{$customer->name}* 👋\n\n".
            "Terima kasih telah membeli *{$product->name} v{$product->version}*!\n\n".
            "Berikut detail lisensi Anda:\n\n".
            "🔑 *LICENSE KEY*\n".
            "`{$this->license_key}`\n\n".
            "🔐 *PRODUCT SECRET KEY*\n".
            "`{$product->api_secret}`\n\n".
            "📥 *Link Download Source Code*\n".
            "{$product->download_url}\n\n".
            "📖 *Dokumentasi Instalasi*\n".
            "{$product->documentation_url}\n\n".
            "─────────────────────\n".
            "⚠️ *Pemberitahuan*\n".
            "• Key ini hanya untuk *{$plan->max_domains} domain*\n".
            "• Simpan License Key & Product Secret Key untuk aktivasi\n".
            "• Jangan bagikan key Anda kepada siapapun\n\n".
            'Butuh bantuan? Balas pesan ini atau hubungi '.(env('WHATSAPP_NUMBER') ?: '+62...').' ya 🙂';
    }
}
