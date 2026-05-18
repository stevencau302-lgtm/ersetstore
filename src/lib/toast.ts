type ToastVariant = 'success' | 'error' | 'info';

interface ToastEvent {
  message: string;
  variant: ToastVariant;
  id: number;
}

const listeners = new Set<(t: ToastEvent) => void>();

export const toast = {
  show(message: string, variant: ToastVariant = 'info') {
    const event: ToastEvent = { message, variant, id: Date.now() + Math.random() };
    listeners.forEach((cb) => cb(event));
  },
  success(message: string) { this.show(message, 'success'); },
  error(message: string) { this.show(message, 'error'); },
  subscribe(cb: (t: ToastEvent) => void) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
};

export type { ToastEvent };
