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
                $product->api_secret = 'lh_'.bin2hex(random_bytes(16));
            }
        });

        static::saving(function ($product) {
            if ($product->description) {
                // Whitelist of safe tags for Rich Text
                $allowedTags = '<h1><h2><h3><h4><h5><h6><p><ul><ol><li><b><strong><i><em><a><u><br><hr><span><div>';
                $product->description = strip_tags($product->description, $allowedTags);
            }
        });
    }

    protected $fillable = [
        'name',
        'slug',
        'short_description',
        'description',
        'version',
        'is_active',
        'api_secret',
        'logo',
        'images',
        'download_url',
        'changelog_url',
        'documentation_url',
        'preview_url',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'images' => 'array',
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
