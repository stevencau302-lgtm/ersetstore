import { useEffect, useState } from 'react';
import { Search, Loader2, Users, Mail, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Customer {
  id: string;
  email: string;
  full_name: string | null;
  shipping_name: string | null;
  shipping_phone: string | null;
  shipping_address: string | null;
  created_at: string;
  order_count?: number;
  total_spent?: number;
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    setLoading(true);

    // Fetch profiles
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    // Fetch order stats per user
    const { data: orders } = await supabase
      .from('orders')
      .select('user_id, total');

    // Aggregate order stats
    const orderStats: Record<string, { count: number; spent: number }> = {};
    (orders || []).forEach((o) => {
      if (!o.user_id) return;
      if (!orderStats[o.user_id]) orderStats[o.user_id] = { count: 0, spent: 0 };
      orderStats[o.user_id].count++;
      orderStats[o.user_id].spent += o.total || 0;
    });

    const enriched: Customer[] = (profiles || []).map((p) => ({
      ...p,
      order_count: orderStats[p.id]?.count || 0,
      total_spent: orderStats[p.id]?.spent || 0,
    }));

    setCustomers(enriched);
    setLoading(false);
  }

  const filtered = customers.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (c.email || '').toLowerCase().includes(q) ||
      (c.full_name || '').toLowerCase().includes(q) ||
      (c.shipping_name || '').toLowerCase().includes(q) ||
      (c.shipping_phone || '').includes(q)
    );
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pelanggan</h1>
        <p className="text-sm text-gray-500 mt-0.5">{customers.length} pelanggan terdaftar</p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari email, nama, HP..."
          className="input pl-10 !py-2.5"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-5 py-3 text-left font-semibold">Pelanggan</th>
                <th className="px-5 py-3 text-left font-semibold">Kontak</th>
                <th className="px-5 py-3 text-left font-semibold">Pesanan</th>
                <th className="px-5 py-3 text-left font-semibold">Total Belanja</th>
                <th className="px-5 py-3 text-left font-semibold">Bergabung</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 grid place-items-center text-white text-sm font-bold shrink-0">
                        {(customer.shipping_name || customer.email || '?').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {customer.shipping_name || customer.full_name || 'Belum diisi'}
                        </p>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Mail className="size-3" />
                          {customer.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-600 text-sm">
                    {customer.shipping_phone || '-'}
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-xs font-semibold text-gray-700">
                      {customer.order_count} pesanan
                    </span>
                  </td>
                  <td className="px-5 py-4 font-semibold text-gray-900">
                    {customer.total_spent ? formatRupiah(customer.total_spent) : '-'}
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-500 whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      {new Date(customer.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-gray-400">
                    <Users className="size-12 mx-auto mb-3 opacity-40" />
                    <p>Tidak ada pelanggan ditemukan</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function formatRupiah(n: number): string {
  return 'Rp ' + n.toLocaleString('id-ID');
}
