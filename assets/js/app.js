/* ============================================
   ERSET STORE - Main App Logic
   ============================================ */

// ===== Utility =====
const formatPrice = (n) => 'Rp ' + n.toLocaleString('id-ID');
const $ = (sel, parent = document) => parent.querySelector(sel);
const $$ = (sel, parent = document) => [...parent.querySelectorAll(sel)];

// ===== Cart Management =====
const Cart = {
  key: 'erset_cart',
  get() {
    try { return JSON.parse(localStorage.getItem(this.key)) || []; }
    catch { return []; }
  },
  save(items) { localStorage.setItem(this.key, JSON.stringify(items)); this.updateBadge(); },
  add(productId, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === productId);
    if (existing) { existing.qty += qty; }
    else { items.push({ id: productId, qty }); }
    this.save(items);
    showToast('Produk ditambahkan ke keranjang', 'success');
  },
  remove(productId) {
    const items = this.get().filter(i => i.id !== productId);
    this.save(items);
  },
  update(productId, qty) {
    const items = this.get();
    const item = items.find(i => i.id === productId);
    if (item) {
      if (qty <= 0) { return this.remove(productId); }
      item.qty = qty;
      this.save(items);
    }
  },
  clear() { localStorage.removeItem(this.key); this.updateBadge(); },
  count() { return this.get().reduce((sum, i) => sum + i.qty, 0); },
  total() {
    return this.get().reduce((sum, item) => {
      const p = PRODUCTS.find(p => p.id === item.id);
      return p ? sum + (p.price * item.qty) : sum;
    }, 0);
  },
  updateBadge() {
    const badges = $$('.cart-badge');
    const count = this.count();
    badges.forEach(b => {
      b.textContent = count;
      b.style.display = count > 0 ? 'grid' : 'none';
    });
  }
};

// ===== Wishlist =====
const Wishlist = {
  key: 'erset_wishlist',
  get() { try { return JSON.parse(localStorage.getItem(this.key)) || []; } catch { return []; } },
  toggle(id) {
    let items = this.get();
    if (items.includes(id)) { items = items.filter(x => x !== id); }
    else { items.push(id); }
    localStorage.setItem(this.key, JSON.stringify(items));
    return items.includes(id);
  },
  has(id) { return this.get().includes(id); }
};

// ===== Toast =====
function showToast(message, type = '') {
  const existing = $('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '✓' : type === 'error' ? '✕' : '⚡'}</span> ${message}`;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ===== Render Product Card =====
function renderProductCard(p) {
  const discount = p.original ? Math.round((1 - p.price / p.original) * 100) : 0;
  const inWishlist = Wishlist.has(p.id);
  const badgeMap = { sale: 'sale', new: 'new', hot: 'hot' };
  return `
    <div class="product-card" data-id="${p.id}">
      <a href="product.html?id=${p.id}" class="product-image">
        ${p.badge ? `<span class="product-badge ${badgeMap[p.badge] || ''}">${p.badge === 'sale' ? '-' + discount + '%' : p.badge}</span>` : ''}
        <span>${p.emoji}</span>
      </a>
      <button class="product-wishlist ${inWishlist ? 'active' : ''}" data-wishlist="${p.id}" aria-label="Wishlist">
        <svg width="18" height="18" fill="${inWishlist ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
      </button>
      <div class="product-info">
        <div class="product-category">${p.category}</div>
        <a href="product.html?id=${p.id}" class="product-name">${p.name}</a>
        <div class="product-rating">
          <span class="stars">★</span>
          <span>${p.rating}</span>
          <span>•</span>
          <span>${p.sold} terjual</span>
        </div>
        <div class="product-price-row">
          <div class="product-price">
            <span class="current">${formatPrice(p.price)}</span>
            ${p.original ? `<span class="original">${formatPrice(p.original)}</span>` : ''}
          </div>
          <button class="btn-add-cart" data-add="${p.id}" aria-label="Tambah ke keranjang">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
          </button>
        </div>
      </div>
    </div>`;
}

// ===== Init Listeners =====
function initProductListeners() {
  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('[data-add]');
    if (addBtn) {
      e.preventDefault();
      Cart.add(parseInt(addBtn.dataset.add));
      return;
    }
    const wishBtn = e.target.closest('[data-wishlist]');
    if (wishBtn) {
      e.preventDefault();
      const active = Wishlist.toggle(parseInt(wishBtn.dataset.wishlist));
      wishBtn.classList.toggle('active', active);
      const svg = wishBtn.querySelector('svg');
      if (svg) svg.setAttribute('fill', active ? 'currentColor' : 'none');
      showToast(active ? 'Added to wishlist' : 'Removed from wishlist');
      return;
    }
  });
}

// ===== Mobile Menu Toggle =====
function initMobileMenu() {
  const toggle = $('.menu-toggle');
  const menu = $('.nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => menu.classList.toggle('open'));
  }
}

// ===== Search =====
function initSearch() {
  const inputs = $$('.search-bar input');
  inputs.forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const q = input.value.trim();
        if (q) window.location.href = 'products.html?search=' + encodeURIComponent(q);
      }
    });
  });
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  Cart.updateBadge();
  initProductListeners();
  initMobileMenu();
  initSearch();
});
