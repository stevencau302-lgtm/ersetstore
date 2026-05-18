# ⚡ ERSET GEAR LAB

> **Premium Gear & Gadget Marketplace** — Modern dark-themed e-commerce inspired by Erset Gear Lab.

A fully-functional static e-commerce website built with vanilla HTML, CSS, and JavaScript. Features premium dark mode design with neon accents, smooth animations, and a complete shopping flow.

## 🎨 Design Highlights

- **Premium dark theme** with neon green accent (`#00ff9d`)
- **Animated grid background** in hero section
- **Floating glow orbs** & blurred gradients
- **Smooth micro-interactions** on hover (scale, glow, shimmer)
- **Glassmorphism** sticky header with backdrop blur
- **Brand strip** featuring partner logos
- **Card-based feature** layout with hover lift
- **Toast notifications** with neon glow

## 🚀 Pages

| Page | File | Description |
|------|------|-------------|
| 🏠 Home | `index.html` | Hero, brand strip, features, categories, flash deals, new arrivals, best sellers, newsletter |
| 🛍️ Shop | `products.html` | Product list with sidebar filters (category, price, rating) & sorting |
| 📱 Detail | `product.html` | Gallery, specs, qty selector, add-to-cart, related products |
| 🛒 Cart | `cart.html` | Qty controls, coupons, free shipping logic |
| 💳 Checkout | `checkout.html` | 4-step form: contact, address, shipping, payment |
| ✅ Success | `success.html` | Order confirmation with details |

## ✨ Features

- 🛒 **Persistent cart & wishlist** via localStorage
- 🔍 **Live search** with URL params
- 🎟️ **Promo codes**: `ERSET10` (10%), `NEWUSER` (15%), `FLASH50K` (Rp 50K flat)
- 🚚 **Free shipping** auto-trigger over Rp 200K
- 💳 **8 payment methods**: BCA / Mandiri / BNI VA, GoPay, OVO, DANA, QRIS, COD
- 📦 **6 shipping options**: JNE Reguler / YES, SiCepat, J&T, Ninja, GoSend Instant
- 📱 **Fully responsive** mobile-first design
- 🎨 **32 demo products** across 8 categories

## 🗂️ Categories

| Icon | Category | Items |
|------|----------|-------|
| 📱 | Gadget | Phone & laptop accessories |
| 🎧 | Audio | Headphones, speakers, mics |
| 🏠 | Homeware | Smart home, lighting, cleaning |
| 🚗 | Otomotif | Car gear & accessories |
| 🏕️ | Outdoor | Camping, tactical, sport |
| 🔧 | Tools | DIY, mechanical, measuring |
| 🎨 | Hobby | Drone, camera, keyboard |
| 🧸 | Toys | Cards, building blocks, fidget |

## 🚀 Run Locally

Open `index.html` directly in a browser, or serve via:

```bash
# Python
python3 -m http.server 8000

# Node
npx serve .
```

Visit `http://localhost:8000`.

## 🛠️ Tech Stack

- **HTML5** semantic markup
- **CSS3** — Custom properties, Grid, Flexbox, animations, backdrop-filter
- **Vanilla JS** — No framework, no build step
- **localStorage** for cart/wishlist persistence
- **Google Fonts** — Inter (400-900)

## 🎟️ Demo Promo Codes

| Code | Discount |
|------|----------|
| `ERSET10` | 10% off |
| `NEWUSER` | 15% off |
| `FLASH50K` | Rp 50.000 flat off |

## 🎯 Demo Flow

1. Browse the homepage → click any product
2. View detail page → adjust quantity → **Add to Cart** or **Buy Now**
3. Go to cart → apply promo `ERSET10` → see discount applied
4. Continue to checkout → fill address → pick shipping & payment
5. Click **Pay Now** → see order confirmation page

---

**© 2026 ERSET GEAR LAB** — Made with ⚡ for gear enthusiasts.
