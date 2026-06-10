import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X, ShoppingCart, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Sparkles,
} from 'lucide-react';
import { cartActions, useCart } from '../lib/cart';
import { cartDrawer, useCartDrawer } from '../lib/cartDrawer';
import { findProduct } from '../data/products';
import { formatPrice } from '../lib/format';
import { toast } from '../lib/toast';

export default function CartDrawer() {
  const open = useCartDrawer();
  const { items, count, subtotal } = useCart();
  const navigate = useNavigate();

  // Kunci scroll body + tutup dengan Escape saat drawer terbuka
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') cartDrawer.close(); };
      window.addEventListener('keydown', onKey);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', onKey);
      };
    }
    document.body.style.overflow = '';
  }, [open]);

  const shipping = subtotal >= 200000 ? 0 : 15000;
  const total = subtotal + shipping;

  const goCheckout = () => {
    cartDrawer.close();
    navigate('/checkout');
  };

  const removeItem = (id: number) => {
    cartActions.remove(id);
    toast.show('Produk dihapus dari keranjang');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[70] bg-black/50 backdrop-blur-[1px] transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => cartDrawer.close()}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        className={`fixed top-0 right-0 z-[80] h-full w-full sm:w-[420px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Keranjang Belanja"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <ShoppingCart className="size-5 text-brand-500" />
            Keranjang
            <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">{count}</span>
          </h3>
          <button
            onClick={() => cartDrawer.close()}
            className="size-9 grid place-items-center rounded-full hover:bg-gray-100 text-gray-600"
            aria-label="Tutup"
          >
            <X className="size-5" />
          </button>
        </div>

        {items.length === 0 ? (
          /* Empty */
          <div className="flex-1 grid place-items-center px-6 text-center">
            <div>
              <div className="size-20 mx-auto mb-4 grid place-items-center bg-brand-50 rounded-3xl">
                <ShoppingCart className="size-10 text-brand-500" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-1">Keranjang Kamu Kosong</h4>
              <p className="text-sm text-gray-500 mb-5">Yuk mulai belanja produk import berkualitas!</p>
              <Link to="/produk" onClick={() => cartDrawer.close()} className="btn btn-primary btn-md">
                <ShoppingCart className="size-4" /> Mulai Belanja
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* List */}
            <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-3 space-y-3">
              {items.map((item) => {
                const p = findProduct(item.id);
                if (!p) return null;
                return (
                  <div key={p.id} className="flex gap-3 p-3 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors">
                    <Link
                      to={`/produk/${p.id}`}
                      onClick={() => cartDrawer.close()}
                      className="size-16 shrink-0 grid place-items-center bg-gray-50 rounded-xl text-3xl"
                    >
                      {p.emoji}
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/produk/${p.id}`}
                        onClick={() => cartDrawer.close()}
                        className="text-sm font-semibold text-gray-900 line-clamp-2 hover:text-brand-500"
                      >
                        {p.name}
                      </Link>
                      <div className="font-bold text-brand-500 text-sm mt-1">{formatPrice(p.price * item.qty)}</div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center bg-white border border-gray-200 rounded-full overflow-hidden">
                          <button
                            onClick={() => cartActions.update(p.id, item.qty - 1)}
                            className="size-8 grid place-items-center hover:bg-gray-100"
                            aria-label="Kurangi"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold">{item.qty}</span>
                          <button
                            onClick={() => cartActions.update(p.id, item.qty + 1)}
                            className="size-8 grid place-items-center hover:bg-gray-100 disabled:opacity-40"
                            disabled={item.qty >= p.stock}
                            aria-label="Tambah"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(p.id)}
                          aria-label="Hapus"
                          className="size-8 grid place-items-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer / summary */}
            <div className="shrink-0 border-t border-gray-100 px-5 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] space-y-2.5">
              {shipping > 0 && (
                <div className="flex items-start gap-2 bg-amber-50 text-amber-700 rounded-xl p-2.5 text-xs">
                  <Sparkles className="size-4 shrink-0 mt-0.5" />
                  <span>Belanja <strong>{formatPrice(200000 - subtotal)}</strong> lagi untuk gratis ongkir!</span>
                </div>
              )}

              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal ({count} item)</span>
                <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Ongkos Kirim</span>
                <span className="font-semibold">{shipping === 0 ? <span className="text-emerald-600">GRATIS</span> : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between items-baseline border-t border-dashed border-gray-200 pt-2.5">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-xl font-extrabold text-brand-500">{formatPrice(total)}</span>
              </div>

              <button onClick={goCheckout} className="btn btn-primary btn-lg w-full mt-1">
                Checkout Sekarang
                <ArrowRight className="size-4" />
              </button>

              <Link
                to="/keranjang"
                onClick={() => cartDrawer.close()}
                className="block text-center text-xs font-semibold text-gray-500 hover:text-brand-500 pt-1"
              >
                Lihat keranjang lengkap
              </Link>

              <div className="text-center text-[11px] text-gray-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
                <ShieldCheck className="size-3.5" />
                Pembayaran Aman & Terenkripsi
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
