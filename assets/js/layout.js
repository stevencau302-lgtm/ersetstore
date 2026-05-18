/* ============================================
   ERSET STORE - Shared Header/Footer Layout
   ============================================ */

function renderHeader(activePage = 'home') {
  return `
    <div class="topbar">
      <div class="container">
        <div class="topbar-left">📦 Free Ongkir Min. Belanja Rp 200.000 ke seluruh Indonesia!</div>
        <div class="topbar-right">
          <a href="#">Bantuan</a>
          <a href="#">Lacak Pesanan</a>
          <a href="#">Hubungi Kami</a>
        </div>
      </div>
    </div>
    <header class="header">
      <div class="container navbar">
        <a href="index.html" class="logo">
          <div class="logo-mark">E</div>
          <div>ERSET <small>STORE</small></div>
        </a>
        <div class="search-bar">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" placeholder="Cari produk import berkualitas..." />
        </div>
        <div class="nav-actions">
          <a href="#" class="icon-btn" aria-label="Wishlist">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </a>
          <a href="#" class="icon-btn" aria-label="Akun">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </a>
          <a href="cart.html" class="icon-btn" aria-label="Keranjang">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            <span class="cart-badge" style="display:none">0</span>
          </a>
          <button class="icon-btn menu-toggle" aria-label="Menu">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>
        </div>
      </div>
      <nav class="nav-menu">
        <div class="container">
          <a href="index.html" class="${activePage === 'home' ? 'active' : ''}">Home</a>
          <a href="products.html" class="${activePage === 'products' ? 'active' : ''}">Semua Produk</a>
          <a href="products.html?cat=gadget">Gadget</a>
          <a href="products.html?cat=audio">Audio</a>
          <a href="products.html?cat=homeware">Homeware</a>
          <a href="products.html?cat=otomotif">Otomotif</a>
          <a href="products.html?cat=outdoor">Outdoor Kit</a>
          <a href="products.html?cat=tools">Tools</a>
          <a href="products.html?cat=hobby">Hobby</a>
          <a href="products.html?cat=toys">Toys</a>
          <a href="#" style="color:var(--primary);font-weight:700">🔥 Flash Sale</a>
        </div>
      </nav>
    </header>`;
}

function renderFooter() {
  return `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <a href="index.html" class="logo" style="color:#fff;margin-bottom:16px">
              <div class="logo-mark">E</div>
              <div>ERSET <small style="color:rgba(255,255,255,.6)">STORE</small></div>
            </a>
            <p>Pusat belanja produk import berkualitas dengan harga hemat. Update produk unik setiap hari, dikirim cepat ke seluruh Indonesia.</p>
            <div class="social-links">
              <a href="#" aria-label="Instagram">📷</a>
              <a href="#" aria-label="Facebook">📘</a>
              <a href="#" aria-label="TikTok">🎵</a>
              <a href="#" aria-label="YouTube">▶️</a>
              <a href="#" aria-label="WhatsApp">💬</a>
            </div>
          </div>
          <div>
            <h5>Belanja</h5>
            <ul class="footer-links">
              <li><a href="products.html">Semua Produk</a></li>
              <li><a href="products.html?cat=gadget">Gadget</a></li>
              <li><a href="products.html?cat=audio">Audio</a></li>
              <li><a href="products.html?cat=homeware">Homeware</a></li>
              <li><a href="products.html?cat=otomotif">Otomotif</a></li>
              <li><a href="#">Flash Sale</a></li>
            </ul>
          </div>
          <div>
            <h5>Bantuan</h5>
            <ul class="footer-links">
              <li><a href="#">Cara Belanja</a></li>
              <li><a href="#">Cara Pembayaran</a></li>
              <li><a href="#">Pengiriman</a></li>
              <li><a href="#">Pengembalian</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Hubungi Kami</a></li>
            </ul>
          </div>
          <div>
            <h5>Tentang Kami</h5>
            <ul class="footer-links">
              <li><a href="#">Tentang Erset Store</a></li>
              <li><a href="#">Karir</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Syarat & Ketentuan</a></li>
              <li><a href="#">Kebijakan Privasi</a></li>
            </ul>
            <h5 style="margin-top:24px">Pembayaran</h5>
            <div class="payment-icons">
              <span>BCA</span>
              <span>BNI</span>
              <span>Mandiri</span>
              <span>OVO</span>
              <span>Dana</span>
              <span>GoPay</span>
              <span>QRIS</span>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="container">
          © 2026 ERSET STORE. All Rights Reserved. Pusat Belanja Produk Import Indonesia.
        </div>
      </div>
    </footer>`;
}

// Auto-inject if placeholders exist
document.addEventListener('DOMContentLoaded', () => {
  const headerSlot = document.getElementById('site-header');
  const footerSlot = document.getElementById('site-footer');
  if (headerSlot) headerSlot.innerHTML = renderHeader(headerSlot.dataset.page || 'home');
  if (footerSlot) footerSlot.innerHTML = renderFooter();
});
