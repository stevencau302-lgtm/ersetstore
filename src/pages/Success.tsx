import { Link, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import {
  Check, Mail, Home, ShoppingBag, Copy, CheckCheck, Zap, Landmark, Wallet,
  AlertTriangle, MessageCircle,
} from 'lucide-react';
import { orderActions } from '../lib/cart';
import type { OrderData } from '../types';
import { formatPrice, formatDate } from '../lib/format';
import { toast } from '../lib/toast';

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
        {/* Success Icon */}
        <div className="text-center mb-2">
          <div className="size-20 mx-auto grid place-items-center bg-emerald-500 text-white rounded-full shadow-lg shadow-emerald-500/30 animate-slide-up mb-4">
            <Check className="size-10" strokeWidth={3} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Pesanan Berhasil!</h2>
          <p className="text-gray-500 text-sm mt-1">Silakan selesaikan pembayaran kamu</p>
        </div>

        {/* Order Summary Card */}
        <div className="bg-gray-900 text-white rounded-2xl p-5 sm:p-6">
          <div className="text-xs font-bold uppercase tracking-[2px] text-gray-400 mb-2">
            Nomor Pesanan
          </div>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-brand-500 font-mono">
              #{orderId}
            </span>
            <CopyButton text={orderId} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-gray-400">Total Tagihan:</span>
            <span className="text-xl font-extrabold text-white">
              {formatPrice(order?.total || 0)}
            </span>
          </div>
          {order?.date && (
            <div className="text-xs text-gray-500 mt-2">{formatDate(order.date)}</div>
          )}
        </div>

        {/* Payment Instructions - Dynamic */}
        {paymentMethod === 'bank' && <BankTransferInstructions orderId={orderId} />}
        {paymentMethod === 'ewallet' && <EWalletInstructions orderId={orderId} />}
        {paymentMethod === 'cod' && <CODInstructions />}

        {/* Email info */}
        <div className="flex items-start gap-3 bg-brand-50 border border-brand-100 text-brand-700 rounded-xl p-4 text-sm">
          <Mail className="size-5 shrink-0 mt-0.5" />
          <div>
            <strong className="block">Email konfirmasi telah dikirim</strong>
            <span className="text-xs text-brand-600/80">
              Cek email kamu untuk detail pesanan lengkap.
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 justify-center pt-2">
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
                <div className="text-lg font-extrabold text-gray-900 font-mono mt-0.5">
                  {acc.number}
                </div>
                <div className="text-xs text-gray-500">a/n {acc.name}</div>
              </div>
              <CopyButton text={acc.number.replace(/\s/g, '')} />
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
                <div className="text-lg font-extrabold text-gray-900 font-mono mt-0.5">
                  {acc.number}
                </div>
                <div className="text-xs text-gray-500">a/n {acc.holder}</div>
              </div>
              <CopyButton text={acc.number.replace(/-/g, '')} />
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

function CopyButton({ text }: { text: string }) {
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

  return (
    <button
      onClick={handleCopy}
      className={`shrink-0 size-9 grid place-items-center rounded-lg border transition-all ${
        copied
          ? 'bg-emerald-50 border-emerald-300 text-emerald-600'
          : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-brand-500 hover:text-brand-500'
      }`}
      aria-label="Salin"
    >
      {copied ? <CheckCheck className="size-4" /> : <Copy className="size-4" />}
    </button>
  );
}
