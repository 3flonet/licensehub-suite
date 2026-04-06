# 🔌 LicenseHub Integration Guide

This guide provides technical documentation on how to integrate your software (Clients) with the **LicenseHub** server to verify licenses and manage activations.

---

## 🔑 Authentication
All API requests to the license server must include your **Product Secret Key** in the request header. You can find this key in your Admin Panel under the **Products** section.

**Header:**
```http
X-Product-Secret: your_product_secret_key_here
Content-Type: application/json
Accept: application/json
```

---

## 🛰 API Endpoints

### 1. Verify & Activate License
Used to activate a license on a specific domain/environment.
- **Endpoint:** `POST /api/v1/licenses/verify`
- **Body:**
```json
{
  "license_key": "3FL0-XXXX-XXXX-XXXX",
  "domain": "customer-website.com"
}
```
- **Response (200 OK):**
```json
{
  "status": "active",
  "message": "License activated successfully.",
  "license": {
    "status": "active",
    "expires_at": "2025-12-31T23:59:59Z",
    "max_domains": 1
  },
  "signature": "base64_digital_signature_here"
}
```

### 2. License Heartbeat (Ping)
Used for periodic checks (e.g., daily) to ensure the license is still valid and the domain is still active.
- **Endpoint:** `POST /api/v1/licenses/ping`
- **Body:** Same as Verify.
- **Response:** Current license status and validity info.

### 3. Deactivate License
Used when a customer wants to move their license to a different domain.
- **Endpoint:** `POST /api/v1/licenses/deactivate`
- **Body:** Same as Verify.

---

## 💻 Code Examples

### PHP (using cURL)
```php
<?php
$client = curl_init("https://license.yourdomain.com/api/v1/licenses/verify");
$payload = json_encode([
    'license_key' => 'YOUR-LICENSE-KEY',
    'domain' => $_SERVER['HTTP_HOST']
]);

curl_setopt($client, CURLOPT_RETURNTRANSFER, true);
curl_setopt($client, CURLOPT_POST, true);
curl_setopt($client, CURLOPT_POSTFIELDS, $payload);
curl_setopt($client, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'X-Product-Secret: YOUR_PRODUCT_SECRET'
]);

$response = json_decode(curl_exec($client), true);

if ($response['status'] === 'active') {
    echo "Access Granted!";
} else {
    die("License Error: " . $response['message']);
}
```

### JavaScript (Node.js/Fetch)
```javascript
const verifyLicense = async () => {
  const response = await fetch('https://license.yourdomain.com/api/v1/licenses/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Product-Secret': 'YOUR_PRODUCT_SECRET'
    },
    body: JSON.stringify({
      license_key: 'YOUR-LICENSE-KEY',
      domain: window.location.hostname
    })
  });

  const data = await response.json();
  if (data.status === 'active') {
    console.log('Valid License');
  }
};
```

---

## 🛡 Security Best Practices
1. **Never expose your Product Secret Key** in client-side code (Frontend). Always perform license checks on your Server-Side.
2. **Signature Verification**: The API returns a `signature`. You can verify this signature on your client to ensure the response actually came from your LicenseHub server and was not tampered with.
3. **Caching**: To improve performance, cache the license status locally for 24 hours before re-checking with the server.

---

Developed by **3flo Professional Team**
