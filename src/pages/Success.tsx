import { Link, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Check, Mail, Home, ShoppingBag, Copy, CheckCheck, Zap, Landmark, Wallet,
  AlertTriangle, MessageCircle, Clock, CreditCard, ChevronRight,
} from 'lucide-react';
import { orderActions } from '../lib/cart';
import type { OrderData } from '../types';
import { formatPrice, formatDate } from '../lib/format';
import { toast } from '../lib/toast';
import { supabase } from '../lib/supabase';

const BANK_ACCOUNTS = [
  { bank: 'BCA', color: 'text-blue-600', number: '8720 5431 88', name: 'PT Erset Indonesia' },
  { bank: 'BNI', color: 'text-orange-500', number: '0412 7893 21', name: 'PT Erset Indonesia' },
  { bank: 'Mandiri', color: 'text-yellow-600', number: '1300 0198 7654', name: 'PT Erset Indonesia' },
  { bank: 'BRI', color: 'text-blue-800', number: '0321 0100 4567 501', name: 'PT Erset Indonesia' },
];

const EWALLET_ACCOUNTS = [
  { name: 'GoPay', color: 'text-green-600', number: '0812-3456-7890', holder: 'Erset Store' },
  { name: 'OVO', color: 'text-purple-600', number: '0812-3456-7890', holder: 'Erset Store' },
  { name: 'DANA', color: 'text-blue-500', number: '0812-3456-7890', holder: 'Erset Store' },
  { name: 'ShopeePay', color: 'text-orange-500', number: '0812-3456-7890', holder: 'Erset Store' },
];

export default function Success() {
  const [params] = useSearchParams();
  const orderId = params.get('order') || '-';
  const order = orderActions.get<OrderData>();
  const paymentMethod = order?.payment.id || 'bank';

  return (
    <section className="container-x py-8 sm:py-12">
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Hero sukses */}
        <div className="text-center animate-slide-up">
          <div className="relative size-24 mx-auto mb-5">
            <span className="absolute inset-0 rounded-full bg-brand-500/15" />
            <span className="absolute inset-2 rounded-full bg-brand-500/25" />
            <span className="absolute inset-4 grid place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-xl shadow-brand-500/40">
              <Check className="size-9" strokeWidth={3} />
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Pesanan Berhasil Dibuat!</h2>
          <p className="text-gray-500 text-sm mt-1.5 px-4">
            Terima kasih sudah belanja di ERSET. Selesaikan pembayaran untuk memproses pesananmu.
          </p>
        </div>

        {/* Kartu order — header gelap premium */}
        <div className="card overflow-hidden animate-slide-up" style={{ animationDelay: '80ms', animationFillMode: 'backwards' }}>
          <div className="relative bg-gradient-to-br from-gray-900 to-ink-800 p-5 sm:p-6">
            <div className="absolute -top-10 -right-10 size-40 rounded-full bg-brand-500/20 blur-3xl" />
            <div className="relative">
              <p className="text-[11px] font-bold uppercase tracking-[2px] text-white/50">Nomor Pesanan</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xl sm:text-2xl font-extrabold text-white font-mono truncate">#{orderId}</span>
                <CopyButton text={orderId} />
              </div>
              <span className="inline-flex items-center gap-1.5 mt-3 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300">
                <Clock className="size-3" /> Menunggu Pembayaran
              </span>
            </div>
          </div>

          <div className="p-5 sm:p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Total Tagihan</span>
              <span className="text-2xl font-extrabold text-brand-500">{formatPrice(order?.total || 0)}</span>
            </div>
            {order?.payment?.name && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 inline-flex items-center gap-1.5"><CreditCard className="size-4" /> Pembayaran</span>
                <span className="font-semibold text-gray-900">{order.payment.name}</span>
              </div>
            )}
            {order?.shipping?.name && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Pengiriman</span>
                <span className="font-semibold text-gray-900 text-right truncate max-w-[60%]">{order.shipping.name}</span>
              </div>
            )}
            {order?.date && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Tanggal</span>
                <span className="text-gray-600">{formatDate(order.date)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Instruksi pembayaran */}
        <div className="animate-slide-up" style={{ animationDelay: '140ms', animationFillMode: 'backwards' }}>
          {paymentMethod === 'bank' && <BankTransferInstructions orderId={orderId} />}
          {paymentMethod === 'ewallet' && <EWalletInstructions orderId={orderId} />}
          {paymentMethod === 'cod' && <CODInstructions />}
        </div>

        {/* Email info */}
        <div className="flex items-start gap-3 bg-brand-50 border border-brand-100 text-brand-700 rounded-2xl p-4 text-sm animate-slide-up" style={{ animationDelay: '180ms', animationFillMode: 'backwards' }}>
          <Mail className="size-5 shrink-0 mt-0.5" />
          <div>
            <strong className="block">Email konfirmasi telah dikirim</strong>
            <span className="text-xs text-brand-600/80">Cek email kamu untuk detail pesanan lengkap.</span>
          </div>
        </div>

        {/* Tombol */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <Link to="/" className="btn btn-outline btn-lg">
            <Home className="size-4" /> Beranda
          </Link>
          <Link to="/produk" className="btn btn-primary btn-lg">
            <ShoppingBag className="size-4" /> Belanja Lagi
          </Link>
        </div>

        <Link to="/akun" className="flex items-center justify-center gap-1 text-sm font-semibold text-gray-500 hover:text-brand-500 transition-colors pt-1">
          Lihat pesanan saya <ChevronRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}

function BankTransferInstructions({ orderId }: { orderId: string }) {
  return (
    <div className="card p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-5">
        <Landmark className="size-5 text-brand-500" />
        <h3 className="text-base font-bold text-gray-900">Transfer ke Rekening Berikut</h3>
      </div>

      <div className="space-y-4">
        {BANK_ACCOUNTS.map((acc, i) => (
          <div key={acc.bank}>
            {i > 0 && <div className="border-t border-gray-100 pt-4" />}
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className={`text-sm font-bold ${acc.color}`}>{acc.bank}</span>
                <div className="text-lg font-extrabold text-gray-900 font-mono mt-0.5">{acc.number}</div>
                <div className="text-xs text-gray-500">a/n {acc.name}</div>
              </div>
              <CopyButton text={acc.number.replace(/\s/g, '')} dark />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 text-xs">
        <AlertTriangle className="size-4 shrink-0 mt-0.5" />
        <div>
          <strong className="block">Penting!</strong>
          Sertakan nomor pesanan <span className="font-mono font-bold">#{orderId}</span> di keterangan/berita transfer agar pembayaran bisa diverifikasi otomatis.
        </div>
      </div>
    </div>
  );
}

function EWalletInstructions({ orderId }: { orderId: string }) {
  return (
    <div className="card p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-5">
        <Wallet className="size-5 text-brand-500" />
        <h3 className="text-base font-bold text-gray-900">Bayar via E-Wallet</h3>
      </div>

      <div className="space-y-4">
        {EWALLET_ACCOUNTS.map((acc, i) => (
          <div key={acc.name}>
            {i > 0 && <div className="border-t border-gray-100 pt-4" />}
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className={`text-sm font-bold ${acc.color}`}>{acc.name}</span>
                <div className="text-lg font-extrabold text-gray-900 font-mono mt-0.5">{acc.number}</div>
                <div className="text-xs text-gray-500">a/n {acc.holder}</div>
              </div>
              <CopyButton text={acc.number.replace(/-/g, '')} dark />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 text-xs">
        <MessageCircle className="size-4 shrink-0 mt-0.5" />
        <div>
          <strong className="block">Konfirmasi Pembayaran</strong>
          Setelah transfer, screenshot bukti pembayaran dan kirim ke WhatsApp kami di <span className="font-bold">0812-3456-7890</span> beserta nomor pesanan <span className="font-mono font-bold">#{orderId}</span>.
        </div>
      </div>
    </div>
  );
}

function CODInstructions() {
  return (
    <div className="card p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="size-5 text-brand-500" />
        <h3 className="text-base font-bold text-gray-900">Bayar di Tempat (COD)</h3>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">
        Pesanan kamu akan segera diproses dan dikirim. Siapkan uang pas sesuai total tagihan saat barang tiba. Kurir tidak bisa memberikan kembalian.
      </p>
    </div>
  );
}

function CopyButton({ text, dark = false }: { text: string; dark?: boolean }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Tersalin!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Gagal menyalin');
    }
  };

  const base = dark
    ? 'bg-gray-50 border-gray-200 text-gray-500 hover:border-brand-500 hover:text-brand-500'
    : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20';

  return (
    <button
      onClick={handleCopy}
      className={`shrink-0 size-9 grid place-items-center rounded-lg border transition-all ${
        copied ? (dark ? 'bg-brand-50 border-brand-300 text-brand-600' : 'bg-white/25 border-white/40 text-white') : base
      }`}
      aria-label="Salin"
    >
      {copied ? <CheckCheck className="size-4" /> : <Copy className="size-4" />}
    </button>
  );
}
