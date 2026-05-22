import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCart, DollarSign, Users, Package, TrendingUp, ArrowUpRight,
  Clock, CheckCircle2, Truck, AlertCircle, Loader2,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatPrice } from '../lib/format';

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  doneOrders: number;
}

interface RecentOrder {
  id: string;
  order_number: string;
  shipping_name: string;
  total: number;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);

    // Fetch all stats in parallel
    const [ordersRes, customersRes, productsRes, recentRes] = await Promise.all([
      supabase.from('orders').select('total, status'),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('id, order_number, shipping_name, total, status, created_at').order('created_at', { ascending: false }).limit(8),
    ]);

    const orders = ordersRes.data || [];
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const processingOrders = orders.filter(o => o.status === 'processing').length;
    const shippedOrders = orders.filter(o => o.status === 'shipped').length;
    const doneOrders = orders.filter(o => o.status === 'done').length;

    setStats({
      totalOrders: orders.length,
      totalRevenue,
      totalCustomers: customersRes.count || 0,
      totalProducts: productsRes.count || 0,
      pendingOrders,
      processingOrders,
      shippedOrders,
      doneOrders,
    });

    setRecentOrders(recentRes.data || []);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="size-8 animate-spin text-brand-500" />
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    { label: 'Total Pesanan', value: stats.totalOrders.toString(), icon: ShoppingCart, color: 'bg-blue-500', change: '+12%' },
    { label: 'Total Pendapatan', value: formatPrice(stats.totalRevenue), icon: DollarSign, color: 'bg-emerald-500', change: '+8%' },
    { label: 'Pelanggan', value: stats.totalCustomers.toString(), icon: Users, color: 'bg-purple-500', change: '+5%' },
    { label: 'Produk Aktif', value: stats.totalProducts.toString(), icon: Package, color: 'bg-amber-500', change: '' },
  ];

  const statusCards = [
    { label: 'Menunggu Bayar', count: stats.pendingOrders, icon: Clock, color: 'text-amber-500 bg-amber-50' },
    { label: 'Diproses', count: stats.processingOrders, icon: AlertCircle, color: 'text-blue-500 bg-blue-50' },
    { label: 'Dikirim', count: stats.shippedOrders, icon: Truck, color: 'text-purple-500 bg-purple-50' },
    { label: 'Selesai', count: stats.doneOrders, icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Selamat datang di panel admin ERSET GEAR LAB</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className={`size-11 rounded-xl ${card.color} grid place-items-center`}>
                <card.icon className="size-5 text-white" />
              </div>
              {card.change && (
                <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <TrendingUp className="size-3" />
                  {card.change}
                </span>
              )}
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-500 mt-1">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Order Status Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statusCards.map((sc) => (
          <div key={sc.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
            <div className={`size-10 rounded-lg grid place-items-center ${sc.color}`}>
              <sc.icon className="size-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{sc.count}</p>
              <p className="text-[11px] text-gray-500">{sc.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Pesanan Terbaru</h2>
          <Link to="/admin/orders" className="text-sm text-brand-500 font-semibold hover:underline flex items-center gap-1">
            Lihat Semua <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-5 py-3 text-left font-semibold">Order ID</th>
                <th className="px-5 py-3 text-left font-semibold">Customer</th>
                <th className="px-5 py-3 text-left font-semibold">Total</th>
                <th className="px-5 py-3 text-left font-semibold">Status</th>
                <th className="px-5 py-3 text-left font-semibold">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs font-semibold text-gray-900">
                    {order.order_number || order.id.slice(0, 8)}
                  </td>
                  <td className="px-5 py-3.5 text-gray-700">{order.shipping_name}</td>
                  <td className="px-5 py-3.5 font-semibold text-gray-900">{formatPrice(order.total)}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs">
                    {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-gray-400">Belum ada pesanan</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    pending: { label: 'Menunggu Bayar', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
    processing: { label: 'Diproses', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
    shipped: { label: 'Dikirim', cls: 'bg-purple-50 text-purple-700 border-purple-200' },
    done: { label: 'Selesai', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    cancelled: { label: 'Dibatalkan', cls: 'bg-red-50 text-red-700 border-red-200' },
  };
  const s = map[status] || { label: status, cls: 'bg-gray-50 text-gray-700 border-gray-200' };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${s.cls}`}>
      {s.label}
    </span>
  );
}
