/* ============================================
   ERSET GEAR LAB - Header & Footer
   ============================================ */

function renderHeader(activePage = 'home') {
  return `
    <div class="topbar">
      <div class="container">
        <div class="topbar-left">
          <span class="badge">NEW</span>
          Free shipping on orders over Rp 200K • Same-day dispatch before 3PM
        </div>
        <div class="topbar-right">
          <a href="#">Track Order</a>
          <a href="#">Help</a>
          <a href="admin.html">Admin</a>
          <a href="#">Sign In</a>
        </div>
      </div>
    </div>
    <header class="header">
      <div class="container navbar">
        <a href="index.html" class="logo">
          <div class="logo-mark">E</div>
          <div>ERSET <small>GEAR LAB</small></div>
        </a>
        <div class="search-bar">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" placeholder="Search gear, gadgets, tools..." />
        </div>
        <div class="nav-actions">
          <a href="#" class="icon-btn" aria-label="Wishlist">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </a>
          <a href="#" class="icon-btn" aria-label="Account">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </a>
          <a href="cart.html" class="icon-btn" aria-label="Cart">
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
          <a href="products.html" class="${activePage === 'products' ? 'active' : ''}">Shop All</a>
          <a href="products.html?cat=gadget">Gadget</a>
          <a href="products.html?cat=audio">Audio</a>
          <a href="products.html?cat=homeware">Homeware</a>
          <a href="products.html?cat=otomotif">Otomotif</a>
          <a href="products.html?cat=outdoor">Outdoor</a>
          <a href="products.html?cat=tools">Tools</a>
          <a href="products.html?cat=hobby">Hobby</a>
          <a href="products.html?cat=toys">Toys</a>
          <a href="#" class="fire">⚡ Flash Deals</a>
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
            <a href="index.html" class="logo" style="margin-bottom:20px">
              <div class="logo-mark">E</div>
              <div>ERSET <small>GEAR LAB</small></div>
            </a>
            <p>Premium gear & gadget marketplace. Curated import products with verified quality, fast shipping, and trusted payment.</p>
            <div class="social-links">
              <a href="#" aria-label="Instagram">📷</a>
              <a href="#" aria-label="TikTok">🎵</a>
              <a href="#" aria-label="YouTube">▶️</a>
              <a href="#" aria-label="Facebook">📘</a>
              <a href="#" aria-label="WhatsApp">💬</a>
            </div>
          </div>
          <div>
            <h5>Shop</h5>
            <ul class="footer-links">
              <li><a href="products.html">All Products</a></li>
              <li><a href="products.html?cat=gadget">Gadget</a></li>
              <li><a href="products.html?cat=audio">Audio Gear</a></li>
              <li><a href="products.html?cat=homeware">Homeware</a></li>
              <li><a href="products.html?cat=outdoor">Outdoor</a></li>
              <li><a href="#">Flash Deals</a></li>
            </ul>
          </div>
          <div>
            <h5>Support</h5>
            <ul class="footer-links">
              <li><a href="#">How to Order</a></li>
              <li><a href="#">Payment Guide</a></li>
              <li><a href="#">Shipping Info</a></li>
              <li><a href="#">Returns & Refund</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h5>Company</h5>
            <ul class="footer-links">
              <li><a href="#">About Erset</a></li>
              <li><a href="#">Career</a></li>
              <li><a href="#">Blog & Reviews</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
            <h5 style="margin-top:24px">Payment</h5>
            <div class="payment-icons">
              <span>BCA</span>
              <span>BNI</span>
              <span>MANDIRI</span>
              <span>OVO</span>
              <span>DANA</span>
              <span>GOPAY</span>
              <span>QRIS</span>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="container">
          © 2026 ERSET GEAR LAB. All rights reserved. Made with ⚡ for gear enthusiasts.
        </div>
      </div>
    </footer>`;
}

document.addEventListener('DOMContentLoaded', () => {
  const headerSlot = document.getElementById('site-header');
  const footerSlot = document.getElementById('site-footer');
  if (headerSlot) headerSlot.innerHTML = renderHeader(headerSlot.dataset.page || 'home');
  if (footerSlot) footerSlot.innerHTML = renderFooter();
});
