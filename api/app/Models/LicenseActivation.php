<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LicenseActivation extends Model
{
    use HasUuids;

    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = [
        'license_id',
        'domain',
        'ip_address',
        'status',
        'activated_at',
        'last_ping_at',
        'deactivated_at',
    ];

    protected $casts = [
        'activated_at' => 'datetime',
        'last_ping_at' => 'datetime',
        'deactivated_at' => 'datetime',
    ];

    public function license(): BelongsTo
    {
        return $this->belongsTo(License::class);
    }
}
