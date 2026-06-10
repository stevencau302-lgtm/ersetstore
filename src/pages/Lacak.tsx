import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search, Package, Clock, CheckCircle2, Truck, Loader2, MapPin, AlertCircle, Receipt,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { supabase } from '../lib/supabase';
import { formatPrice, formatDate } from '../lib/format';

interface TrackOrder {
  order_number: string;
  status: string;
  items: { product_name: string; qty: number; price: number }[];
  total: number;
  shipping_name: string;
  shipping_address: string;
  shipping_method?: string;
  created_at: string;
}

// Urutan tahap pengiriman
const STAGES = [
  { key: 'pending', label: 'Menunggu Pembayaran', icon: Clock },
  { key: 'processing', label: 'Sedang Diproses', icon: Package },
  { key: 'shipped', label: 'Dalam Pengiriman', icon: Truck },
  { key: 'done', label: 'Selesai', icon: CheckCircle2 },
];

export default function Lacak() {
  const [params] = useSearchParams();
  const [orderNo, setOrderNo] = useState(params.get('order') || '');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<TrackOrder | null>(null);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const track = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const no = orderNo.trim();
    if (!no) return;

    setLoading(true);
    setError('');
    setOrder(null);
    setSearched(true);

    try {
      const { data, error: qErr } = await supabase
        .from('orders')
        .select('order_number, status, items, total, shipping_name, shipping_address, shipping_method, created_at')
        .eq('order_number', no)
        .maybeSingle();

      if (qErr) {
        setError('Gagal mencari pesanan. Coba lagi.');
      } else if (!data) {
        setError('Pesanan tidak ditemukan. Pastikan nomor pesanan benar.');
      } else {
        setOrder(data as TrackOrder);
      }
    } catch {
      setError('Terjadi kesalahan koneksi.');
    } finally {
      setLoading(false);
    }
  };

  const breadcrumb = [
    { label: 'Beranda', to: '/' },
    { label: 'Lacak Pesanan' },
  ];

  const currentStageIdx = order ? Math.max(0, STAGES.findIndex((s) => s.key === order.status)) : -1;

  return (
    <>
      <PageHeader title="Lacak Pesanan" breadcrumb={breadcrumb} />

      <section className="container-x pb-16">
        <div className="max-w-2xl mx-auto space-y-5">
          {/* Form */}
          <div className="card p-5 sm:p-6 animate-slide-up">
            <h2 className="text-base font-bold text-gray-900 mb-1">Cek Status Pesanan</h2>
            <p className="text-sm text-gray-500 mb-4">Masukkan nomor pesanan kamu (contoh: ERS-12345678).</p>
            <form onSubmit={track} className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <input
                  type="text"
                  value={orderNo}
                  onChange={(e) => setOrderNo(e.target.value)}
                  placeholder="Nomor pesanan..."
                  className="input pl-10"
                />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary btn-md disabled:opacity-50 sm:px-8">
                {loading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
                Lacak
              </button>
            </form>
          </div>

          {/* Error / not found */}
          {searched && !loading && error && (
            <div className="card p-6 text-center animate-fade-in">
              <div className="size-14 mx-auto rounded-full bg-amber-50 grid place-items-center mb-3">
                <AlertCircle className="size-7 text-amber-500" />
              </div>
              <p className="font-semibold text-gray-900">{error}</p>
              <p className="text-sm text-gray-500 mt-1">Cek kembali nomor pesanan di email konfirmasi atau halaman Akun.</p>
            </div>
          )}

          {/* Result */}
          {order && (
            <div className="card overflow-hidden animate-slide-up">
              {/* Header */}
              <div className="relative bg-gradient-to-br from-gray-900 to-ink-800 p-5 sm:p-6">
                <div className="absolute -top-10 -right-10 size-40 rounded-full bg-brand-500/20 blur-3xl" />
                <div className="relative flex items-center justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-[2px] text-white/50">Nomor Pesanan</p>
                    <p className="text-lg font-extrabold text-white font-mono truncate">#{order.order_number}</p>
                  </div>
                  <span className="text-2xl font-extrabold text-brand-500">{formatPrice(order.total)}</span>
                </div>
              </div>

              {/* Timeline */}
              <div className="p-5 sm:p-6">
                <div className="space-y-0">
                  {STAGES.map((stage, i) => {
                    const Icon = stage.icon;
                    const done = i <= currentStageIdx;
                    const active = i === currentStageIdx;
                    const isLast = i === STAGES.length - 1;
                    return (
                      <div key={stage.key} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`size-9 rounded-full grid place-items-center shrink-0 transition-colors ${
                            done ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-400'
                          } ${active ? 'ring-4 ring-brand-500/20' : ''}`}>
                            <Icon className="size-4.5" />
                          </div>
                          {!isLast && <div className={`w-0.5 flex-1 min-h-[28px] ${i < currentStageIdx ? 'bg-brand-500' : 'bg-gray-200'}`} />}
                        </div>
                        <div className={`pb-6 pt-1 ${isLast ? 'pb-0' : ''}`}>
                          <p className={`text-sm font-bold ${done ? 'text-gray-900' : 'text-gray-400'}`}>{stage.label}</p>
                          {active && (
                            <p className="text-xs text-brand-600 mt-0.5">Status terkini</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Detail */}
                <div className="border-t border-gray-100 mt-2 pt-4 space-y-4">
                  <div>
                    <h4 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                      <MapPin className="size-3.5 text-brand-500" /> Tujuan Pengiriman
                    </h4>
                    <p className="text-sm font-semibold text-gray-900">{order.shipping_name}</p>
                    <p className="text-sm text-gray-600">{order.shipping_address}</p>
                    {order.shipping_method && (
                      <p className="text-xs text-gray-500 mt-1 inline-flex items-center gap-1.5">
                        <Truck className="size-3.5" /> {order.shipping_method}
                      </p>
                    )}
                  </div>

                  <div>
                    <h4 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                      <Receipt className="size-3.5 text-brand-500" /> Produk
                    </h4>
                    <div className="space-y-1.5">
                      {order.items.map((it, i) => (
                        <div key={i} className="flex items-center justify-between text-sm gap-2">
                          <span className="text-gray-700 truncate">{it.product_name}</span>
                          <span className="text-gray-500 shrink-0">{it.qty} × {formatPrice(it.price)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-gray-400">Dibuat {formatDate(order.created_at)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
