import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ArrowRight, Tag, ShieldCheck, Sparkles,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { cartActions, useCart } from '../lib/cart';
import { findProduct } from '../data/products';
import { formatPrice } from '../lib/format';
import { toast } from '../lib/toast';

interface Coupon {
  type?: 'flat';
  discount: number;
  label: string;
}

const COUPONS: Record<string, Coupon> = {
  ERSET10: { discount: 0.1, label: 'Diskon 10%' },
  NEWUSER: { discount: 0.15, label: 'Diskon 15% Pengguna Baru' },
  FLASH50K: { discount: 50000, type: 'flat', label: 'Potongan Rp 50.000' },
};

export default function Cart() {
  const { items, count, subtotal } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const breadcrumb = [{ label: 'Beranda', to: '/' }, { label: 'Keranjang' }];

  if (items.length === 0) {
    return (
      <>
        <PageHeader title="Keranjang Belanja" breadcrumb={breadcrumb} />
        <div className="container-x pb-20">
          <div className="card text-center py-20 px-6">
            <div className="size-24 mx-auto mb-5 grid place-items-center bg-brand-50 rounded-3xl">
              <ShoppingCart className="size-12 text-brand-500" />
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Keranjang Kamu Kosong</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              Belum ada produk di keranjang. Yuk mulai belanja produk import berkualitas sekarang!
            </p>
            <Link to="/produk" className="btn btn-primary btn-lg">
              <ShoppingCart className="size-4" />
              Mulai Belanja
            </Link>
          </div>
        </div>
      </>
    );
  }

  const shipping = subtotal >= 200000 ? 0 : 15000;
  let discount = 0;
  if (appliedCoupon) {
    const c = COUPONS[appliedCoupon];
    discount = c.type === 'flat' ? c.discount : Math.round(subtotal * c.discount);
  }
  const total = subtotal + shipping - discount;

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      toast.error('Masukkan kode promo terlebih dahulu');
      return;
    }
    if (COUPONS[code]) {
      setAppliedCoupon(code);
      toast.success(`Kupon diterapkan: ${COUPONS[code].label}`);
    } else {
      toast.error('Kode promo tidak valid');
    }
  };

  const removeItem = (id: number) => {
    cartActions.remove(id);
    toast.show('Produk dihapus dari keranjang');
  };

  const clearAll = () => {
    if (confirm('Yakin ingin mengosongkan keranjang?')) {
      cartActions.clear();
      setAppliedCoupon(null);
      toast.show('Keranjang dikosongkan');
    }
  };

  return (
    <>
      <PageHeader title="Keranjang Belanja" breadcrumb={breadcrumb} />

      <section className="container-x pb-16">
        <div className="grid lg:grid-cols-[1fr_380px] gap-6 items-start">
          <div>
            <div className="card overflow-hidden">
              {items.map((item) => {
                const p = findProduct(item.id);
                if (!p) return null;
                return (
                  <div
                    key={p.id}
                    className="grid grid-cols-[80px_1fr_auto] sm:grid-cols-[88px_1fr_auto_auto_auto] items-center gap-3 sm:gap-5 p-4 sm:p-5 border-b border-gray-100 last:border-0"
                  >
                    <Link
                      to={`/produk/${p.id}`}
                      className="size-20 sm:size-22 grid place-items-center bg-gray-50 rounded-xl text-4xl"
                    >
                      {p.emoji}
                    </Link>

                    <div className="min-w-0">
                      <Link to={`/produk/${p.id}`} className="font-semibold text-gray-900 line-clamp-2 hover:text-brand-500">
                        {p.name}
                      </Link>
                      <div className="text-[11px] text-gray-500 uppercase tracking-wider mt-1">
                        {p.category} • SKU: ERS-{p.id.toString().padStart(4, '0')}
                      </div>
                      <div className="sm:hidden mt-2 font-bold text-brand-500">
                        {formatPrice(p.price * item.qty)}
                      </div>
                    </div>

                    <div className="flex items-center bg-white border border-gray-200 rounded-full overflow-hidden col-span-2 sm:col-span-1 justify-self-start sm:justify-self-auto">
                      <button
                        onClick={() => cartActions.update(p.id, item.qty - 1)}
                        className="size-9 grid place-items-center hover:bg-gray-100"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-10 text-center text-sm font-bold">{item.qty}</span>
                      <button
                        onClick={() => cartActions.update(p.id, item.qty + 1)}
                        className="size-9 grid place-items-center hover:bg-gray-100"
                        disabled={item.qty >= p.stock}
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>

                    <div className="hidden sm:block font-bold text-brand-500 text-right whitespace-nowrap">
                      {formatPrice(p.price * item.qty)}
                    </div>

                    <button
                      onClick={() => removeItem(p.id)}
                      aria-label="Hapus"
                      className="size-9 grid place-items-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg justify-self-end"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <Link to="/produk" className="btn btn-outline btn-md">
                <ArrowLeft className="size-4" />
                Lanjut Belanja
              </Link>
              <button
                onClick={clearAll}
                className="btn btn-md bg-white text-red-500 border-2 border-red-100 hover:border-red-500 hover:bg-red-50"
              >
                <Trash2 className="size-4" />
                Kosongkan Keranjang
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="card p-6 lg:sticky lg:top-32">
            <h3 className="text-xs font-bold uppercase tracking-[2px] text-gray-900 mb-5">
              Ringkasan Pesanan
            </h3>

            <div className="flex flex-col gap-2.5 text-sm">
              <Row label={`Subtotal (${count} item)`} value={formatPrice(subtotal)} />
              <Row
                label="Ongkos Kirim"
                value={shipping === 0 ? <span className="text-emerald-600 font-semibold">GRATIS</span> : formatPrice(shipping)}
              />
              {discount > 0 && (
                <Row
                  label={`Diskon (${appliedCoupon})`}
                  value={<span className="text-emerald-600 font-semibold">-{formatPrice(discount)}</span>}
                />
              )}
            </div>

            {/* Coupon */}
            <div className="flex gap-2 my-4">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Kode promo"
                  className="input py-2.5 pl-9 text-sm"
                />
              </div>
              <button onClick={applyCoupon} className="btn btn-secondary btn-sm">
                Pakai
              </button>
            </div>

            {shipping > 0 && (
              <div className="flex items-start gap-2 bg-amber-50 text-amber-700 rounded-xl p-3 text-xs mb-4">
                <Sparkles className="size-4 shrink-0 mt-0.5" />
                <span>
                  Belanja <strong>{formatPrice(200000 - subtotal)}</strong> lagi untuk gratis ongkir!
                </span>
              </div>
            )}

            <div className="flex justify-between items-baseline border-t border-dashed border-gray-200 pt-4 mt-2">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-2xl font-extrabold text-brand-500">{formatPrice(total)}</span>
            </div>

            <Link to="/checkout" className="btn btn-primary btn-lg w-full mt-5">
              Lanjut ke Checkout
              <ArrowRight className="size-4" />
            </Link>

            <div className="text-center text-[11px] text-gray-500 uppercase tracking-wider mt-4 flex items-center justify-center gap-1.5">
              <ShieldCheck className="size-3.5" />
              Pembayaran 100% Aman & Terenkripsi
            </div>

            <div className="mt-5 pt-5 border-t border-gray-100">
              <p className="text-[11px] text-gray-500 mb-2 font-medium uppercase tracking-wider">Kode Promo Tersedia</p>
              <div className="flex flex-wrap gap-1.5">
                {Object.keys(COUPONS).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCouponInput(c)}
                    className="text-[11px] font-bold bg-brand-50 text-brand-600 px-2.5 py-1 rounded-md hover:bg-brand-100"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between text-sm py-1">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  );
}
