import { useEffect, useState } from 'react';
import {
  Search, Filter, ChevronDown, Eye, RefreshCw, Loader2, X,
  Clock, CheckCircle2, Truck, Package, XCircle,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatPrice } from '../lib/format';
import { StatusBadge } from './AdminDashboard';

interface Order {
  id: string;
  order_number: string;
  user_id: string;
  items: { product_id: number; product_name: string; qty: number; price: number }[];
  subtotal: number;
  shipping_cost: number;
  total: number;
  status: string;
  shipping_method: string;
  payment_method: string;
  shipping_name: string;
  shipping_address: string;
  shipping_phone: string;
  created_at: string;
}

const STATUSES = [
  { id: 'all', label: 'Semua' },
  { id: 'pending', label: 'Menunggu Bayar' },
  { id: 'processing', label: 'Diproses' },
  { id: 'shipped', label: 'Dikirim' },
  { id: 'done', label: 'Selesai' },
  { id: 'cancelled', label: 'Dibatalkan' },
];

const STATUS_FLOW = ['pending', 'processing', 'shipped', 'done'];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setLoading(true);
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    setOrders(data || []);
    setLoading(false);
  }

  async function updateStatus(orderId: string, newStatus: string) {
    setUpdating(orderId);
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    if (error) {
      alert('Gagal update status: ' + error.message + '\n\nPastikan kamu sudah jalankan supabase/admin_policies.sql di Supabase SQL Editor.');
      setUpdating(null);
      return;
    }
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    setUpdating(null);
  }

  const filtered = orders.filter((o) => {
    if (filter !== 'all' && o.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        (o.order_number || '').toLowerCase().includes(q) ||
        o.shipping_name.toLowerCase().includes(q) ||
        o.shipping_phone.includes(q)
      );
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="size-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Pesanan</h1>
          <p className="text-sm text-gray-500 mt-0.5">{orders.length} total pesanan</p>
        </div>
        <button onClick={loadOrders} className="btn btn-outline btn-sm self-start">
          <RefreshCw className="size-4" /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, order ID, HP..."
            className="input pl-10 !py-2.5"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map((s) => (
            <button
              key={s.id}
              onClick={() => setFilter(s.id)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                filter === s.id
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-5 py-3 text-left font-semibold">Order</th>
                <th className="px-5 py-3 text-left font-semibold">Customer</th>
                <th className="px-5 py-3 text-left font-semibold">Items</th>
                <th className="px-5 py-3 text-left font-semibold">Total</th>
                <th className="px-5 py-3 text-left font-semibold">Status</th>
                <th className="px-5 py-3 text-left font-semibold">Tanggal</th>
                <th className="px-5 py-3 text-center font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs font-semibold text-gray-900">
                    {order.order_number || order.id.slice(0, 8)}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="text-gray-900 font-medium">{order.shipping_name}</div>
                    <div className="text-xs text-gray-400">{order.shipping_phone}</div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600">
                    {order.items?.length || 0} item
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-gray-900">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs whitespace-nowrap">
                    {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="size-8 rounded-lg bg-gray-100 hover:bg-gray-200 grid place-items-center transition-colors"
                        title="Detail"
                      >
                        <Eye className="size-4 text-gray-600" />
                      </button>
                      {order.status !== 'done' && order.status !== 'cancelled' && (
                        <button
                          onClick={() => {
                            const nextIdx = STATUS_FLOW.indexOf(order.status) + 1;
                            if (nextIdx < STATUS_FLOW.length) {
                              updateStatus(order.id, STATUS_FLOW[nextIdx]);
                            }
                          }}
                          disabled={updating === order.id}
                          className="size-8 rounded-lg bg-brand-50 hover:bg-brand-100 grid place-items-center transition-colors disabled:opacity-50"
                          title="Next Status"
                        >
                          {updating === order.id ? (
                            <Loader2 className="size-3.5 animate-spin text-brand-500" />
                          ) : (
                            <ChevronDown className="size-4 text-brand-500 -rotate-90" />
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-400">
                    Tidak ada pesanan ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={updateStatus}
          updating={updating}
        />
      )}
    </div>
  );
}

function OrderDetailModal({
  order, onClose, onUpdateStatus, updating,
}: {
  order: Order;
  onClose: () => void;
  onUpdateStatus: (id: string, status: string) => void;
  updating: string | null;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <div>
            <h2 className="font-bold text-gray-900">Detail Pesanan</h2>
            <p className="text-xs text-gray-500 font-mono">{order.order_number || order.id.slice(0, 8)}</p>
          </div>
          <button onClick={onClose} className="size-9 rounded-lg bg-gray-100 hover:bg-gray-200 grid place-items-center">
            <X className="size-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Status + Actions */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <StatusBadge status={order.status} />
            <div className="flex gap-2">
              {STATUS_FLOW.filter(s => s !== order.status).map((s) => (
                <button
                  key={s}
                  onClick={() => onUpdateStatus(order.id, s)}
                  disabled={updating === order.id}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {s === 'pending' && 'Pending'}
                  {s === 'processing' && 'Proses'}
                  {s === 'shipped' && 'Kirim'}
                  {s === 'done' && 'Selesai'}
                </button>
              ))}
              {order.status !== 'cancelled' && (
                <button
                  onClick={() => onUpdateStatus(order.id, 'cancelled')}
                  disabled={updating === order.id}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  Batalkan
                </button>
              )}
            </div>
          </div>

          {/* Customer Info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <InfoCard title="Informasi Penerima">
              <p className="font-semibold text-gray-900">{order.shipping_name}</p>
              <p className="text-sm text-gray-500">{order.shipping_phone}</p>
              <p className="text-sm text-gray-500 mt-1">{order.shipping_address}</p>
            </InfoCard>
            <InfoCard title="Pengiriman & Pembayaran">
              <p className="text-sm text-gray-700"><strong>Kurir:</strong> {order.shipping_method || '-'}</p>
              <p className="text-sm text-gray-700"><strong>Bayar:</strong> {order.payment_method || '-'}</p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(order.created_at).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
              </p>
            </InfoCard>
          </div>

          {/* Items */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Item Pesanan</h4>
            <div className="space-y-2">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.product_name}</p>
                    <p className="text-xs text-gray-500">{formatPrice(item.price)} × {item.qty}</p>
                  </div>
                  <span className="font-semibold text-sm text-gray-900">{formatPrice(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="bg-gray-900 text-white rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Subtotal</span>
              <span>{formatPrice(order.subtotal || order.total - (order.shipping_cost || 0))}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Ongkir</span>
              <span>{formatPrice(order.shipping_cost || 0)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-gray-700 pt-2 mt-2">
              <span>Total</span>
              <span className="text-brand-500">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{title}</h4>
      {children}
    </div>
  );
}
