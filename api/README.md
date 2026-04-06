# ⚙️ LicenseHub API (Backend)

Dokumentasi teknis untuk **Admin Command Center** dan **License Verification API**. Dibangun dengan infrastruktur yang aman untuk mengelola siklus hidup lisensi perangkat lunak.

<div align="left">

![PHP](https://img.shields.io/badge/php-%23777BB4.svg?style=for-the-badge&logo=php&logoColor=white)
![Laravel](https://img.shields.io/badge/laravel-%23FF2D20.svg?style=for-the-badge&logo=laravel&logoColor=white)
![Filament](https://img.shields.io/badge/filament-%23FFA116.svg?style=for-the-badge&logo=laravel&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)

</div>

---

## 🚀 Fitur Utama Backend

- **Admin Panel (Filament v3)**: Manajemen produk, lisensi, aktivasi, dan pelanggan secara visual.
- **Sistem Antrian (Queue)**: Pengiriman notifikasi Email & WhatsApp (Fonnte) berjalan di belakang layar untuk performa maksimal.
- **Webhook Midtrans**: Otomatisasi penerbitan lisensi setelah pembayaran berhasil dikonfirmasi.
- **Hardened Security**: 
    - Penandatanganan digital (digital signature) untuk setiap respon lisensi.
    - Token integritas untuk mencegah tampering di sisi klien.

---

## 🛠 Panduan Instalasi (Development)

Pastikan lingkungan lokal Anda memenuhi syarat (PHP 8.2 & MySQL).

```bash
# 1. Masuk ke folder api
cd api

# 2. Instalasi Dependensi
composer install

# 3. Konfigurasi Link Storage
php artisan storage:link

# 4. Migrasi & Seed Data
php artisan migrate --seed

# 5. Jalankan Antrian (Wajib untuk Email/WA)
php artisan queue:work

# 6. Jalankan Server
php artisan serve
```

---

## ⚙️ Variabel Lingkungan (.env)

Konfigurasikan variabel kunci berikut untuk fungsi sistem yang lengkap:

```env
# 🛡️ License Configuration
# Secret key digunakan untuk menandatangani respon API
LICENSE_HUB_PRODUCT_SECRET="your-secret-key"

# 📧 Mail Configuration
MAIL_MAILER=smtp
MAIL_HOST=mailtrap.io

# 📲 WhatsApp (Fonnte)
FONNTE_TOKEN="your-token"

# 💳 Payment Gateway (Midtrans)
MIDTRANS_SERVER_KEY="your-server-key"
MIDTRANS_CLIENT_KEY="your-client-key"
```

---

## 🧪 Testing

Sistem ini dilengkapi dengan pengujian otomatis menggunakan PHPUnit. 

```bash
php artisan test
```

---

### [Kembali ke Halaman Utama (Suite)](../README.md)
