import { Link, useSearchParams } from 'react-router-dom';
import { Check, Mail, Home, ShoppingBag } from 'lucide-react';
import { orderActions } from '../lib/cart';
import type { OrderData } from '../types';
import { formatDate, formatPrice } from '../lib/format';

export default function Success() {
  const [params] = useSearchParams();
  const orderId = params.get('order') || '-';
  const order = orderActions.get<OrderData>();

  return (
    <section className="container-x py-12">
      <div className="card max-w-2xl mx-auto p-8 sm:p-14 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 size-96 bg-brand-50 rounded-full blur-3xl -z-10" />

        <div className="size-24 mx-auto grid place-items-center bg-emerald-500 text-white rounded-full mb-6 shadow-lg shadow-emerald-500/30 animate-slide-up">
          <Check className="size-12" strokeWidth={3} />
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">Pesanan Berhasil!</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Terima kasih telah berbelanja di Erset Store. Pesanan kamu sedang kami proses dan akan segera dikirim.
        </p>

        {/* Order Info */}
        <div className="bg-gray-50 rounded-2xl p-6 text-left mb-7">
          <Row label="No. Pesanan" value={<span className="text-brand-500 font-mono">#{orderId}</span>} />
          <Row label="Tanggal" value={formatDate(order?.date || new Date().toISOString())} />
          <Row label="Jumlah Item" value={`${order?.itemCount || 0} produk`} />
          <Row label="Pengiriman" value={order?.shipping.name || '-'} />
          <Row label="Estimasi" value={order?.shipping.eta || '-'} />
          <Row label="Pembayaran" value={`${order?.payment.icon || ''} ${order?.payment.name || '-'}`} />
          <div className="flex justify-between items-baseline pt-3 mt-2 border-t border-dashed border-gray-300">
            <span className="font-bold text-gray-900">Total Pembayaran</span>
            <span className="text-2xl font-extrabold text-brand-500">
              {formatPrice(order?.total || 0)}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-brand-50 text-brand-700 rounded-xl p-4 mb-8 text-left text-sm">
          <Mail className="size-5 shrink-0 mt-0.5" />
          <div>
            <strong className="block">Email konfirmasi telah dikirim</strong>
            <span className="text-xs text-brand-600/80">
              Cek email kamu untuk detail pesanan dan instruksi pembayaran.
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/" className="btn btn-outline btn-md">
            <Home className="size-4" />
            Beranda
          </Link>
          <Link to="/produk" className="btn btn-primary btn-md">
            <ShoppingBag className="size-4" />
            Lanjut Belanja
          </Link>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between text-sm py-2 gap-3">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold text-gray-900 text-right">{value}</span>
    </div>
  );
}
