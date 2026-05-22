import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Lock, ShoppingCart, ShieldCheck, User, MapPin, Truck, CreditCard,
  Landmark, Zap, Banknote, Loader2, AlertCircle, RefreshCw,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import LocationSearch from '../components/LocationSearch';
import { cartActions, orderActions, useCart } from '../lib/cart';
import { findProduct } from '../data/products';
import { formatPrice } from '../lib/format';
import { useShippingRates, type Location, type ShippingRate } from '../lib/shipping';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { fetchSavedAddress, saveAddressToSupabase, type SavedAddress } from './Akun';
import type { OrderData, PaymentMethod } from '../types';

// Origin toko — set ID lokasi toko kamu di sini
// Contoh: Pademangan, Jakarta Utara
const STORE_ORIGIN_ID = 'dist_31.72.05';

interface PaymentGroup {
  id: string;
  label: string;
  iconName: string;
  desc: string;
}

const PAYMENT_GROUPS: PaymentGroup[] = [
  { id: 'bank', label: 'Transfer Bank', iconName: 'landmark', desc: 'BCA, BNI, Mandiri, BRI' },
  { id: 'ewallet', label: 'E-Wallet', iconName: 'zap', desc: 'GoPay, OVO, DANA, ShopeePay' },
  { id: 'cod', label: 'COD', iconName: 'banknote', desc: 'Bayar di tempat' },
];

const PAYMENTS: PaymentMethod[] = [
  { id: 'bank', icon: 'landmark', name: 'Transfer Bank', desc: 'BCA, BNI, Mandiri, BRI' },
  { id: 'ewallet', icon: 'zap', name: 'E-Wallet', desc: 'GoPay, OVO, DANA, ShopeePay' },
  { id: 'cod', icon: 'banknote', name: 'COD', desc: 'Bayar di tempat' },
];

export default function Checkout() {
  const { items, count, subtotal } = useCart();
  const { user } = useAuth();
  const [paymentId, setPaymentId] = useState('bank');
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [savedAddr, setSavedAddr] = useState<SavedAddress | null>(null);
  const navigate = useNavigate();

  // Location & Shipping
  const [destination, setDestination] = useState<Location | null>(null);
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);
  const { rates, loading: ratesLoading, error: ratesError, fetchRates, clearRates } = useShippingRates();

  // Berat total (gram): asumsikan 500g per item, minimum 1000g
  const totalWeightGram = Math.max(1000, items.reduce((sum, item) => sum + item.qty * 500, 0));

  // Fetch saved address
  useEffect(() => {
    if (user) {
      fetchSavedAddress(user.id).then(async (addr) => {
        if (addr) {
          setSavedAddr(addr);
        } else {
          const { data } = await supabase
            .from('orders')
            .select('shipping_name, shipping_phone, shipping_address')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
          if (data && data.shipping_name) {
            setSavedAddr({ name: data.shipping_name, phone: data.shipping_phone || '', address: data.shipping_address || '' });
          }
        }
      });
    }
  }, [user]);

  // Fetch ongkir when destination changes
  useEffect(() => {
    if (destination) {
      setSelectedRate(null);
      fetchRates(STORE_ORIGIN_ID, destination.id, totalWeightGram);
    } else {
      clearRates();
      setSelectedRate(null);
    }
  }, [destination, totalWeightGram]);

  // Auto-select cheapest rate
  useEffect(() => {
    if (rates.length > 0 && !selectedRate) {
      setSelectedRate(rates[0]); // already sorted by price asc from backend
    }
  }, [rates]);

  const breadcrumb = [
    { label: 'Beranda', to: '/' },
    { label: 'Keranjang', to: '/keranjang' },
    { label: 'Checkout' },
  ];

  if (items.length === 0) {
    return (
      <>
        <PageHeader title="Checkout" breadcrumb={breadcrumb} />
        <div className="container-x pb-20">
          <div className="card text-center py-20 px-6">
            <ShoppingCart className="size-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Keranjang Kamu Kosong</h3>
            <p className="text-gray-500 mb-6">Tambahkan produk dulu sebelum checkout</p>
            <Link to="/produk" className="btn btn-primary btn-md">Mulai Belanja</Link>
          </div>
        </div>
      </>
    );
  }

  const shippingCost = selectedRate?.price || 0;
  const payment = PAYMENTS.find((p) => p.id === paymentId)!;
  const total = subtotal + shippingCost;

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRate) {
      setOrderError('Pilih metode pengiriman dulu');
      return;
    }
    if (!destination) {
      setOrderError('Pilih lokasi tujuan dulu');
      return;
    }

    setSubmitting(true);
    setOrderError('');

    const orderId = 'ERS-' + Date.now().toString().slice(-8);

    const orderItems = items.map((item) => {
      const p = findProduct(item.id);
      return { product_id: item.id, product_name: p?.name || 'Unknown', qty: item.qty, price: p?.price || 0 };
    });

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const shippingName = (formData.get('fullname') as string) || '';
    const shippingPhone = (formData.get('phone') as string) || '';
    const shippingAddress = (formData.get('address') as string) || '';

    await saveAddressToSupabase(user!.id, { name: shippingName, phone: shippingPhone, address: shippingAddress });

    const shippingMethodName = `${selectedRate.courier_name} ${selectedRate.service} (${selectedRate.estimated || '-'})`;

    const { error: insertError } = await supabase.from('orders').insert({
      user_id: user!.id,
      order_number: orderId,
      items: orderItems,
      subtotal,
      shipping_cost: shippingCost,
      total,
      shipping_method: shippingMethodName,
      payment_method: payment.name,
      status: 'pending',
      shipping_name: shippingName,
      shipping_address: shippingAddress,
      shipping_phone: shippingPhone,
    });

    if (insertError) {
      setOrderError('Gagal membuat pesanan: ' + insertError.message);
      setSubmitting(false);
      return;
    }

    const order: OrderData = {
      id: orderId,
      total,
      shipping: { id: selectedRate.courier_code, name: shippingMethodName, eta: selectedRate.estimated || '-', price: shippingCost },
      payment,
      itemCount: count,
      date: new Date().toISOString(),
    };
    orderActions.save(order);
    cartActions.clear();
    navigate(`/sukses?order=${orderId}`);
  };

  return (
    <>
      <PageHeader title="Checkout Pesanan" breadcrumb={breadcrumb} />

      <section className="container-x pb-16">
        <form onSubmit={placeOrder} className="grid lg:grid-cols-[1fr_380px] gap-6 items-start">
          <div className="flex flex-col gap-4">
            {/* Step 1: Contact */}
            <Section step={1} title="Informasi Kontak" icon={User}>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Nama Lengkap *" className="sm:col-span-2">
                  <input type="text" name="fullname" required placeholder="John Doe" className="input" defaultValue={savedAddr?.name || ''} />
                </Field>
                <Field label="Email *">
                  <input type="email" required placeholder="email@contoh.com" className="input" defaultValue={user?.email || ''} />
                </Field>
                <Field label="Nomor HP / WhatsApp *">
                  <input type="tel" name="phone" required placeholder="08xxxxxxxxxx" className="input" defaultValue={savedAddr?.phone || ''} />
                </Field>
              </div>
            </Section>

            {/* Step 2: Address + Location Search */}
            <Section step={2} title="Alamat Pengiriman" icon={MapPin}>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Alamat Lengkap *" className="sm:col-span-2">
                  <textarea name="address" required rows={3} placeholder="Nama jalan, nomor rumah, RT/RW..." className="input resize-y" defaultValue={savedAddr?.address || ''} />
                </Field>
                <div className="sm:col-span-2">
                  <LocationSearch
                    label="Kelurahan / Kecamatan Tujuan *"
                    placeholder="Ketik nama kelurahan/kecamatan (min 3 huruf)..."
                    value={destination}
                    onChange={setDestination}
                  />
                  <p className="text-[11px] text-gray-400 mt-1.5">
                    Pilih lokasi tujuan untuk menghitung ongkir secara otomatis.
                  </p>
                </div>
                <Field label="Catatan untuk Kurir (opsional)" className="sm:col-span-2">
                  <input type="text" placeholder="Patokan, warna pagar, dll." className="input" />
                </Field>
              </div>
            </Section>

            {/* Step 3: Shipping — real-time dari BinderByte */}
            <Section step={3} title="Metode Pengiriman" icon={Truck}>
              {!destination ? (
                <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                  <AlertCircle className="size-5 shrink-0" />
                  <span>Pilih lokasi tujuan di Step 2 untuk melihat opsi pengiriman.</span>
                </div>
              ) : ratesLoading ? (
                <div className="flex items-center justify-center gap-3 py-8 text-gray-500">
                  <Loader2 className="size-5 animate-spin" />
                  <span className="text-sm">Menghitung ongkir...</span>
                </div>
              ) : ratesError ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                    <AlertCircle className="size-5 shrink-0" />
                    <span>{ratesError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => fetchRates(STORE_ORIGIN_ID, destination.id, totalWeightGram)}
                    className="btn btn-outline btn-sm"
                  >
                    <RefreshCw className="size-4" /> Coba Lagi
                  </button>
                </div>
              ) : rates.length === 0 ? (
                <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600">
                  <AlertCircle className="size-5 shrink-0" />
                  <span>Tidak ada kurir tersedia untuk tujuan ini. Coba pilih lokasi lain.</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-gray-500">
                    Berat: <strong>{(totalWeightGram / 1000).toFixed(1)} kg</strong> • Tujuan: <strong>{destination.label}</strong>
                  </p>
                  <div className="grid gap-2.5 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
                    {rates.map((rate, idx) => (
                      <label
                        key={`${rate.courier_code}-${rate.service}-${idx}`}
                        className={`flex items-center justify-between gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          selectedRate?.courier_code === rate.courier_code && selectedRate?.service === rate.service
                            ? 'border-brand-500 bg-brand-50/50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shipping_rate"
                            checked={selectedRate?.courier_code === rate.courier_code && selectedRate?.service === rate.service}
                            onChange={() => setSelectedRate(rate)}
                            className="size-4 accent-brand-500"
                          />
                          <div>
                            <strong className="block text-sm text-gray-900">{rate.courier_name} — {rate.service}</strong>
                            <span className="text-xs text-gray-500">
                              {rate.type}{rate.estimated ? ` • Est: ${rate.estimated}` : ''}
                            </span>
                          </div>
                        </div>
                        <span className="font-bold text-brand-500 text-sm whitespace-nowrap">{formatPrice(rate.price)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </Section>

            {/* Step 4: Payment */}
            <Section step={4} title="Metode Pembayaran" icon={CreditCard}>
              <div className="grid gap-3">
                {PAYMENT_GROUPS.map((group) => {
                  const IconComp = group.iconName === 'landmark' ? Landmark : group.iconName === 'zap' ? Zap : Banknote;
                  return (
                    <label
                      key={group.id}
                      className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        paymentId === group.id
                          ? 'border-brand-500 bg-brand-50/50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={group.id}
                        checked={paymentId === group.id}
                        onChange={() => setPaymentId(group.id)}
                        className="size-5 accent-brand-500"
                      />
                      <div className="flex-1 min-w-0">
                        <strong className="block text-base text-gray-900">{group.label}</strong>
                        <span className="text-sm text-gray-500">{group.desc}</span>
                      </div>
                      <IconComp className="size-5 text-brand-500" />
                    </label>
                  );
                })}
              </div>

              <div className="mt-5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Catatan untuk pesanan (opsional)
                </label>
                <textarea rows={3} placeholder="Catatan untuk pesanan (opsional)" className="input resize-y" />
              </div>

              <div className="mt-4 flex items-start gap-3 bg-emerald-50 text-emerald-800 rounded-xl p-4 text-xs">
                <ShieldCheck className="size-5 shrink-0" />
                <span>Pembayaran kamu 100% aman dengan enkripsi SSL 256-bit. Kami tidak menyimpan data kartu kredit kamu.</span>
              </div>
            </Section>
          </div>

          {/* Summary */}
          <div className="card p-6 lg:sticky lg:top-32">
            <h3 className="text-xs font-bold uppercase tracking-[2px] text-gray-900 mb-5">Ringkasan Pesanan</h3>

            <div className="space-y-3 mb-5 max-h-72 overflow-y-auto scrollbar-thin pr-1">
              {items.map((item) => {
                const p = findProduct(item.id);
                if (!p) return null;
                return (
                  <div key={p.id} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0">
                    <div className="relative size-12 grid place-items-center bg-gray-50 rounded-lg text-2xl shrink-0">
                      {p.emoji}
                      <span className="absolute -top-1.5 -right-1.5 size-5 bg-gray-900 text-white text-[10px] font-bold rounded-full grid place-items-center">{item.qty}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-gray-900 line-clamp-1">{p.name}</div>
                      <div className="text-[11px] text-gray-500">{formatPrice(p.price)} × {item.qty}</div>
                    </div>
                    <div className="text-xs font-bold text-brand-500 whitespace-nowrap">{formatPrice(p.price * item.qty)}</div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span className="truncate pr-2">{selectedRate ? `${selectedRate.courier_name} ${selectedRate.service}` : 'Ongkir'}</span>
                <span className="font-semibold text-gray-900 whitespace-nowrap">{selectedRate ? formatPrice(shippingCost) : '—'}</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline border-t border-dashed border-gray-200 pt-4 mt-4">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-2xl font-extrabold text-brand-500">{formatPrice(total)}</span>
            </div>

            <button
              type="submit"
              disabled={submitting || !selectedRate}
              className="btn btn-primary btn-lg w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
              {submitting ? 'Memproses...' : 'Bayar Sekarang'}
            </button>

            {!selectedRate && destination && !ratesLoading && rates.length > 0 && (
              <p className="text-center text-xs text-amber-600 mt-2">Pilih kurir di Step 3</p>
            )}

            {orderError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600 mt-3">{orderError}</div>
            )}

            <p className="text-center text-[11px] text-gray-500 mt-3 px-2">
              Dengan klik Bayar, kamu menyetujui{' '}
              <a href="#" className="text-brand-500 font-semibold">Syarat &amp; Ketentuan</a>
            </p>
          </div>
        </form>
      </section>
    </>
  );
}

function Section({
  step, title, icon: Icon, children,
}: {
  step: number; title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode;
}) {
  return (
    <div className="card p-6">
      <h3 className="flex items-center gap-3 text-base font-bold text-gray-900 mb-5">
        <span className="size-8 grid place-items-center bg-brand-500 text-white rounded-full text-xs font-extrabold shadow-md shadow-brand-500/30">{step}</span>
        <Icon className="size-4 text-brand-500" />
        <span className="uppercase tracking-wider text-sm">{title}</span>
      </h3>
      {children}
    </div>
  );
}

function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
