<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LicensePlan extends Model
{
    use HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'product_id',
        'name',
        'billing_model',
        'price',
        'max_domains',
        'validity_days',
        'grace_period_days',
        'allow_domain_transfer',
        'max_transfer_count',
        'trial_days',
        'is_active',
        'features',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_active' => 'boolean',
        'allow_domain_transfer' => 'boolean',
        'features' => 'array',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function licenses(): HasMany
    {
        return $this->hasMany(License::class);
    }
}
