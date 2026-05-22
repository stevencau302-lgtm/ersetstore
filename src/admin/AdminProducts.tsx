import { useEffect, useState } from 'react';
import {
  Plus, Search, Edit3, Trash2, Loader2, X, Save, Package,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatPrice } from '../lib/format';

interface Product {
  id: number;
  name: string;
  category: string;
  emoji: string;
  price: number;
  original_price: number | null;
  rating: number;
  sold: number;
  badge: string | null;
  stock: number;
  description: string;
  created_at: string;
}

const CATEGORIES = ['gadget', 'audio', 'homeware', 'otomotif', 'outdoor', 'tools', 'hobby', 'toys'];
const BADGES = ['', 'sale', 'new', 'hot'];

const emptyProduct: Omit<Product, 'id' | 'created_at'> = {
  name: '',
  category: 'gadget',
  emoji: '📦',
  price: 0,
  original_price: null,
  rating: 5,
  sold: 0,
  badge: null,
  stock: 100,
  description: '',
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editProduct, setEditProduct] = useState<Partial<Product> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data || []);
    setLoading(false);
  }

  async function saveProduct() {
    if (!editProduct) return;
    setSaving(true);

    const payload = {
      name: editProduct.name,
      category: editProduct.category,
      emoji: editProduct.emoji,
      price: editProduct.price,
      original_price: editProduct.original_price || null,
      rating: editProduct.rating || 5,
      sold: editProduct.sold || 0,
      badge: editProduct.badge || null,
      stock: editProduct.stock || 0,
      description: editProduct.description || '',
    };

    if (isNew) {
      const { data } = await supabase.from('products').insert(payload).select().single();
      if (data) setProducts((prev) => [data, ...prev]);
    } else {
      await supabase.from('products').update(payload).eq('id', editProduct.id);
      setProducts((prev) => prev.map((p) => (p.id === editProduct.id ? { ...p, ...payload } as Product : p)));
    }

    setEditProduct(null);
    setSaving(false);
  }

  async function deleteProduct(id: number) {
    if (!confirm('Yakin hapus produk ini?')) return;
    setDeleting(id);
    await supabase.from('products').delete().eq('id', id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleting(null);
  }

  const filtered = products.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
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
          <h1 className="text-2xl font-bold text-gray-900">Kelola Produk</h1>
          <p className="text-sm text-gray-500 mt-0.5">{products.length} produk terdaftar</p>
        </div>
        <button
          onClick={() => { setEditProduct({ ...emptyProduct }); setIsNew(true); }}
          className="btn btn-primary btn-sm self-start"
        >
          <Plus className="size-4" /> Tambah Produk
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari produk..."
          className="input pl-10 !py-2.5"
        />
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
            <div className="h-32 bg-gray-50 grid place-items-center text-5xl relative">
              {product.emoji}
              {product.badge && (
                <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  product.badge === 'sale' ? 'bg-red-500 text-white' :
                  product.badge === 'new' ? 'bg-blue-500 text-white' :
                  'bg-amber-500 text-white'
                }`}>
                  {product.badge}
                </span>
              )}
            </div>
            <div className="p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide">{product.category}</p>
              <h3 className="font-semibold text-gray-900 text-sm mt-1 line-clamp-1">{product.name}</h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="font-bold text-brand-500 text-sm">{formatPrice(product.price)}</span>
                {product.original_price && (
                  <span className="text-xs text-gray-400 line-through">{formatPrice(product.original_price)}</span>
                )}
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500">Stok: {product.stock}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => { setEditProduct(product); setIsNew(false); }}
                    className="size-8 rounded-lg bg-gray-100 hover:bg-blue-50 hover:text-blue-600 grid place-items-center transition-colors"
                  >
                    <Edit3 className="size-3.5" />
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    disabled={deleting === product.id}
                    className="size-8 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-600 grid place-items-center transition-colors disabled:opacity-50"
                  >
                    {deleting === product.id ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-400">
            <Package className="size-12 mx-auto mb-3 opacity-40" />
            <p>Tidak ada produk ditemukan</p>
          </div>
        )}
      </div>

      {/* Edit/Add Modal */}
      {editProduct && (
        <ProductModal
          product={editProduct}
          isNew={isNew}
          saving={saving}
          onSave={saveProduct}
          onChange={setEditProduct}
          onClose={() => setEditProduct(null)}
        />
      )}
    </div>
  );
}

function ProductModal({
  product, isNew, saving, onSave, onChange, onClose,
}: {
  product: Partial<Product>;
  isNew: boolean;
  saving: boolean;
  onSave: () => void;
  onChange: (p: Partial<Product>) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <h2 className="font-bold text-gray-900">{isNew ? 'Tambah Produk' : 'Edit Produk'}</h2>
          <button onClick={onClose} className="size-9 rounded-lg bg-gray-100 hover:bg-gray-200 grid place-items-center">
            <X className="size-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-[80px_1fr] gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">Emoji</label>
              <input
                type="text"
                value={product.emoji || ''}
                onChange={(e) => onChange({ ...product, emoji: e.target.value })}
                className="input text-center text-2xl !p-2"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">Nama Produk *</label>
              <input
                type="text"
                value={product.name || ''}
                onChange={(e) => onChange({ ...product, name: e.target.value })}
                className="input"
                placeholder="Nama produk"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">Kategori</label>
              <select
                value={product.category || 'gadget'}
                onChange={(e) => onChange({ ...product, category: e.target.value })}
                className="input"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">Badge</label>
              <select
                value={product.badge || ''}
                onChange={(e) => onChange({ ...product, badge: e.target.value || null })}
                className="input"
              >
                {BADGES.map((b) => <option key={b} value={b}>{b || '— Tidak ada —'}</option>)}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">Harga *</label>
              <input
                type="number"
                value={product.price || 0}
                onChange={(e) => onChange({ ...product, price: parseInt(e.target.value) || 0 })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">Harga Asli (coret)</label>
              <input
                type="number"
                value={product.original_price || ''}
                onChange={(e) => onChange({ ...product, original_price: parseInt(e.target.value) || null })}
                className="input"
                placeholder="Opsional"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">Stok</label>
              <input
                type="number"
                value={product.stock || 0}
                onChange={(e) => onChange({ ...product, stock: parseInt(e.target.value) || 0 })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">Rating</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={product.rating || 5}
                onChange={(e) => onChange({ ...product, rating: parseFloat(e.target.value) || 0 })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">Terjual</label>
              <input
                type="number"
                value={product.sold || 0}
                onChange={(e) => onChange({ ...product, sold: parseInt(e.target.value) || 0 })}
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">Deskripsi</label>
            <textarea
              rows={3}
              value={product.description || ''}
              onChange={(e) => onChange({ ...product, description: e.target.value })}
              className="input resize-y"
              placeholder="Deskripsi produk..."
            />
          </div>
        </div>

        <div className="p-5 border-t border-gray-100 flex gap-3 sticky bottom-0 bg-white rounded-b-2xl">
          <button onClick={onClose} className="btn btn-outline btn-md flex-1">Batal</button>
          <button onClick={onSave} disabled={saving || !product.name} className="btn btn-primary btn-md flex-1 disabled:opacity-50">
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
}
