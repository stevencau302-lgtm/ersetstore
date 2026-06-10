import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package, ShoppingBag, LogOut, Clock, CheckCircle2, Truck, Loader2,
  MapPin, Save, Pencil, X, Wallet, Calendar, ChevronRight, Phone, CreditCard, Receipt,
  Heart, HelpCircle, Hand,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { formatPrice } from '../lib/format';
import { findProduct } from '../data/products';

interface Order {
  id: string;
  order_number?: string;
  items: { product_id: number; product_name: string; qty: number; price: number }[];
  subtotal?: number;
  shipping_cost?: number;
  shipping_method?: string;
  payment_method?: string;
  total: number;
  status: string;
  shipping_name: string;
  shipping_address: string;
  shipping_phone: string;
  created_at: string;
}

export interface SavedAddress {
  name: string;
  phone: string;
  address: string;
}

const STATUS_MAP: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: 'Menunggu Pembayaran', color: 'text-amber-600 bg-amber-50', icon: Clock },
  processing: { label: 'Sedang Diproses', color: 'text-blue-600 bg-blue-50', icon: Package },
  shipped: { label: 'Dalam Pengiriman', color: 'text-purple-600 bg-purple-50', icon: Truck },
  done: { label: 'Selesai', color: 'text-emerald-600 bg-emerald-50', icon: CheckCircle2 },
};

// Fetch alamat tersimpan dari Supabase profiles
export async function fetchSavedAddress(userId: string): Promise<SavedAddress | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('shipping_name, shipping_phone, shipping_address')
      .eq('id', userId)
      .maybeSingle();

    if (error || !data) return null;

    if (data.shipping_name) {
      return {
        name: data.shipping_name || '',
        phone: data.shipping_phone || '',
        address: data.shipping_address || '',
      };
    }
  } catch {
    // Kolom mungkin belum ada di tabel — skip aja
  }
  return null;
}

// Simpan alamat ke Supabase profiles
export async function saveAddressToSupabase(userId: string, addr: SavedAddress) {
  await supabase
    .from('profiles')
    .update({
      shipping_name: addr.name,
      shipping_phone: addr.phone,
      shipping_address: addr.address,
    })
    .eq('id', userId);
}

export default function Akun() {
  const { user, signOut } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAddress, setEditingAddress] = useState(false);
  const [address, setAddress] = useState<SavedAddress>({ name: '', phone: '', address: '' });
  const [savedAddr, setSavedAddr] = useState<SavedAddress | null>(null);
  const [savingAddr, setSavingAddr] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const breadcrumb = [
    { label: 'Beranda', to: '/' },
    { label: 'Akun Saya' },
  ];

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      // Fetch orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ordersData) setOrders(ordersData);

      // Fetch saved address from profiles
      const addr = await fetchSavedAddress(user.id);
      if (addr) {
        setSavedAddr(addr);
        setAddress(addr);
      } else if (ordersData && ordersData.length > 0) {
        // Auto-save dari order terakhir
        const lastOrder = ordersData[0];
        const autoAddr: SavedAddress = {
          name: lastOrder.shipping_name,
          phone: lastOrder.shipping_phone,
          address: lastOrder.shipping_address,
        };
        await saveAddressToSupabase(user.id, autoAddr);
        setSavedAddr(autoAddr);
        setAddress(autoAddr);
      }

      setLoading(false);
    }
    fetchData();
  }, [user]);

  const handleSaveAddress = async () => {
    if (!address.name || !address.phone || !address.address || !user) return;
    setSavingAddr(true);
    await saveAddressToSupabase(user.id, address);
    setSavedAddr(address);
    setEditingAddress(false);
    setSavingAddr(false);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalSpent = orders.reduce((s, o) => s + (o.total || 0), 0);
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('id-ID', { month: 'short', year: '2-digit' })
    : '-';
  const memberSinceLong = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
    : '-';
  const displayName = savedAddr?.name || user?.email?.split('@')[0] || 'User';
  const processingCount = orders.filter((o) => o.status === 'processing' || o.status === 'shipped').length;
  const shippedCount = orders.filter((o) => o.status === 'shipped').length;
  const doneCount = orders.filter((o) => o.status === 'done').length;
  const filteredOrders = statusFilter === 'all' ? orders : orders.filter((o) => o.status === statusFilter);
  // Format ringkas biar muat di tile sempit (mobile)
  const compactRupiah = (n: number) => {
    if (n >= 1_000_000) return 'Rp ' + (n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1).replace('.', ',') + 'jt';
    if (n >= 1_000) return 'Rp ' + Math.round(n / 1000) + 'rb';
    return 'Rp ' + n;
  };

  return (
    <>
      <PageHeader title="Akun Saya" breadcrumb={breadcrumb} />

      <section className="container-x pb-24 lg:pb-16">
        {/* Welcome banner — desktop */}
        <div className="hidden lg:block mb-6 animate-slide-up">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-ink-800 to-[#2d1f1f] text-white p-7">
            <div className="absolute -top-16 -right-10 size-72 rounded-full bg-brand-500/25 blur-3xl" />
            <div className="absolute -bottom-24 right-40 size-56 rounded-full bg-amber-500/10 blur-3xl" />
            <div className="relative flex items-center justify-between gap-6">
              <div className="min-w-0">
                <h1 className="text-3xl font-extrabold flex items-center gap-2">
                  <Hand className="size-7 text-amber-400" /> Halo, <span className="capitalize">{displayName}</span>
                </h1>
                <p className="text-white/60 mt-1">Selamat datang kembali di Erset Store</p>
                <div className="flex items-center gap-2 mt-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-brand-500/90 px-3 py-1.5 rounded-full">
                    <CheckCircle2 className="size-3.5" /> Member Aktif
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-white/10 px-3 py-1.5 rounded-full">
                    <Calendar className="size-3.5" /> Bergabung sejak {memberSinceLong}
                  </span>
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-5">
                <div className="text-right bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/10">
                  <p className="text-[11px] uppercase tracking-wider text-white/50">Total Belanja</p>
                  <p className="text-2xl font-extrabold text-brand-400">{formatPrice(totalSpent)}</p>
                  <p className="text-[11px] text-white/50 mt-1">
                    {orders.length} Pesanan • {shippedCount} Dikirim • {doneCount} Selesai
                  </p>
                </div>
                <div className="size-24 grid place-items-center bg-gradient-to-br from-brand-500 to-brand-600 rounded-3xl shadow-xl shadow-brand-500/30">
                  <ShoppingBag className="size-12 text-white" strokeWidth={1.4} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[300px_1fr] gap-4 lg:gap-6 items-start">
          {/* Sidebar - Profil */}
          <div className="space-y-4 min-w-0 lg:sticky lg:top-28">
            {/* Profile hero */}
            <div className="card overflow-hidden animate-slide-up">
              <div className="relative bg-gradient-to-br from-gray-900 to-ink-800 p-5 sm:p-6">
                <div className="absolute -top-8 -right-8 size-32 rounded-full bg-brand-500/20 blur-2xl" />
                <div className="relative flex items-center gap-4">
                  <div className="size-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 grid place-items-center shadow-lg shadow-brand-500/30 shrink-0">
                    <span className="text-2xl font-extrabold text-white">
                      {(user?.email?.[0] || 'U').toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-white text-lg truncate capitalize">
                      {user?.email?.split('@')[0] || 'User'}
                    </h3>
                    <p className="text-sm text-white/60 truncate">{user?.email}</p>
                  </div>
                </div>
              </div>
              {/* Stat tiles */}
              <div className="grid grid-cols-3 divide-x divide-gray-100">
                <StatTile icon={ShoppingBag} value={String(orders.length)} label="Pesanan" />
                <StatTile icon={Wallet} value={compactRupiah(totalSpent)} label="Belanja" />
                <StatTile icon={Calendar} value={memberSince} label="Member" />
              </div>
            </div>

            {/* Nav vertikal — desktop */}
            <nav className="hidden lg:flex flex-col card p-2 animate-slide-up" style={{ animationDelay: '40ms', animationFillMode: 'backwards' }}>
              <a href="#riwayat" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold bg-brand-50 text-brand-600">
                <ShoppingBag className="size-5" /> Riwayat Pesanan
                <ChevronRight className="size-4 ml-auto" />
              </a>
              <Link to="/wishlist" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                <Heart className="size-5" /> Wishlist
                <ChevronRight className="size-4 ml-auto opacity-40" />
              </Link>
              <a href="#alamat" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                <MapPin className="size-5" /> Alamat Tersimpan
                <ChevronRight className="size-4 ml-auto opacity-40" />
              </a>
              <Link to="/lacak" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                <Truck className="size-5" /> Lacak Pesanan
                <ChevronRight className="size-4 ml-auto opacity-40" />
              </Link>
              <button onClick={signOut} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                <LogOut className="size-5" /> Keluar
              </button>
            </nav>

            {/* Kartu bantuan — desktop */}
            <div className="hidden lg:block card p-5 text-center animate-slide-up" style={{ animationDelay: '80ms', animationFillMode: 'backwards' }}>
              <div className="size-11 mx-auto rounded-2xl bg-brand-50 grid place-items-center mb-2">
                <HelpCircle className="size-6 text-brand-500" />
              </div>
              <p className="text-sm font-bold text-gray-900">Butuh bantuan?</p>
              <p className="text-xs text-gray-500 mb-3">Tim kami siap membantu</p>
              <Link to="/bantuan" className="btn btn-outline btn-sm w-full">Hubungi Kami</Link>
            </div>

            {/* Alamat Tersimpan */}
            <div id="alamat" className="card p-5 sm:p-6 animate-slide-up" style={{ animationDelay: '60ms', animationFillMode: 'backwards' }}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="size-4 text-brand-500" />
                  Alamat Tersimpan
                </h4>
                {savedAddr && !editingAddress && (
                  <button
                    onClick={() => { setEditingAddress(true); setAddress(savedAddr); }}
                    className="size-8 rounded-lg grid place-items-center text-brand-500 hover:bg-brand-50 transition"
                    aria-label="Edit alamat"
                  >
                    <Pencil className="size-4" />
                  </button>
                )}
              </div>

              {editingAddress || !savedAddr ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">Nama Penerima</label>
                    <input
                      type="text"
                      value={address.name}
                      onChange={e => setAddress({ ...address, name: e.target.value })}
                      placeholder="Nama lengkap"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">No. Telepon</label>
                    <input
                      type="tel"
                      value={address.phone}
                      onChange={e => setAddress({ ...address, phone: e.target.value })}
                      placeholder="08xxxxxxxxxx"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">Alamat Lengkap</label>
                    <textarea
                      value={address.address}
                      onChange={e => setAddress({ ...address, address: e.target.value })}
                      rows={3}
                      placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota, Kode Pos"
                      className="input resize-y"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveAddress}
                      disabled={savingAddr}
                      className="btn btn-primary btn-sm flex-1 disabled:opacity-50"
                    >
                      {savingAddr ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                      Simpan
                    </button>
                    {savedAddr && (
                      <button
                        onClick={() => setEditingAddress(false)}
                        className="btn btn-outline btn-sm"
                      >
                        <X className="size-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-semibold text-gray-900">{savedAddr.name}</p>
                  <p>{savedAddr.phone}</p>
                  <p className="text-gray-500">{savedAddr.address}</p>
                  <p className="text-[11px] text-brand-500 mt-2">✓ Akan otomatis terisi saat checkout</p>
                </div>
              )}
            </div>
          </div>

          {/* Main - Riwayat Pesanan */}
          <div id="riwayat" className="min-w-0">
            {/* Stat cards — desktop */}
            <div className="hidden lg:grid grid-cols-4 gap-4 mb-5">
              <StatCard icon={ShoppingBag} tone="brand" value={String(orders.length)} label="Total Pesanan" />
              <StatCard icon={Truck} tone="amber" value={String(processingCount)} label="Dalam Proses" />
              <StatCard icon={CheckCircle2} tone="emerald" value={String(doneCount)} label="Selesai" />
              <StatCard icon={Wallet} tone="violet" value={compactRupiah(totalSpent)} label="Total Belanja" />
            </div>

            <div className="flex items-center justify-between gap-2 mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ShoppingBag className="size-5 text-brand-500" />
                Riwayat Pesanan
                {orders.length > 0 && (
                  <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">{orders.length}</span>
                )}
              </h2>
              {orders.length > 0 && (
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white outline-none focus:border-brand-500 cursor-pointer"
                >
                  <option value="all">Semua Status</option>
                  <option value="pending">Menunggu Pembayaran</option>
                  <option value="processing">Diproses</option>
                  <option value="shipped">Dikirim</option>
                  <option value="done">Selesai</option>
                </select>
              )}
            </div>

            {loading ? (
              <div className="card p-12 text-center">
                <Loader2 className="size-8 animate-spin text-brand-500 mx-auto" />
                <p className="text-sm text-gray-500 mt-3">Memuat pesanan...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="card p-12 text-center">
                <Package className="size-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Belum Ada Pesanan</h3>
                <p className="text-gray-500 mb-6">Kamu belum pernah melakukan pembelian</p>
                <Link to="/produk" className="btn btn-primary btn-md">
                  Mulai Belanja
                </Link>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {orders.map((order, idx) => {
                  const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.pending;
                  const StatusIcon = statusInfo.icon;

                  return (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedOrder(order); } }}
                      className="card p-4 sm:p-5 animate-slide-up hover:shadow-md hover:border-brand-200 cursor-pointer transition-all active:scale-[.99] group"
                      style={{ animationDelay: `${Math.min(idx * 60, 300)}ms`, animationFillMode: 'backwards' }}
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-full ${statusInfo.color}`}>
                            <StatusIcon className="size-3" />
                            {statusInfo.label}
                          </span>
                          <span className="hidden sm:inline text-[11px] font-mono text-gray-400 truncate">
                            #{order.order_number || order.id.slice(0, 8)}
                          </span>
                        </div>
                        <span className="text-base sm:text-lg font-extrabold text-brand-500 shrink-0">
                          {formatPrice(order.total)}
                        </span>
                      </div>

                      {/* Items dengan thumbnail */}
                      <div className="space-y-2.5 mb-4">
                        {order.items.map((item, i) => {
                          const p = findProduct(item.product_id);
                          return (
                            <div key={i} className="flex items-center gap-3">
                              <div className="size-10 rounded-xl bg-gray-50 grid place-items-center text-lg shrink-0">
                                {p?.emoji || '📦'}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 truncate">{item.product_name}</p>
                                <p className="text-[11px] text-gray-500">{item.qty} × {formatPrice(item.price)}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Footer */}
                      <div className="border-t border-gray-100 pt-3 flex items-center justify-between gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 min-w-0">
                          <Clock className="size-3 shrink-0" />
                          <span className="truncate">{formatDate(order.created_at)}</span>
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          {order.status === 'pending' && (
                            <Link
                              to={`/sukses?order=${order.order_number || order.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 text-xs font-bold text-white px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 transition-colors"
                            >
                              <CreditCard className="size-3.5" /> Bayar Sekarang
                            </Link>
                          )}
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 px-2.5 py-1.5 rounded-lg bg-brand-50 group-hover:bg-brand-100 transition-colors">
                            Detail <ChevronRight className="size-3.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Tombol Keluar — mobile, di paling bawah */}
        <button
          onClick={signOut}
          className="flex lg:hidden btn btn-outline btn-md w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 mt-6"
        >
          <LogOut className="size-4" />
          Keluar dari Akun
        </button>
      </section>

      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} formatDate={formatDate} />
      )}
    </>
  );
}

function StatTile({
  icon: Icon, value, label,
}: {
  icon: React.ComponentType<{ className?: string }>; value: string; label: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 py-3.5 px-0.5 text-center min-w-0">
      <Icon className="size-4 text-brand-500 shrink-0" />
      <span className="font-extrabold text-gray-900 leading-tight text-[13px] sm:text-base truncate max-w-full w-full">{value}</span>
      <span className="text-[9px] sm:text-[10px] uppercase tracking-tight text-gray-400 leading-none whitespace-nowrap">{label}</span>
    </div>
  );
}

function OrderDetailModal({
  order, onClose, formatDate,
}: {
  order: Order; onClose: () => void; formatDate: (s: string) => string;
}) {
  const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.pending;
  const StatusIcon = statusInfo.icon;

  const computedSubtotal = order.subtotal ?? order.items.reduce((s, it) => s + it.price * it.qty, 0);
  const shippingCost = order.shipping_cost ?? Math.max(0, order.total - computedSubtotal);

  // Kunci scroll body saat modal terbuka
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={onClose} />
      <div className="relative w-full sm:max-w-xl bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] sm:max-h-[88vh] flex flex-col animate-slide-up overflow-hidden">
        {/* Handle (mobile) */}
        <div className="sm:hidden pt-2.5 pb-1 grid place-items-center">
          <span className="h-1.5 w-10 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900">Detail Pesanan</h3>
            <p className="text-xs text-gray-400 font-mono truncate">#{order.order_number || order.id.slice(0, 8)}</p>
          </div>
          <button onClick={onClose} className="size-9 rounded-full grid place-items-center hover:bg-gray-100 shrink-0" aria-label="Tutup">
            <X className="size-5 text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-5 py-4 space-y-5 scrollbar-thin">
          {/* Status */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${statusInfo.color}`}>
              <StatusIcon className="size-3" />
              {statusInfo.label}
            </span>
            <span className="text-xs text-gray-400">{formatDate(order.created_at)}</span>
          </div>

          {/* Alamat */}
          <DetailBlock icon={MapPin} title="Alamat Pengiriman">
            <p className="font-semibold text-gray-900">{order.shipping_name}</p>
            <p className="flex items-center gap-1.5 text-gray-500 mt-0.5">
              <Phone className="size-3.5 shrink-0" /> {order.shipping_phone || '-'}
            </p>
            <p className="text-gray-600 mt-1 leading-relaxed">{order.shipping_address || '-'}</p>
          </DetailBlock>

          {/* Produk */}
          <DetailBlock icon={Package} title={`Produk (${order.items.length})`}>
            <div className="space-y-3">
              {order.items.map((item, i) => {
                const p = findProduct(item.product_id);
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="size-11 rounded-xl bg-gray-50 grid place-items-center text-xl shrink-0">
                      {p?.emoji || '📦'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 line-clamp-2">{item.product_name}</p>
                      <p className="text-[11px] text-gray-500">{item.qty} × {formatPrice(item.price)}</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 whitespace-nowrap shrink-0">
                      {formatPrice(item.price * item.qty)}
                    </span>
                  </div>
                );
              })}
            </div>
          </DetailBlock>

          {/* Pengiriman & Pembayaran */}
          <div className="grid grid-cols-1 gap-3">
            {order.shipping_method && (
              <DetailBlock icon={Truck} title="Metode Pengiriman">
                <p className="text-gray-700">{order.shipping_method}</p>
              </DetailBlock>
            )}
            {order.payment_method && (
              <DetailBlock icon={CreditCard} title="Metode Pembayaran">
                <p className="text-gray-700">{order.payment_method}</p>
              </DetailBlock>
            )}
          </div>

          {/* Rincian biaya */}
          <DetailBlock icon={Receipt} title="Rincian Pembayaran">
            <div className="space-y-1.5">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">{formatPrice(computedSubtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Ongkos Kirim</span>
                <span className="font-medium text-gray-900">{formatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between items-baseline border-t border-dashed border-gray-200 pt-2 mt-1">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-lg font-extrabold text-brand-500">{formatPrice(order.total)}</span>
              </div>
            </div>
          </DetailBlock>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:pb-3 flex gap-2">
          {order.status === 'pending' ? (
            <>
              <Link
                to={`/sukses?order=${order.order_number || order.id}`}
                className="btn btn-primary btn-md flex-1"
              >
                <CreditCard className="size-4" /> Bayar Sekarang
              </Link>
              <button onClick={onClose} className="btn btn-outline btn-md">Tutup</button>
            </>
          ) : (
            <button onClick={onClose} className="btn btn-primary btn-md w-full">Tutup</button>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailBlock({
  icon: Icon, title, children,
}: {
  icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50/70 rounded-2xl p-4">
      <h4 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
        <Icon className="size-3.5 text-brand-500" /> {title}
      </h4>
      <div className="text-sm">{children}</div>
    </div>
  );
}
