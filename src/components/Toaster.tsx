import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { toast, type ToastEvent } from '../lib/toast';

interface ToastItem extends ToastEvent {
  exiting?: boolean;
}

export default function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    const unsub = toast.subscribe((t) => {
      setItems((prev) => [...prev, t]);
      // auto-dismiss
      setTimeout(() => {
        setItems((prev) =>
          prev.map((x) => (x.id === t.id ? { ...x, exiting: true } : x))
        );
      }, 2500);
      setTimeout(() => {
        setItems((prev) => prev.filter((x) => x.id !== t.id));
      }, 2800);
    });
    return () => { unsub(); };
  }, []);

  const Icon = (variant: ToastItem['variant']) => {
    if (variant === 'success') return <CheckCircle2 className="size-5 text-emerald-500" />;
    if (variant === 'error') return <XCircle className="size-5 text-red-500" />;
    return <Info className="size-5 text-brand-500" />;
  };

  return (
    <div className="fixed top-24 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {items.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-3 bg-white border border-gray-200 shadow-xl rounded-xl px-4 py-3 min-w-[260px] max-w-sm transition-all duration-300 ${
            t.exiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
          }`}
        >
          {Icon(t.variant)}
          <span className="text-sm font-medium text-gray-900 flex-1">{t.message}</span>
          <button
            onClick={() => setItems((prev) => prev.filter((x) => x.id !== t.id))}
            className="text-gray-400 hover:text-gray-700"
          >
            <X className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
