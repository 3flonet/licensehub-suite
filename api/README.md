# 🔐 LicenseHub — Professional License Management System

![LicenseHub Banner](https://raw.githubusercontent.com/3flonet/licensehub-suite/main/api/preview.png)

[![Laravel 11](https://img.shields.io/badge/Laravel-11.x-FF2D20?style=for-the-badge&logo=laravel)](https://laravel.com)
[![Filament v3](https://img.shields.io/badge/Filament-v3.2-FFA116?style=for-the-badge&logo=laravel)](https://filamentphp.com)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v3-06B6D4?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge)](LICENSE)

**LicenseHub** is a premium, full-stack solution for developers and companies to manage software licenses, hardware activations, and recurring payments. It features a high-performance **Admin Command Center** (built with Filament v3) and a **Premium Customer Portal** (built with React) with a hybrid-responsive mobile experience.

---

## ✨ Key Features

### 🛠 Administrative Powerhouse
- **Dynamic Product Management**: Manage multiple software products with version control.
- **Automated License Engine**: Generate, track, and expire licenses based on flexible plans.
- **Payment Integration**: Seamless **Midtrans API** integration for automated settlement and license delivery.
- **Visual Analytics**: Real-time revenue trends, daily sales charts, and activation metrics.

### 👤 Premium Customer Portal
- **Hybrid Responsive UI**: Smooth table views on Desktop and glassmorphism card-based layouts on Mobile.
- **Command Center**: Manage active licenses, view license keys, and track validity.
- **Transaction Ledger**: Complete order history with "Settle Now" integration for pending payments.

### 🛡 Security & Integration
- **Hardened Security**: Multi-factor authentication ready and role-based access control (RBAC).
- **API Secret Authentication**: Secure application-to-server communication for license verification.
- **PWA Ready**: Mobile-friendly web app experience for end-users.

---

## 🚀 Technology Stack

### Backend (The Brain)
- **Framework**: Laravel 11
- **Admin Panel**: Filament v3 (TALL Stack)
- **Payment Gateway**: Midtrans SDK
- **Websockets**: Laravel Reverb (Real-time updates)
- **Database**: MySQL / PostgreSQL

### Frontend (The Face)
- **Library**: React 18+
- **Styling**: Tailwind CSS & Vanilla CSS
- **Animations**: Framer Motion (Premium micro-interactions)
- **State Management**: Zustand
- **Icons**: Lucide React

---

## 🛠 Installation Guide

### Prerequisites
- PHP 8.2 or higher
- Node.js 18+ & NPM
- Composer
- Laragon / XAMPP / Valet

### Step 1: Backend Setup (Laravel)
```bash
git clone https://github.com/3flonet/licensehub-suite.git
cd licensehub-suite/api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
```

### Step 2: Frontend Setup (React)
```bash
cd ..
cd licensehub-frontend
npm install
cp .env.example .env.local
npm run dev
```

---

## ⚙ Environment Configuration

Make sure to configure your `.env` for the core services:

```env
# Database
DB_DATABASE=licensehub

# Midtrans Configuration
MIDTRANS_SERVER_KEY=your_server_key
MIDTRANS_CLIENT_KEY=your_client_key
MIDTRANS_IS_PRODUCTION=false

# Reverb (Real-time)
REVERB_APP_ID=your_id
REVERB_APP_KEY=your_key
```

---

## 📱 Mobile Experience
The system uses a **Hybrid-Response Architecture**. While administrators enjoy a robust data-table view, end-customers are presented with a modern, card-based interface optimized for touch interaction and quick license management on the go.

---

## 🔐 Default Credentials (Clean Install)

After running the migration and seeder, use the following credentials to access the Admin Panel:

- **URL**: `YOUR_DOMAIN/admin`
- **Email**: `admin@3flo.net`
- **Password**: `admin123`

> [!WARNING]
> Please change your password immediately after the first login for security reasons.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Developed with ❤️ by **3flo Professional Team**
