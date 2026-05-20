import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User, Package, ShoppingBag, LogOut, Clock, CheckCircle2, Truck, Loader2,
  MapPin, Save, Pencil, X,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { formatPrice } from '../lib/format';

interface Order {
  id: string;
  items: { product_id: number; product_name: string; qty: number; price: number }[];
  total: number;
  status: string;
  shipping_name: string;
  shipping_address: string;
  shipping_phone: string;
  created_at: string;
}

interface SavedAddress {
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

const ADDRESS_KEY = 'erset_saved_address';

function getSavedAddress(): SavedAddress | null {
  try {
    const raw = localStorage.getItem(ADDRESS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveAddress(addr: SavedAddress) {
  localStorage.setItem(ADDRESS_KEY, JSON.stringify(addr));
}

export { getSavedAddress };

export default function Akun() {
  const { user, signOut } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAddress, setEditingAddress] = useState(false);
  const [address, setAddress] = useState<SavedAddress>({ name: '', phone: '', address: '' });
  const [savedAddr, setSavedAddr] = useState<SavedAddress | null>(null);

  const breadcrumb = [
    { label: 'Beranda', to: '/' },
    { label: 'Akun Saya' },
  ];

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) {
        setOrders(data);
        // Auto-save alamat dari order terakhir kalau belum ada
        const existing = getSavedAddress();
        if (!existing && data.length > 0) {
          const lastOrder = data[0];
          const autoAddr = {
            name: lastOrder.shipping_name,
            phone: lastOrder.shipping_phone,
            address: lastOrder.shipping_address,
          };
          saveAddress(autoAddr);
          setSavedAddr(autoAddr);
        } else {
          setSavedAddr(existing);
        }
      }
      setLoading(false);
    }
    fetchOrders();
  }, [user]);

  useEffect(() => {
    const existing = getSavedAddress();
    if (existing) {
      setSavedAddr(existing);
      setAddress(existing);
    }
  }, []);

  const handleSaveAddress = () => {
    if (!address.name || !address.phone || !address.address) return;
    saveAddress(address);
    setSavedAddr(address);
    setEditingAddress(false);
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

  return (
    <>
      <PageHeader title="Akun Saya" breadcrumb={breadcrumb} />

      <section className="container-x pb-16">
        <div className="grid lg:grid-cols-[300px_1fr] gap-6">
          {/* Sidebar - Profil */}
          <div className="space-y-4">
            <div className="card p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="size-14 bg-brand-50 rounded-full grid place-items-center">
                  <User className="size-6 text-brand-500" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">
                    {user?.email?.split('@')[0] || 'User'}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Member sejak</span>
                  <span className="font-medium text-gray-900">
                    {user?.created_at
                      ? new Date(user.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
                      : '-'}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Total Pesanan</span>
                  <span className="font-medium text-gray-900">{orders.length}</span>
                </div>
              </div>
            </div>

            {/* Alamat Tersimpan */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="size-4 text-brand-500" />
                  Alamat Tersimpan
                </h4>
                {savedAddr && !editingAddress && (
                  <button
                    onClick={() => { setEditingAddress(true); setAddress(savedAddr); }}
                    className="text-brand-500 hover:text-brand-600 transition"
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
                      className="btn btn-primary btn-sm flex-1"
                    >
                      <Save className="size-3.5" />
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

            <button
              onClick={signOut}
              className="btn btn-outline btn-md w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              <LogOut className="size-4" />
              Keluar dari Akun
            </button>
          </div>

          {/* Main - Riwayat Pesanan */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingBag className="size-5 text-brand-500" />
              Riwayat Pesanan
            </h2>

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
              <div className="space-y-4">
                {orders.map((order) => {
                  const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.pending;
                  const StatusIcon = statusInfo.icon;

                  return (
                    <div key={order.id} className="card p-5">
                      {/* Header */}
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${statusInfo.color}`}>
                            <StatusIcon className="size-3" />
                            {statusInfo.label}
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatDate(order.created_at)}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-brand-500">
                          {formatPrice(order.total)}
                        </span>
                      </div>

                      {/* Items */}
                      <div className="space-y-2 mb-4">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700 truncate max-w-[70%]">
                              {item.product_name}
                            </span>
                            <span className="text-gray-500 shrink-0 ml-2">
                              {item.qty}× {formatPrice(item.price)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-xs text-gray-500">
                        <span>Penerima: {order.shipping_name}</span>
                        <span className="font-mono text-gray-400">{order.id.slice(0, 8)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
