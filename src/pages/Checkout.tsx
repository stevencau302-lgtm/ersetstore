import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Lock, ShoppingCart, ShieldCheck, User, MapPin, Truck, CreditCard,
  Landmark, Zap, Banknote, Loader2, AlertCircle, RefreshCw,
  Package, BadgeCheck, Clock, ChevronDown,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import LocationSearch from '../components/LocationSearch';
import { cartActions, orderActions, useCart } from '../lib/cart';
import { findProduct } from '../data/products';
import { formatPrice } from '../lib/format';
import { type Location, type ShippingRate } from '../lib/shipping';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { fetchSavedAddress, saveAddressToSupabase, type SavedAddress } from './Akun';
import type { OrderData, PaymentMethod } from '../types';

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

  // Kontak (controlled) — dipakai juga untuk indikator progres
  const [contact, setContact] = useState({ name: '', email: '', phone: '' });

  // Location & Shipping
  const [destination, setDestination] = useState<Location | null>(null);
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [ratesError, setRatesError] = useState('');

  // Berat total (gram): asumsikan 500g per item, minimum 1000g
  const totalWeightGram = Math.max(1000, items.reduce((sum, item) => sum + item.qty * 500, 0));

  // Handler ketika user pilih/hapus lokasi — LANGSUNG fetch ongkir
  const handleDestinationChange = async (loc: Location | null) => {
    setDestination(loc);
    setSelectedRate(null);
    setRates([]);
    setRatesError('');

    if (!loc) return;

    setRatesLoading(true);
    try {
      const params = new URLSearchParams({ destination: loc.id, weight: totalWeightGram.toString() });
      const res = await fetch(`/api/shipping-cost?${params}`);
      const text = await res.text();

      let data: any;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('[Checkout] RESPONSE BUKAN JSON:', text.slice(0, 300));
        setRatesError('Response bukan JSON — kemungkinan server error');
        return;
      }

      if (!res.ok) {
        setRatesError(data.error || 'Gagal mengambil ongkir');
      } else {
        const results = data.result || [];
        setRates(results);
        if (results.length > 0) setSelectedRate(results[0]);
      }
    } catch (err: any) {
      console.error('[Checkout] FETCH GAGAL:', err);
      setRatesError(err.message || 'Gagal mengambil ongkir');
    } finally {
      setRatesLoading(false);
    }
  };

  // Init email dari akun
  useEffect(() => {
    if (user?.email) setContact((c) => ({ ...c, email: c.email || user.email || '' }));
  }, [user]);

  // Fetch saved address
  useEffect(() => {
    if (user) {
      fetchSavedAddress(user.id).then(async (addr) => {
        if (addr) {
          setSavedAddr(addr);
          setContact((c) => ({ ...c, name: c.name || addr.name || '', phone: c.phone || addr.phone || '' }));
        } else {
          try {
            const { data } = await supabase
              .from('orders')
              .select('shipping_name, shipping_phone, shipping_address')
              .eq('user_id', user.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle();
            if (data && data.shipping_name) {
              const a = { name: data.shipping_name, phone: data.shipping_phone || '', address: data.shipping_address || '' };
              setSavedAddr(a);
              setContact((c) => ({ ...c, name: c.name || a.name, phone: c.phone || a.phone }));
            }
          } catch (err) {
            console.log('[Checkout] fetchSavedAddress fallback error:', err);
          }
        }
      }).catch(err => {
        console.log('[Checkout] fetchSavedAddress error:', err);
      });
    }
  }, [user]);

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
          <div className="card text-center py-20 px-6 animate-fade-in">
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

  // Progres langkah
  const contactDone = !!(contact.name.trim() && contact.email.trim() && contact.phone.trim());
  const steps = [
    { n: 1, label: 'Kontak', icon: User, done: contactDone },
    { n: 2, label: 'Alamat', icon: MapPin, done: !!destination },
    { n: 3, label: 'Pengiriman', icon: Truck, done: !!selectedRate },
    { n: 4, label: 'Bayar', icon: CreditCard, done: !!paymentId },
  ];

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
    const shippingName = (formData.get('fullname') as string) || contact.name;
    const shippingPhone = (formData.get('phone') as string) || contact.phone;
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

      <section className="container-x pb-40 lg:pb-16">
        {/* Stepper progres */}
        <div className="mb-6 animate-fade-in">
          <Stepper steps={steps} />
        </div>

        <form id="checkoutForm" onSubmit={placeOrder} className="grid lg:grid-cols-[1fr_380px] gap-4 lg:gap-6 items-start">
          <div className="flex flex-col gap-3 lg:gap-4">
            {/* Step 1: Contact */}
            <Section step={1} title="Informasi Kontak" icon={User} delay={0}>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Nama Lengkap *" className="sm:col-span-2">
                  <input
                    type="text" name="fullname" required placeholder="John Doe" className="input"
                    value={contact.name} onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
                  />
                </Field>
                <Field label="Email *">
                  <input
                    type="email" required placeholder="email@contoh.com" className="input"
                    value={contact.email} onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                  />
                </Field>
                <Field label="Nomor HP / WhatsApp *">
                  <input
                    type="tel" name="phone" required placeholder="08xxxxxxxxxx" className="input"
                    value={contact.phone} onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                  />
                </Field>
              </div>
            </Section>

            {/* Step 2: Address + Location Search */}
            <Section step={2} title="Alamat Pengiriman" icon={MapPin} delay={60}>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Alamat Lengkap *" className="sm:col-span-2">
                  <textarea name="address" required rows={3} placeholder="Nama jalan, nomor rumah, RT/RW..." className="input resize-y" defaultValue={savedAddr?.address || ''} />
                </Field>
                <div className="sm:col-span-2">
                  <LocationSearch
                    label="Kelurahan / Kecamatan Tujuan *"
                    placeholder="Ketik nama kelurahan/kecamatan (min 3 huruf)..."
                    value={destination}
                    onChange={handleDestinationChange}
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

            {/* Step 3: Shipping — real-time dari api.co.id */}
            <Section step={3} title="Metode Pengiriman" icon={Truck} delay={120}>
              {!destination ? (
                <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                  <AlertCircle className="size-5 shrink-0" />
                  <span>Pilih lokasi tujuan di Step 2 untuk melihat opsi pengiriman.</span>
                </div>
              ) : ratesLoading ? (
                <div className="grid gap-2.5">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-4 border-2 border-gray-100 rounded-xl animate-pulse-soft">
                      <div className="size-4 rounded-full bg-gray-200 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-2/5 bg-gray-200 rounded" />
                        <div className="h-2.5 w-1/4 bg-gray-100 rounded" />
                      </div>
                      <div className="h-3 w-16 bg-gray-200 rounded" />
                    </div>
                  ))}
                  <p className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-1">
                    <Loader2 className="size-3.5 animate-spin" /> Menghitung ongkir real-time...
                  </p>
                </div>
              ) : ratesError ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                    <AlertCircle className="size-5 shrink-0" />
                    <span>{ratesError}</span>
                  </div>
                  <button type="button" onClick={() => handleDestinationChange(destination)} className="btn btn-outline btn-sm">
                    <RefreshCw className="size-4" /> Coba Lagi
                  </button>
                </div>
              ) : rates.length === 0 ? (
                <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600">
                  <AlertCircle className="size-5 shrink-0" />
                  <span>Tidak ada kurir tersedia untuk tujuan ini. Coba pilih lokasi lain.</span>
                </div>
              ) : (
                <div className="space-y-3 w-full overflow-hidden">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1.5"><Package className="size-3.5" /> Berat: <strong className="text-gray-700">{(totalWeightGram / 1000).toFixed(1)} kg</strong></span>
                    <span className="inline-flex items-center gap-1.5 min-w-0"><MapPin className="size-3.5 shrink-0" /> <span className="truncate">{destination.label}</span></span>
                  </div>
                  <div className="grid gap-2 sm:gap-2.5 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
                    {rates.map((rate, idx) => {
                      const active = selectedRate?.courier_code === rate.courier_code && selectedRate?.service === rate.service;
                      const cheapest = idx === 0;
                      return (
                        <label
                          key={`${rate.courier_code}-${rate.service}-${idx}`}
                          className={`group relative flex items-center gap-3 p-3 sm:p-4 border-2 rounded-2xl cursor-pointer transition-all duration-200 w-full overflow-hidden ${
                            active
                              ? 'border-brand-500 bg-brand-50/60 shadow-sm shadow-brand-500/10'
                              : 'border-gray-200 hover:border-brand-300 hover:bg-gray-50/50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="shipping_rate"
                            checked={active}
                            onChange={() => setSelectedRate(rate)}
                            className="sr-only"
                          />
                          <span className={`size-5 rounded-full border-2 grid place-items-center shrink-0 transition-all ${active ? 'border-brand-500 bg-brand-500' : 'border-gray-300 group-hover:border-brand-400'}`}>
                            {active && <Check className="size-3 text-white" strokeWidth={3} />}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <strong className="text-xs sm:text-sm text-gray-900 break-words">{rate.courier_name}{rate.service ? ` — ${rate.service}` : ''}</strong>
                              {cheapest && (
                                <span className="badge bg-brand-100 text-brand-700 !py-0.5">Termurah</span>
                              )}
                            </div>
                            {rate.estimated && (
                              <span className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500 mt-0.5">
                                <Clock className="size-3" /> {rate.estimated}
                              </span>
                            )}
                          </div>
                          <span className={`font-extrabold text-xs sm:text-sm whitespace-nowrap shrink-0 ${active ? 'text-brand-600' : 'text-gray-900'}`}>{formatPrice(rate.price)}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </Section>

            {/* Step 4: Payment */}
            <Section step={4} title="Metode Pembayaran" icon={CreditCard} delay={180}>
              <div className="grid gap-2 sm:gap-3">
                {PAYMENT_GROUPS.map((group) => {
                  const IconComp = group.iconName === 'landmark' ? Landmark : group.iconName === 'zap' ? Zap : Banknote;
                  const active = paymentId === group.id;
                  return (
                    <label
                      key={group.id}
                      className={`group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                        active ? 'border-brand-500 bg-brand-50/60 shadow-sm shadow-brand-500/10' : 'border-gray-200 hover:border-brand-300 hover:bg-gray-50/50'
                      }`}
                    >
                      <input type="radio" name="payment" value={group.id} checked={active} onChange={() => setPaymentId(group.id)} className="sr-only" />
                      <span className={`size-10 sm:size-11 rounded-xl grid place-items-center shrink-0 transition-colors ${active ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'}`}>
                        <IconComp className="size-5" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <strong className="block text-sm sm:text-base text-gray-900">{group.label}</strong>
                        <span className="text-xs sm:text-sm text-gray-500">{group.desc}</span>
                      </div>
                      <span className={`size-5 rounded-full border-2 grid place-items-center shrink-0 transition-all ${active ? 'border-brand-500 bg-brand-500' : 'border-gray-300'}`}>
                        {active && <Check className="size-3 text-white" strokeWidth={3} />}
                      </span>
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

              <div className="mt-4 flex items-start gap-3 bg-gray-50 text-gray-600 rounded-xl p-4 text-xs border border-gray-100">
                <ShieldCheck className="size-5 shrink-0 text-brand-500" />
                <span>Pembayaran kamu 100% aman dengan enkripsi SSL 256-bit. Kami tidak menyimpan data kartu kredit kamu.</span>
              </div>
            </Section>

            {/* Ringkasan Pesanan (mobile) — bisa di-expand */}
            <details className="lg:hidden card overflow-hidden group animate-slide-up" style={{ animationDelay: '220ms', animationFillMode: 'backwards' }}>
              <summary className="flex items-center justify-between px-4 py-4 cursor-pointer list-none select-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-center gap-2 text-sm font-bold text-gray-900">
                  <Package className="size-4 text-brand-500" /> Ringkasan Pesanan
                </span>
                <span className="flex items-center gap-2 text-xs text-gray-500">
                  {count} item
                  <ChevronDown className="size-4 transition-transform duration-300 group-open:rotate-180" />
                </span>
              </summary>
              <div className="px-4 pb-4 border-t border-gray-100">
                <div className="space-y-3 py-3 max-h-64 overflow-y-auto scrollbar-thin">
                  {items.map((item) => {
                    const p = findProduct(item.id);
                    if (!p) return null;
                    return (
                      <div key={p.id} className="flex items-center gap-3">
                        <div className="relative size-11 grid place-items-center bg-gray-50 rounded-xl text-xl shrink-0">
                          {p.emoji}
                          <span className="absolute -top-1.5 -right-1.5 size-5 bg-brand-500 text-white text-[10px] font-bold rounded-full grid place-items-center shadow">{item.qty}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-gray-900 line-clamp-1">{p.name}</div>
                          <div className="text-[11px] text-gray-500">{formatPrice(p.price)} × {item.qty}</div>
                        </div>
                        <div className="text-xs font-bold text-gray-900 whitespace-nowrap">{formatPrice(p.price * item.qty)}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="space-y-1.5 text-sm border-t border-dashed border-gray-200 pt-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span className="truncate pr-2">{selectedRate ? `${selectedRate.courier_name} ${selectedRate.service}` : 'Ongkir'}</span>
                    <span className="font-semibold text-gray-900 whitespace-nowrap">{selectedRate ? formatPrice(shippingCost) : '—'}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-1">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-lg font-extrabold text-brand-500">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </details>
          </div>

          {/* Summary - Desktop: sticky sidebar */}
          <div className="hidden lg:block lg:sticky lg:top-32 animate-slide-up">
            <div className="card overflow-hidden">
              <div className="bg-gradient-to-br from-gray-900 to-ink-800 px-6 py-5">
                <h3 className="text-xs font-bold uppercase tracking-[2px] text-white/90 flex items-center gap-2">
                  <Package className="size-4 text-brand-500" /> Ringkasan Pesanan
                </h3>
                <p className="text-[11px] text-white/50 mt-1">{count} item dalam keranjang</p>
              </div>

              <div className="p-6">
                <div className="space-y-3 mb-5 max-h-72 overflow-y-auto scrollbar-thin pr-1">
                  {items.map((item) => {
                    const p = findProduct(item.id);
                    if (!p) return null;
                    return (
                      <div key={p.id} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0">
                        <div className="relative size-12 grid place-items-center bg-gray-50 rounded-xl text-2xl shrink-0">
                          {p.emoji}
                          <span className="absolute -top-1.5 -right-1.5 size-5 bg-brand-500 text-white text-[10px] font-bold rounded-full grid place-items-center shadow">{item.qty}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-gray-900 line-clamp-1">{p.name}</div>
                          <div className="text-[11px] text-gray-500">{formatPrice(p.price)} × {item.qty}</div>
                        </div>
                        <div className="text-xs font-bold text-gray-900 whitespace-nowrap">{formatPrice(p.price * item.qty)}</div>
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
                  <span className="text-2xl font-extrabold text-brand-500 transition-all">{formatPrice(total)}</span>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !selectedRate}
                  className="btn btn-primary btn-lg w-full mt-5 disabled:opacity-50 disabled:cursor-not-allowed"
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

                {/* Trust badges */}
                <div className="grid grid-cols-3 gap-2 mt-5 pt-5 border-t border-gray-100">
                  <TrustBadge icon={ShieldCheck} label="Pembayaran Aman" />
                  <TrustBadge icon={BadgeCheck} label="Produk Original" />
                  <TrustBadge icon={Truck} label="Kurir Resmi" />
                </div>

                <p className="text-center text-[11px] text-gray-500 mt-4 px-2">
                  Dengan klik Bayar, kamu menyetujui{' '}
                  <a href="#" className="text-brand-500 font-semibold">Syarat &amp; Ketentuan</a>
                </p>
              </div>
            </div>
          </div>
        </form>

        {/* Mobile sticky bottom bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden shadow-[0_-4px_24px_rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-between mb-2.5">
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Total Bayar</p>
              <p className="text-xl font-extrabold text-brand-500 leading-tight">{formatPrice(total)}</p>
            </div>
            <div className="text-right">
              {selectedRate && (
                <p className="text-[11px] font-medium text-gray-700">{selectedRate.courier_name} {selectedRate.service}</p>
              )}
              <p className="text-[11px] text-gray-500">{count} item • {(totalWeightGram / 1000).toFixed(1)} kg</p>
            </div>
          </div>
          <button
            type="submit"
            form="checkoutForm"
            disabled={submitting || !selectedRate}
            className="btn btn-primary btn-lg w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
            {submitting ? 'Memproses...' : 'Bayar Sekarang'}
          </button>
          {!selectedRate && destination && !ratesLoading && rates.length > 0 && (
            <p className="text-center text-[11px] text-amber-600 mt-1.5">Pilih kurir dulu di Step 3</p>
          )}
          {orderError && (
            <p className="text-xs text-red-500 text-center mt-1.5">{orderError}</p>
          )}
        </div>
      </section>
    </>
  );
}

function Stepper({ steps }: { steps: { n: number; label: string; icon: React.ComponentType<{ className?: string }>; done: boolean }[] }) {
  return (
    <div className="card px-4 sm:px-6 py-4">
      <div className="flex items-center">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.n} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`size-9 sm:size-10 rounded-full grid place-items-center shrink-0 transition-all duration-300 ${
                    s.done ? 'bg-brand-500 text-white shadow-md shadow-brand-500/30' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <Icon className="size-5" />
                </span>
                <div className="hidden sm:block min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 leading-none">Langkah {s.n}</p>
                  <p className={`text-sm font-bold leading-tight ${s.done ? 'text-gray-900' : 'text-gray-500'}`}>{s.label}</p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 sm:mx-3 rounded-full overflow-hidden bg-gray-100">
                  <div className={`h-full bg-brand-500 transition-all duration-500 ${s.done ? 'w-full' : 'w-0'}`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TrustBadge({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <Icon className="size-5 text-gray-400" />
      <span className="text-[10px] text-gray-500 leading-tight">{label}</span>
    </div>
  );
}

function Section({
  step, title, icon: Icon, children, delay = 0,
}: {
  step: number; title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode; delay?: number;
}) {
  return (
    <div className="card p-4 sm:p-6 animate-slide-up hover:shadow-md" style={{ animationDelay: `${delay}ms`, animationFillMode: 'backwards' }}>
      <h3 className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base font-bold text-gray-900 mb-4 sm:mb-5">
        <span className="size-7 sm:size-8 grid place-items-center rounded-full text-[10px] sm:text-xs font-extrabold shadow-md bg-brand-500 text-white shadow-brand-500/30">
          {step}
        </span>
        <Icon className="size-4 text-brand-500" />
        <span className="uppercase tracking-wider text-xs sm:text-sm">{title}</span>
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
