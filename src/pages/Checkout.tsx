import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Lock, ShoppingCart, ShieldCheck, User, MapPin, Truck, CreditCard, ChevronRight,
  Landmark, Zap, Banknote,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { cartActions, orderActions, useCart } from '../lib/cart';
import { findProduct } from '../data/products';
import { formatPrice } from '../lib/format';
import type { OrderData, PaymentMethod, ShippingMethod } from '../types';

const SHIPPINGS: ShippingMethod[] = [
  { id: 'reguler', name: 'JNE Reguler', eta: '2-3 hari kerja', price: 15000 },
  { id: 'yes', name: 'JNE YES (Yakin Esok Sampai)', eta: '1 hari kerja', price: 28000 },
  { id: 'sicepat', name: 'SiCepat REG', eta: '2-3 hari kerja', price: 14000 },
  { id: 'jnt', name: 'J&T Express', eta: '2-4 hari kerja', price: 13000 },
  { id: 'ninja', name: 'Ninja Xpress', eta: '2-3 hari kerja', price: 12000 },
  { id: 'instant', name: 'GoSend Instant (Same Day)', eta: 'Hari ini, area Jabodetabek', price: 35000 },
];

// Grouped payment methods (sesuai web asli)
interface PaymentGroup {
  id: string;
  label: string;
  iconName: string;
  desc: string;
  methods: string[];
}

const PAYMENT_GROUPS: PaymentGroup[] = [
  { id: 'bank', label: 'Transfer Bank', iconName: 'landmark', desc: 'BCA, BNI, Mandiri, BRI', methods: ['BCA', 'BNI', 'Mandiri', 'BRI'] },
  { id: 'ewallet', label: 'E-Wallet', iconName: 'zap', desc: 'GoPay, OVO, DANA, ShopeePay', methods: ['GoPay', 'OVO', 'DANA', 'ShopeePay'] },
  { id: 'cod', label: 'COD', iconName: 'banknote', desc: 'Bayar di tempat', methods: ['Cash on Delivery'] },
];

// Keep for order data
const PAYMENTS: PaymentMethod[] = [
  { id: 'bank', icon: 'landmark', name: 'Transfer Bank', desc: 'BCA, BNI, Mandiri, BRI' },
  { id: 'ewallet', icon: 'zap', name: 'E-Wallet', desc: 'GoPay, OVO, DANA, ShopeePay' },
  { id: 'cod', icon: 'banknote', name: 'COD', desc: 'Bayar di tempat' },
];

export default function Checkout() {
  const { items, count, subtotal } = useCart();
  const [shippingId, setShippingId] = useState('reguler');
  const [paymentId, setPaymentId] = useState('bank');
  const navigate = useNavigate();

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

  const shipping = SHIPPINGS.find((s) => s.id === shippingId)!;
  const payment = PAYMENTS.find((p) => p.id === paymentId)!;
  const total = subtotal + shipping.price;

  const placeOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = 'ERS-' + Date.now().toString().slice(-8);
    const order: OrderData = {
      id: orderId,
      total,
      shipping,
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
                  <input type="text" required placeholder="John Doe" className="input" />
                </Field>
                <Field label="Email *">
                  <input type="email" required placeholder="email@contoh.com" className="input" />
                </Field>
                <Field label="Nomor HP / WhatsApp *">
                  <input type="tel" required placeholder="08xxxxxxxxxx" className="input" />
                </Field>
              </div>
            </Section>

            {/* Step 2: Address */}
            <Section step={2} title="Alamat Pengiriman" icon={MapPin}>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Alamat Lengkap *" className="sm:col-span-2">
                  <textarea required rows={3} placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan..." className="input resize-y" />
                </Field>
                <Field label="Provinsi *">
                  <select required className="input" defaultValue="">
                    <option value="" disabled>Pilih Provinsi</option>
                    <option>DKI Jakarta</option>
                    <option>Jawa Barat</option>
                    <option>Jawa Tengah</option>
                    <option>Jawa Timur</option>
                    <option>DI Yogyakarta</option>
                    <option>Banten</option>
                    <option>Bali</option>
                    <option>Sumatera Utara</option>
                    <option>Sumatera Selatan</option>
                    <option>Lainnya</option>
                  </select>
                </Field>
                <Field label="Kota / Kabupaten *">
                  <input type="text" required placeholder="Jakarta Selatan" className="input" />
                </Field>
                <Field label="Kecamatan *">
                  <input type="text" required placeholder="Kebayoran Baru" className="input" />
                </Field>
                <Field label="Kode Pos *">
                  <input type="text" required pattern="[0-9]{5}" placeholder="12345" className="input" />
                </Field>
                <Field label="Catatan untuk Kurir (opsional)" className="sm:col-span-2">
                  <input type="text" placeholder="Patokan, warna pagar, dll." className="input" />
                </Field>
              </div>
            </Section>

            {/* Step 3: Shipping */}
            <Section step={3} title="Metode Pengiriman" icon={Truck}>
              <div className="grid gap-2.5">
                {SHIPPINGS.map((s) => (
                  <label
                    key={s.id}
                    className={`flex items-center justify-between gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      shippingId === s.id
                        ? 'border-brand-500 bg-brand-50/50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        value={s.id}
                        checked={shippingId === s.id}
                        onChange={() => setShippingId(s.id)}
                        className="size-4 accent-brand-500"
                      />
                      <div>
                        <strong className="block text-sm text-gray-900">{s.name}</strong>
                        <span className="text-xs text-gray-500">Estimasi: {s.eta}</span>
                      </div>
                    </div>
                    <span className="font-bold text-brand-500 text-sm">{formatPrice(s.price)}</span>
                  </label>
                ))}
              </div>
            </Section>

            {/* Step 4: Payment - Style sesuai web asli */}
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

              {/* Catatan pesanan */}
              <div className="mt-5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Catatan untuk pesanan (opsional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Catatan untuk pesanan (opsional)"
                  className="input resize-y"
                />
              </div>

              <div className="mt-4 flex items-start gap-3 bg-emerald-50 text-emerald-800 rounded-xl p-4 text-xs">
                <ShieldCheck className="size-5 shrink-0" />
                <span>
                  Pembayaran kamu 100% aman dengan enkripsi SSL 256-bit. Kami tidak menyimpan data kartu kredit kamu.
                </span>
              </div>
            </Section>
          </div>

          {/* Summary */}
          <div className="card p-6 lg:sticky lg:top-32">
            <h3 className="text-xs font-bold uppercase tracking-[2px] text-gray-900 mb-5">
              Ringkasan Pesanan
            </h3>

            <div className="space-y-3 mb-5 max-h-72 overflow-y-auto scrollbar-thin pr-1">
              {items.map((item) => {
                const p = findProduct(item.id);
                if (!p) return null;
                return (
                  <div key={p.id} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0">
                    <div className="relative size-12 grid place-items-center bg-gray-50 rounded-lg text-2xl shrink-0">
                      {p.emoji}
                      <span className="absolute -top-1.5 -right-1.5 size-5 bg-gray-900 text-white text-[10px] font-bold rounded-full grid place-items-center">
                        {item.qty}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-gray-900 line-clamp-1">{p.name}</div>
                      <div className="text-[11px] text-gray-500">{formatPrice(p.price)} × {item.qty}</div>
                    </div>
                    <div className="text-xs font-bold text-brand-500 whitespace-nowrap">
                      {formatPrice(p.price * item.qty)}
                    </div>
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
                <span className="truncate pr-2">{shipping.name}</span>
                <span className="font-semibold text-gray-900 whitespace-nowrap">{formatPrice(shipping.price)}</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline border-t border-dashed border-gray-200 pt-4 mt-4">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-2xl font-extrabold text-brand-500">{formatPrice(total)}</span>
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-full mt-5">
              <Lock className="size-4" />
              Bayar Sekarang
            </button>

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
        <span className="size-8 grid place-items-center bg-brand-500 text-white rounded-full text-xs font-extrabold shadow-md shadow-brand-500/30">
          {step}
        </span>
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
