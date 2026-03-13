# 🛠️ Panduan Sinkronisasi: Produksi ke Lokal (Development)

Panduan ini menjelaskan cara mengambil kode terbaru dari server (cPanel) dan menjalankannya kembali di laptop (Laragon) agar lingkungan pengembangan selalu sinkron.

---

## 1. Persiapan di Sisi Server (cPanel)

Sebelum mendownload, sebaiknya kompres folder proyek agar proses download lebih cepat dan tidak ada file yang tertinggal.

1.  Masuk ke **cPanel File Manager**.
2.  Cari folder proyek Anda (misal: `licensehub_core`).
3.  Klik kanan pada folder tersebut > **Compress** > pilih **Zip Archive**.
4.  Download file `.zip` tersebut ke laptop Anda.

---

## 2. Sinkronisasi File ke Lokal (Laragon)

1.  Ekstrak file `.zip` yang sudah didownload ke dalam direktori Laragon, misalnya: `C:\laragon\www\licensehub-suite\`.
2.  **Penting:** Folder `vendor` (API) dan `node_modules` (Portal) biasanya tidak perlu didownload karena ukurannya besar. Jika Anda tidak mendownloadnya, jalankan perintah berikut di terminal:
    *   **Di folder API:** `composer install`
    *   **Di folder Portal:** `npm install`

---

## 3. Sinkronisasi Database

Langkah ini penting agar data transaksi di server juga ada di lokal untuk testing.

1.  **Di Server (phpMyAdmin cPanel):**
    *   Pilih database proyek.
    *   Klik **Export** > **Go** (simpan file `.sql`).
2.  **Di Lokal (Laragon phpMyAdmin/HeidiSQL):**
    *   Buat database baru (misal: `licensehub_dev`).
    *   Klik **Import** > pilih file `.sql` tadi > **Go**.

---

## 4. Konfigurasi Environment (`.env`)

File `.env` di server biasanya disetting untuk produksi (HTTPS, Production Keys). Anda harus menyesuaikannya untuk lokal.

### **A. Folder API (`api/.env`)**
Ubah bagian berikut:
```env
APP_ENV=local
APP_DEBUG=true
APP_URL=http://licensehub-api.test

DB_DATABASE=licensehub_dev
DB_USERNAME=root
DB_PASSWORD=

# Gunakan Sandbox Mode untuk Midtrans di Lokal
MIDTRANS_IS_PRODUCTION=false
```

### **B. Folder Portal (`portal/.env`)**
Ubah agar mengarah ke API lokal:
```env
VITE_API_URL=http://licensehub-api.test/api
VITE_MIDTRANS_ENVIRONMENT=sandbox
```

---

## 5. Langkah Terakhir (Cleanup)

Buka terminal di folder `api` (Lokal) dan jalankan:

```bash
# Hapus cache produksi yang terbawa dari server
php artisan optimize:clear

# Hubungkan kembali storage (jika ada file upload)
php artisan storage:link
```

Untuk menjalankan aplikasi:
1.  **API**: Otomatis jalan via Laragon (buka [http://licensehub-api.test](http://licensehub-api.test)).
2.  **Portal**: Jalankan `npm run dev` di folder portal.

---

## 💡 Tips Cepat
Jika Anda hanya mengubah beberapa file saja (seperti `PaymentController.php`), Anda tidak perlu mendownload semuanya. Cukup gunakan **FTP Client (FileZilla)** atau **VS Code Remote SSH** untuk mendownload file spesifik tersebut saja.

> [!IMPORTANT]
> Jangan lupa untuk **selalu** membackup file `.env` lokal Anda sebelum menimpanya dengan file dari server!
