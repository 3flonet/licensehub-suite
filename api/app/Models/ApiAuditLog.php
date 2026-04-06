<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ApiAuditLog extends Model
{
    use HasUuids;

    protected $keyType = 'string';

    public $incrementing = false;

    protected $table = 'api_audit_logs';

    protected $fillable = [
        'endpoint',
        'method',
        'product_slug',
        'license_key',
        'domain',
        'ip_address',
        'http_status',
        'status',
        'message',
        'request_payload',
        'response_data',
    ];

    protected $casts = [
        'request_payload' => 'array',
        'response_data' => 'array',
    ];
}
