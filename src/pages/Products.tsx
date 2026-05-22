import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, RotateCcw, SearchX } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import ProductCard from '../components/ProductCard';
import { CATEGORIES } from '../data/categories';
import { useProducts } from '../lib/useProducts';
import { getCategoryCount } from '../data/products';

const PRICE_RANGES: { id: string; label: string; min: number; max: number }[] = [
  { id: 'all', label: 'Semua Harga', min: 0, max: Infinity },
  { id: '0-100k', label: 'Di bawah Rp 100rb', min: 0, max: 100000 },
  { id: '100-300k', label: 'Rp 100rb - 300rb', min: 100000, max: 300000 },
  { id: '300-500k', label: 'Rp 300rb - 500rb', min: 300000, max: 500000 },
  { id: '500k-1jt', label: 'Rp 500rb - 1jt', min: 500000, max: 1000000 },
  { id: '1jt+', label: 'Di atas Rp 1jt', min: 1000000, max: Infinity },
];

const SORT_OPTIONS = [
  { id: 'default', label: 'Paling Sesuai' },
  { id: 'newest', label: 'Terbaru' },
  { id: 'popular', label: 'Terlaris' },
  { id: 'price-asc', label: 'Harga Terendah' },
  { id: 'price-desc', label: 'Harga Tertinggi' },
  { id: 'rating', label: 'Rating Tertinggi' },
];

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { products: PRODUCTS } = useProducts();

  const category = params.get('kategori') || 'all';
  const priceRange = params.get('harga') || 'all';
  const minRating = params.get('rating') || 'all';
  const promo = params.get('promo'); // 'sale' | 'new'
  const search = params.get('cari') || '';
  const sort = params.get('urut') || 'default';

  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (!value || value === 'all' || value === 'default') next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.category.includes(q));
    }
    if (category !== 'all') list = list.filter((p) => p.category === category);
    if (priceRange !== 'all') {
      const r = PRICE_RANGES.find((x) => x.id === priceRange);
      if (r) list = list.filter((p) => p.price >= r.min && p.price <= r.max);
    }
    if (minRating !== 'all') {
      const min = parseFloat(minRating);
      list = list.filter((p) => p.rating >= min);
    }
    if (promo === 'sale') list = list.filter((p) => p.badge === 'sale');
    if (promo === 'new') list = list.filter((p) => p.badge === 'new');

    switch (sort) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'rating': list.sort((a, b) => b.rating - a.rating); break;
      case 'popular': list.sort((a, b) => b.sold - a.sold); break;
      case 'newest': list.sort((a, b) => b.id - a.id); break;
    }
    return list;
  }, [category, priceRange, minRating, promo, search, sort]);

  const reset = () => setParams(new URLSearchParams(), { replace: true });
  const cat = CATEGORIES.find((c) => c.id === category);
  const title = search
    ? `Hasil pencarian: "${search}"`
    : cat
    ? `${cat.emoji} ${cat.name}`
    : 'Semua Produk';

  return (
    <>
      <PageHeader
        title={title}
        breadcrumb={[
          { label: 'Beranda', to: '/' },
          { label: search ? 'Pencarian' : cat?.name || 'Semua Produk' },
        ]}
      />

      <section className="container-x pb-16">
        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar Filter */}
          <aside
            className={`${
              sidebarOpen ? 'fixed inset-0 z-50 bg-black/50 lg:static lg:bg-transparent' : 'hidden'
            } lg:block`}
            onClick={() => setSidebarOpen(false)}
          >
            <div
              className="card p-6 h-fit lg:sticky lg:top-32 max-h-screen lg:max-h-[calc(100vh-9rem)] overflow-y-auto scrollbar-thin bg-white absolute lg:relative right-0 top-0 bottom-0 w-80 max-w-[85vw] lg:w-auto lg:max-w-none"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4 lg:hidden">
                <h3 className="font-bold">Filter</h3>
                <button onClick={() => setSidebarOpen(false)} className="size-8 grid place-items-center rounded-lg hover:bg-gray-100">
                  <X className="size-4" />
                </button>
              </div>

              {/* Kategori */}
              <FilterGroup title="Kategori">
                <FilterRadio name="kategori" value="all" checked={category === 'all'} label="Semua Kategori" onChange={() => updateParam('kategori', null)} />
                {CATEGORIES.map((c) => (
                  <FilterRadio
                    key={c.id}
                    name="kategori"
                    value={c.id}
                    checked={category === c.id}
                    label={`${c.emoji} ${c.name}`}
                    count={getCategoryCount(c.id)}
                    onChange={() => updateParam('kategori', c.id)}
                  />
                ))}
              </FilterGroup>

              {/* Harga */}
              <FilterGroup title="Rentang Harga">
                {PRICE_RANGES.map((r) => (
                  <FilterRadio
                    key={r.id}
                    name="harga"
                    value={r.id}
                    checked={priceRange === r.id}
                    label={r.label}
                    onChange={() => updateParam('harga', r.id)}
                  />
                ))}
              </FilterGroup>

              {/* Rating */}
              <FilterGroup title="Rating Minimal">
                <FilterRadio name="rating" value="all" checked={minRating === 'all'} label="Semua Rating" onChange={() => updateParam('rating', null)} />
                <FilterRadio name="rating" value="4.5" checked={minRating === '4.5'} label="⭐ 4.5 ke atas" onChange={() => updateParam('rating', '4.5')} />
                <FilterRadio name="rating" value="4.0" checked={minRating === '4.0'} label="⭐ 4.0 ke atas" onChange={() => updateParam('rating', '4.0')} />
              </FilterGroup>

              {/* Promo */}
              <FilterGroup title="Promo">
                <FilterRadio name="promo" value="all" checked={!promo} label="Semua" onChange={() => updateParam('promo', null)} />
                <FilterRadio name="promo" value="sale" checked={promo === 'sale'} label="Sedang Diskon" onChange={() => updateParam('promo', 'sale')} />
                <FilterRadio name="promo" value="new" checked={promo === 'new'} label="Produk Baru" onChange={() => updateParam('promo', 'new')} />
              </FilterGroup>

              <button onClick={reset} className="btn btn-outline btn-sm w-full">
                <RotateCcw className="size-3.5" />
                Reset Filter
              </button>
            </div>
          </aside>

          {/* Main */}
          <div>
            {/* Toolbar */}
            <div className="card flex items-center justify-between flex-wrap gap-3 px-5 py-3 mb-5">
              <div className="text-sm text-gray-600">
                Menampilkan{' '}
                <strong className="text-gray-900">{filtered.length}</strong> produk
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden btn btn-outline btn-sm"
                >
                  <Filter className="size-4" />
                  Filter
                </button>
                <span className="hidden sm:inline text-sm text-gray-500">Urutkan:</span>
                <select
                  value={sort}
                  onChange={(e) => updateParam('urut', e.target.value)}
                  className="input py-2 px-3 text-sm w-auto bg-white"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.id} value={o.id}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
              <div className="card text-center py-20 px-6">
                <SearchX className="size-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Produk Tidak Ditemukan</h3>
                <p className="text-gray-500 mb-6">Coba ubah filter atau kata kunci pencarian kamu</p>
                <button onClick={reset} className="btn btn-primary btn-md">
                  <RotateCcw className="size-4" />
                  Reset Filter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h5 className="text-xs font-bold text-gray-900 tracking-wider uppercase mb-3">{title}</h5>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

function FilterRadio({
  name, value, checked, label, count, onChange,
}: {
  name: string; value: string; checked: boolean; label: string; count?: number; onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-sm text-gray-700">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="size-4 accent-brand-500"
      />
      <span className="flex-1">{label}</span>
      {count !== undefined && (
        <span className="text-xs text-gray-400">({count})</span>
      )}
    </label>
  );
}
