<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;

    protected static function booted()
    {
        static::creating(function ($product) {
            if (empty($product->api_secret)) {
                $product->api_secret = 'lh_' . bin2hex(random_bytes(16));
            }
        });
    }

    protected $fillable = [
        'name',
        'slug',
        'description',
        'version',
        'is_active',
        'api_secret',
        'logo',
        'download_url',
        'changelog_url',
        'documentation_url',
        'preview_url',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function licensePlans(): HasMany
    {
        return $this->hasMany(LicensePlan::class);
    }

    public function licenses(): HasMany
    {
        return $this->hasMany(License::class);
    }
}
