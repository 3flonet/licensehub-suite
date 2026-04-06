<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Order extends Model
{
    use HasUuids;

    protected $fillable = [
        'customer_id',
        'plan_id',
        'amount',
        'currency',
        'status',
        'snap_token',
        'payment_id',
        'payment_method',
        'payment_metadata',
        'completed_at',
    ];

    protected $casts = [
        'payment_metadata' => 'array',
        'completed_at' => 'datetime',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(LicensePlan::class);
    }

    public function license(): HasOne
    {
        return $this->hasOne(License::class);
    }
}
