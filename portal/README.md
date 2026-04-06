# 💻 LicenseHub Portal (Frontend)

Dokumentasi teknis untuk **Premium Customer Portal** - React SPA yang modern dan responsif untuk manajemen lisensi bagi pelanggan.

<div align="left">

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/framer%20motion-black?style=for-the-badge&logo=framer&logoColor=white)
![Zustand](https://img.shields.io/badge/zustand-blue?style=for-the-badge)

</div>

---

## 📺 Fitur Utama Portal

- **Hybrid-Responsive UI**: Tampilan Desktop (Tabel) dan Mobile (Glassmorphism Card) yang mulus.
- **Toko Lisensi**: Telusuri paket lisensi dan beli langsung via Midtrans Snap.
- **Portal Kustom**: Pelanggan bisa melihat riwayat lisensi, key produk, dan sisa aktivasinya.
- **Real-time Status**: Sinkronisasi instan status pembayaran (Pending/Settlement) via webhook.

---

## 🛠 Panduan Instalasi (Development)

Pastikan lingkungan lokal Anda memiliki Node.js 18+ dan NPM.

```bash
# 1. Masuk ke folder portal
cd portal

# 2. Instalasi Dependensi
npm install

# 3. Konfigurasi Environment (Paling Penting!)
cp .env.example .env.local

# 4. Jalankan Server Dev
npm run dev
```

---

## 📂 Struktur Proyek

```
src/
├── components/      # Komponen Atom & UI yang dapat digunakan kembali
├── pages/          # Halaman portal (Dashboard, Shop, Login, dsb.)
├── services/       # Service Axios untuk integrasi API Laravel
├── store/          # Zustand State Management (Auth & UI State)
├── hooks/          # React hooks kustom
├── assets/         # Gambar, logo, gaya CSS murni
├── App.jsx         # Root routing
└── main.jsx        # Entry point React
```

---

## 🛰 Integrasi API & Pembayaran

Portal ini berkomunikasi dengan Laravel Backend melalui API. 

### Konfigurasi `.env.local`:
```env
# URL API Backend Laravel
VITE_API_BASE_URL=http://localhost:8000

# Kredensial Midtrans Sandbox (Public Client Key)
VITE_MIDTRANS_CLIENT_KEY="your-client-key"
VITE_MIDTRANS_ENVIRONMENT=sandbox
```

---

## 🏗 Build & Produksi

Untuk mendeploy ke cPanel atau VPS:

```bash
# 1. Jalankan proses build
npm run build

# 2. Hasil build ada di folder: dist/
# 3. Upload isi folder dist/ ke host Anda.
```

---

### [Kembali ke Halaman Utama (Suite)](../README.md)
