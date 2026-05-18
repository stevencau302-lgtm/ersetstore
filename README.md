# 🛍️ ERSET STORE

> **Pusat Belanja Produk Import** — Toko online lengkap dengan demo produk, keranjang belanja, dan checkout.

Website e-commerce statis (HTML/CSS/JS) untuk **ERSET STORE**. Menjual aksesoris gadget, audio, homeware, otomotif, outdoor kit, tools, hobby, dan toys.

## 🚀 Fitur

### Halaman
- **Homepage** (`index.html`) — Hero, fitur, kategori, flash sale, produk terbaru, terlaris, newsletter
- **Daftar Produk** (`products.html`) — Filter (kategori, harga, rating, promo), sorting, pencarian
- **Detail Produk** (`product.html`) — Gambar, deskripsi, qty, add to cart / buy now, produk serupa
- **Keranjang** (`cart.html`) — Update qty, hapus item, kupon promo, ringkasan
- **Checkout** (`checkout.html`) — Form alamat, 6 metode pengiriman, 8 metode pembayaran
- **Konfirmasi** (`success.html`) — Halaman terima kasih dengan detail pesanan

### Fungsi
- 🛒 **Keranjang persisten** dengan localStorage
- ❤️ **Wishlist** untuk menandai produk favorit
- 🔍 **Pencarian** & filter produk advanced
- 🎟️ **Kupon promo** (`ERSET10`, `NEWUSER`, `FLASH50K`)
- 🚚 **Free ongkir** otomatis untuk belanja min. Rp 200.000
- 💳 **8 metode pembayaran** (BCA, Mandiri, BNI, GoPay, OVO, DANA, QRIS, COD)
- 📦 **6 jasa pengiriman** (JNE Reguler, YES, SiCepat, J&T, Ninja, GoSend Instant)
- 📱 **Responsive design** — mobile, tablet, desktop
- 🎨 **Modern UI** dengan animasi smooth & toast notifications

## 📂 Struktur Folder

```
ersetstore/
├── index.html          # Homepage
├── products.html       # Daftar produk
├── product.html        # Detail produk
├── cart.html           # Keranjang belanja
├── checkout.html       # Halaman checkout
├── success.html        # Konfirmasi pesanan
└── assets/
    ├── css/
    │   └── style.css   # Stylesheet utama
    └── js/
        ├── products.js # Database produk (32 item)
        ├── layout.js   # Header & footer shared
        └── app.js      # Logika cart, wishlist, toast
```

## 🛠️ Cara Menjalankan

Langsung buka `index.html` di browser, atau jalankan local server:

```bash
# Python
python3 -m http.server 8000

# Node
npx serve .
```

Buka `http://localhost:8000` di browser.

## 🎨 Tech Stack

- **HTML5** semantic markup
- **CSS3** — Custom properties, Grid, Flexbox, animations
- **Vanilla JavaScript** — No framework, no build step
- **localStorage** untuk persistensi cart & wishlist
- **Google Fonts** — Inter

## 🎟️ Kode Promo Demo

| Kode | Diskon |
|------|--------|
| `ERSET10` | 10% off |
| `NEWUSER` | 15% off |
| `FLASH50K` | Potongan flat Rp 50.000 |

## 📸 Highlight

- 32 produk demo dengan emoji visual
- 8 kategori produk
- Hero section dengan floating cards animasi
- Filter sidebar dengan 4 grup
- Cart summary realtime
- Multi-step checkout (4 step)
- Toast notification system

---

© 2026 ERSET STORE
