import { useSyncExternalStore } from 'react';

// State global untuk membuka/menutup Cart Drawer
let isOpen = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const cartDrawer = {
  open() { isOpen = true; emit(); },
  close() { isOpen = false; emit(); },
  toggle() { isOpen = !isOpen; emit(); },
};

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
const getSnapshot = () => isOpen;

export const useCartDrawer = () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
