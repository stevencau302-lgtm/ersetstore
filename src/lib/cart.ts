import { useSyncExternalStore } from 'react';
import type { CartItem } from '../types';
import { findProduct } from '../data/products';

const CART_KEY = 'erset_cart';
const WISHLIST_KEY = 'erset_wishlist';
const ORDER_KEY = 'erset_last_order';

// === Simple pub/sub for cart sync across components ===
const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
const notify = () => listeners.forEach((cb) => cb());

const readCart = (): CartItem[] => {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch {
    return [];
  }
};

const writeCart = (items: CartItem[]) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  notify();
};

export const cartActions = {
  add(productId: number, qty = 1) {
    const items = readCart();
    const existing = items.find((i) => i.id === productId);
    if (existing) existing.qty += qty;
    else items.push({ id: productId, qty });
    writeCart(items);
  },
  remove(productId: number) {
    writeCart(readCart().filter((i) => i.id !== productId));
  },
  update(productId: number, qty: number) {
    if (qty <= 0) return this.remove(productId);
    const items = readCart();
    const item = items.find((i) => i.id === productId);
    if (item) {
      item.qty = qty;
      writeCart(items);
    }
  },
  clear() {
    localStorage.removeItem(CART_KEY);
    notify();
  },
};

const getSnapshot = (): string => localStorage.getItem(CART_KEY) || '[]';

export const useCart = () => {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const items: CartItem[] = (() => {
    try { return JSON.parse(snapshot); }
    catch { return []; }
  })();

  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => {
    const p = findProduct(i.id);
    return p ? s + p.price * i.qty : s;
  }, 0);

  return { items, count, subtotal };
};

// === Wishlist ===
const wishlistListeners = new Set<() => void>();
const subscribeWish = (cb: () => void) => {
  wishlistListeners.add(cb);
  return () => wishlistListeners.delete(cb);
};
const getWishSnapshot = (): string => localStorage.getItem(WISHLIST_KEY) || '[]';

export const wishlistActions = {
  toggle(id: number): boolean {
    let list: number[] = [];
    try { list = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]'); } catch {}
    const idx = list.indexOf(id);
    let active: boolean;
    if (idx >= 0) {
      list.splice(idx, 1);
      active = false;
    } else {
      list.push(id);
      active = true;
    }
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
    wishlistListeners.forEach((cb) => cb());
    return active;
  },
  has(id: number): boolean {
    try {
      const list: number[] = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
      return list.includes(id);
    } catch { return false; }
  },
};

export const useWishlist = () => {
  const snapshot = useSyncExternalStore(subscribeWish, getWishSnapshot, getWishSnapshot);
  const ids: number[] = (() => {
    try { return JSON.parse(snapshot); }
    catch { return []; }
  })();
  return { ids };
};

// === Order persistence (success page) ===
export const orderActions = {
  save(order: unknown) {
    localStorage.setItem(ORDER_KEY, JSON.stringify(order));
  },
  get<T = unknown>(): T | null {
    try {
      const raw = localStorage.getItem(ORDER_KEY);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch { return null; }
  },
};
