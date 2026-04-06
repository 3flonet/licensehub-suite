# 🚀 Panduan Lengkap Deploy LicenseHub Suite

Dokumen ini akan membantu Anda mendeploy **LicenseHub Suite** (Laravel Backend + React Frontend) ke satu domain utama: `https://license.3flo.net`.

> [!IMPORTANT]
> Sistem ini dirancang sebagai monorepo yang harmonis namun terpisah. Frontend menggunakan **React (Vite)** dan Backend menggunakan **Laravel (Filament)**. Keduanya akan berjalan di bawah satu domain yang sama menggunakan konfigurasi "Magic Link" `.htaccess`.

---

## 🏗️ Struktur Folder Server (Rekomendasi)

Agar aman dan rapi di cPanel, ikuti struktur ini:

```bash
/home/user/
├── licensehub-backend/      # Seluruh file folder 'api' (kecuali public)
│   ├── app/
│   ├── config/
│   ├── ...
├── public_html/             # Folder publik domain (license.3flo.net)
│   ├── assets/              # Hasil build React (dist/assets)
│   ├── storage/             # Symlink ke backend storage
│   ├── index.html           # File utama React
│   ├── index.php            # File utama Laravel (Entry Point)
│   └── .htaccess            # Konfigurasi perutean (The Magic Glue)
```

---

## 🛠️ Langkah 1: Persiapan Backend (Laravel)

1.  **Upload File**: Upload seluruh konten folder `api` dari komputer lokal ke folder `/home/user/licensehub-backend`.
2.  **Konfigurasi .env**: Buat file `.env` di dalam `licensehub-backend` dan sesuaikan:
    ```env
    APP_NAME="3Flo LicenseHub"
    APP_ENV=production
    APP_KEY=base64:xxx... (jalankan php artisan key:generate)
    APP_DEBUG=false
    APP_URL=https://license.3flo.net

    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=nama_db_anda
    DB_USERNAME=user_db_anda
    DB_PASSWORD=password_db_anda

    # Midtrans (Wajib diisi untuk pembayaran)
    MIDTRANS_MERCHANT_ID=...
    MIDTRANS_CLIENT_KEY=...
    MIDTRANS_SERVER_KEY=...
    MIDTRANS_IS_PRODUCTION=true
    ```
3.  **Install & Setup**:
    Buka terminal cPanel (atau SSH):
    ```bash
    cd ~/licensehub-backend
    
    # 1. Pastikan file .env sudah ada (jika belum, buat dari example)
    cp .env.example .env
    
    # 2. Install dependensi (Jika menggunakan Composer di server)
    composer install --optimize-autoloader --no-dev
    
    # 3. Generate Kunci Aplikasi (WAJIB untuk keamanan dan enkripsi)
    php artisan key:generate
    
    # 4. Migrasi Database dan Seed data admin awal
    php artisan migrate --seed
    
    # 5. Link folder storage agar file logo bisa tampil di publik
    php artisan storage:link
    
    # 6. Bersihkan cache konfigurasi
    php artisan config:cache
    ```

---

## 🎨 Langkah 2: Persiapan Frontend (React)

1.  **Konfigurasi Lokal**: Buka file `portal/.env` di komputer lokal Anda:
    ```env
    VITE_API_URL=https://license.3flo.net/api/v1
    VITE_APP_NAME="3Flo LicenseHub"
    ```
2.  **Build**: Jalankan perintah build:
    ```bash
    cd portal
    npm install
    npm run build
    ```
3.  **Upload**: Upload seluruh isi dalam folder `portal/dist/*` ke dalam folder `public_html/` di cPanel Anda.

---

## 🪄 Langkah 3: Konfigurasi "Magic Glue" (.htaccess)

Ini adalah langkah krusial untuk menggabungkan React & Laravel.

1.  **Pindahkan index.php**: Copy file `~/licensehub-backend/public/index.php` ke folder `public_html/`.
2.  **Update index.php**: Buka `public_html/index.php` dan ubah path-nya (Pastikan naik dua level `/../../` jika backend di luar public_html):
    ```php
    // Dari:
    require __DIR__.'/../vendor/autoload.php';
    $app = require_once __DIR__.'/../bootstrap/app.php';

    // Menjadi (Gunakan dua titik '../../'):
    require __DIR__.'/../../licensehub-backend/vendor/autoload.php';
    $app = require_once __DIR__.'/../../licensehub-backend/bootstrap/app.php';
    ```
3.  **Buat .htaccess**: Buat file `.htaccess` di dalam `public_html/` dengan isi berikut:

```apache
DirectoryIndex index.html index.php

<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # ── 1. Laravel Paths
    # Semua request ke /admin atau /api akan diproses oleh index.php (Laravel)
    RewriteCond %{REQUEST_URI} ^/(admin|api|livewire|storage|telescope|login-admin) [NC]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^ index.php [L]

    # ── 2. Handle static files (Images, CSS, JS)
    # Jika file ada di server (seperti asset React), langsung tampilkan
    RewriteCond %{REQUEST_FILENAME} -f [OR]
    RewriteCond %{REQUEST_FILENAME} -d
    RewriteRule ^ - [L]

    # ── 3. React SPA Fallback
    # Sisanya (rute React) akan diproses oleh index.html
    RewriteRule ^ index.html [L]
</IfModule>
```

4.  **Symlink Aset & Storage**: Di terminal cPanel (PENTING agar desain admin muncul):
    ```bash
    cd ~/public_html
    # Shortcut untuk folder publik (Agar gambar & logo muncul)
    ln -s ~/licensehub-backend/storage/app/public storage

    # Shortcut untuk aset Laravel (Agar desain admin/Filament rapi)
    ln -s ~/licensehub-backend/public/css css
    ln -s ~/licensehub-backend/public/js js
    ln -s ~/licensehub-backend/public/vendor vendor
    ```

---

## ⏰ Langkah 5: Konfigurasi CRON Job (Automasi)

Laravel membutuhkan dua CRON Job utama agar sistem berjalan otomatis:

### 1. Scheduler (Cek Status & Tugas Berkala)
- **Interval**: `Every Minute (* * * * *)`
- **Command**:
  ```bash
  /usr/local/bin/php /home/u6583521/licensehub-backend/artisan schedule:run >> /dev/null 2>&1
  ```

### 2. Queue Worker (Kirim Email Lisensi Seketika)
- **Interval**: `Every 5 Minutes (*/5 * * * *)`
- **Command**:
  ```bash
  /usr/local/bin/php /home/u6583521/licensehub-backend/artisan queue:work --stop-when-empty >> /dev/null 2>&1
  ```

*(Catatan: Path `/usr/local/bin/php` mungkin berbeda di hosting lain, gunakan `php` jika terjadi error).*

---

## ✅ Langkah 6: Verifikasi & Cek List

- [ ] `https://license.3flo.net/` menampilkan landing page modern (React).
- [ ] `https://license.3flo.net/admin` menampilkan login panel Filament (Laravel).
- [ ] `https://license.3flo.net/api/v1/products` mengembalikan data JSON produk (API).
- [ ] Klik tombol "Beli" di React memicu Midtrans Checkout dengan benar.
- [ ] Gambar/Logo muncul (Pastikan folder `storage` sudah di-link).

---

## ❓ FAQ & Troubleshooting

| Masalah | Solusi |
| :--- | :--- |
| **Encryption key error** | Jalankan `php artisan key:generate` di folder backend. |
| **Error 500** | Cek `storage/logs/laravel.log`. Pastikan versi PHP minimal 8.2 dan izin folder storage adalah 775. |
| **404 pada Rute React** | Pastikan `.htaccess` sudah tepat dan modul URL Rewrite aktif di Apache. |
| **CORS Error** | Pastikan `VITE_API_URL` menggunakan domain yang sama persis dengan `APP_URL`. |
| **Admin redirects to root** | Hapus baris `Route::get('/', fn () => redirect('/admin'));` di `api/routes/web.php` jika diperlukan. |

---

### Developed with ❤️ by **[3flo.Net Team]**
