# 🛍️ Erset Store

> **Pusat Belanja Produk Import** — Toko online modern dibangun dengan React, TypeScript, Tailwind CSS, dan Lucide Icons.

Web e-commerce lengkap dengan demo produk, filter pencarian, keranjang belanja, kupon promo, multi-step checkout, dan halaman konfirmasi pesanan. Semua antarmuka pengguna dalam **Bahasa Indonesia**.

## ✨ Fitur

### Halaman
- 🏠 **Beranda** — Hero, fitur unggulan, kategori, flash sale, produk terbaru, terlaris, newsletter
- 🛍️ **Daftar Produk** — Filter (kategori, harga, rating, promo), 6 opsi sorting, search via URL
- 📱 **Detail Produk** — Galeri thumbnail, spesifikasi, qty control, Tambah ke Keranjang / Beli Sekarang
- 🛒 **Keranjang** — Update qty, kupon promo, indikator gratis ongkir, ringkasan
- 💳 **Checkout** — Multi-step (Kontak, Alamat, Pengiriman, Pembayaran) — 6 jasa kirim & 8 metode bayar
- ✅ **Sukses** — Konfirmasi pesanan dengan detail lengkap

### Fungsi
- 🛒 **Keranjang & wishlist persisten** via localStorage (sync reactive pakai `useSyncExternalStore`)
- 🔍 **Pencarian + filter** sinkron ke URL params (shareable links)
- 🎟️ **Kupon promo** — `ERSET10` (10%), `NEWUSER` (15%), `FLASH50K` (Rp 50rb flat)
- 🚚 **Gratis ongkir** otomatis untuk belanja ≥ Rp 200.000
- 💳 **8 metode pembayaran** — BCA / BNI / Mandiri VA, GoPay, OVO, DANA, QRIS, COD
- 📦 **6 jasa pengiriman** — JNE Reguler / YES, SiCepat, J&T, Ninja, GoSend Instant
- 📱 **Responsive** mobile-first (filter sidebar jadi drawer di HP)
- 🔔 **Toast notifications** custom dengan auto-dismiss

## 🛠️ Tech Stack

| Tools | Kegunaan |
|-------|----------|
| ⚛️ **React 18** | UI library |
| 🔷 **TypeScript** | Type safety |
| ⚡ **Vite 5** | Bundler & dev server |
| 🎨 **Tailwind CSS 3** | Utility-first styling |
| ✨ **Lucide React** | Icon set modern |
| 🛣️ **React Router 6** | Client-side routing |

## 📂 Struktur Folder

```
src/
├── App.tsx                # Routes
├── main.tsx               # Entry point
├── index.css              # Tailwind base + components
├── types.ts               # Type definitions
├── data/
│   ├── products.ts        # 32 produk demo
│   └── categories.ts      # 8 kategori
├── lib/
│   ├── cart.ts            # Cart store + Wishlist (useSyncExternalStore)
│   ├── toast.ts           # Toast pub-sub
│   └── format.ts          # formatPrice, formatDate, calcDiscount
├── components/
│   ├── Layout.tsx         # Outlet + scroll-to-top
│   ├── Header.tsx         # Sticky header dengan search & cart badge
│   ├── Footer.tsx         # Social links & payment icons
│   ├── ProductCard.tsx    # Card dengan badge & wishlist
│   ├── PageHeader.tsx     # Breadcrumb header
│   ├── SectionHead.tsx    # Tag + title + subtitle + link
│   └── Toaster.tsx        # Toast container
└── pages/
    ├── Home.tsx
    ├── Products.tsx       # Filter sidebar + grid
    ├── ProductDetail.tsx  # Gallery + specs + related
    ├── Cart.tsx
    ├── Checkout.tsx       # 4-step form
    ├── Success.tsx
    └── NotFound.tsx
```

## 🚀 Cara Menjalankan

```bash
# Install dependencies
npm install

# Mode development (http://localhost:5173)
npm run dev

# Build production
npm run build

# Preview build
npm run preview
```

## 🌐 Deployment

Project ini auto-deploy ke **GitHub Pages** setiap push ke `main` via GitHub Actions (`.github/workflows/deploy.yml`).

URL live: **https://stevencau302-lgtm.github.io/ersetstore/**

> Catatan: Vite `base` di-set ke `/ersetstore/`. SPA routing pakai `404.html` fallback (di-copy dari `index.html` saat build).

## 🎟️ Demo Kode Promo

| Kode | Diskon |
|------|--------|
| `ERSET10` | 10% |
| `NEWUSER` | 15% |
| `FLASH50K` | Rp 50.000 flat |

## 🎯 Demo Flow

1. Buka **Beranda** → klik produk
2. Detail produk → atur qty → **Tambah ke Keranjang** atau **Beli Sekarang**
3. **Keranjang** → masukkan kupon `ERSET10` → diskon langsung diterapkan
4. **Checkout** → isi alamat → pilih kurir & metode bayar
5. **Bayar Sekarang** → halaman sukses dengan no. pesanan + detail

## 📦 Kategori Produk

📱 Gadget · 🎧 Audio · 🏠 Homeware · 🚗 Otomotif · 🏕️ Outdoor · 🔧 Tools · 🎨 Hobby · 🧸 Toys

---

**© 2026 Erset Store** — Pusat Belanja Produk Import Indonesia 🇮🇩
