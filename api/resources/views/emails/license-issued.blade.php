<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lisensi {{ $product->name }}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; padding: 40px; border-radius: 12px; border: 1px solid #e0e0e0; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { color: #f26522; margin: 0; font-size: 24px; font-weight: 800; }
        .license-box { background: #f8f9fa; border: 2px dashed #f26522; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0; }
        .license-key { font-family: 'Courier New', Courier, monospace; font-size: 20px; font-weight: bold; color: #333; letter-spacing: 2px; }
        .btn { display: inline-block; background: #f26522; color: #ffffff !important; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 10px; }
        .details-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .details-table td { padding: 10px; border-bottom: 1px solid #eee; font-size: 14px; }
        .label { font-weight: bold; color: #666; width: 40%; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #999; }
        hr { border: 0; border-top: 1px solid #eee; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>LICENSE ISSUED</h1>
            <p>Halo <strong>{{ $customer->name }}</strong> 👋</p>
        </div>

        <p>Terima kasih telah membeli <strong>{{ $product->name }} v{{ $product->version }}</strong>. Lisensi Anda telah berhasil dibuat.</p>

        <div class="license-box">
            <div style="font-size: 12px; color: #666; margin-bottom: 5px;">KODE LISENSI ANDA</div>
            <div class="license-key">{{ $license->license_key }}</div>
        </div>

        <table class="details-table">
            <tr>
                <td class="label">Produk</td>
                <td>{{ $product->name }}</td>
            </tr>
            <tr>
                <td class="label">Plan</td>
                <td>{{ $plan->name }}</td>
            </tr>
            <tr>
                <td class="label">Maks. Domain</td>
                <td>{{ $plan->max_domains === -1 ? '∞ (Unlimited)' : $plan->max_domains }}</td>
            </tr>
            <tr>
                <td class="label">Tgl Pembelian</td>
                <td>{{ $license->purchased_at->format('d M Y H:i') }}</td>
            </tr>
            @if($license->expires_at)
            <tr>
                <td class="label">Berlaku Hingga</td>
                <td>{{ $license->expires_at->format('d M Y') }}</td>
            </tr>
            @endif
        </table>

        <div style="text-align: center; margin-top: 30px;">
            <p style="font-weight: bold;">Download Source Code:</p>
            <a href="{{ $product->download_url }}" class="btn">Download Sekarang</a>
        </div>

        <hr>

        <div style="font-size: 14px;">
            <strong>Panduan Lainnya:</strong><br>
            • <a href="{{ $product->documentation_url }}" style="color: #f26522;">Dokumentasi Instalasi</a><br>
            • <a href="{{ $product->changelog_url }}" style="color: #f26522;">Changelog & Update</a>
        </div>

        <div class="footer">
            <p>© {{ date('Y') }} {{ config('app.name') }}. All rights reserved.<br>
            Support: support@3flo.id | WhatsApp: {{ config('services.fonnte.sender', '+62...') }}</p>
        </div>
    </div>
</body>
</html>