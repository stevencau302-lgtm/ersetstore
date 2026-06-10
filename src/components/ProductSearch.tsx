import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, X, TrendingUp } from 'lucide-react';
import { useProducts } from '../lib/useProducts';
import { formatPrice } from '../lib/format';

interface ProductSearchProps {
  /** Dipanggil setelah navigasi (mis. untuk menutup menu mobile) */
  onNavigate?: () => void;
  autoFocus?: boolean;
  placeholder?: string;
  className?: string;
}

export default function ProductSearch({ onNavigate, autoFocus, placeholder, className = '' }: ProductSearchProps) {
  const { products } = useProducts();
  const navigate = useNavigate();
  const wrapRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const q = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!q) return [];
    return products
      .filter((p) => `${p.name} ${p.category}`.toLowerCase().includes(q))
      .slice(0, 6);
  }, [q, products]);

  // total item navigasi = hasil produk + 1 (lihat semua)
  const hasSeeAll = q.length > 0;
  const totalItems = results.length + (hasSeeAll ? 1 : 0);

  // Tutup saat klik di luar
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const goToProduct = useCallback((id: number) => {
    setOpen(false);
    setQuery('');
    onNavigate?.();
    navigate(`/produk/${id}`);
  }, [navigate, onNavigate]);

  const goToAll = useCallback(() => {
    if (!q) return;
    setOpen(false);
    onNavigate?.();
    navigate(`/produk?cari=${encodeURIComponent(query.trim())}`);
    setQuery('');
  }, [q, query, navigate, onNavigate]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') { setOpen(false); return; }
    if (!open || totalItems === 0) {
      if (e.key === 'Enter') goToAll();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((p) => (p < totalItems - 1 ? p + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((p) => (p > 0 ? p - 1 : totalItems - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (active < 0) { goToAll(); return; }
      if (active < results.length) goToProduct(results[active].id);
      else goToAll();
    }
  };

  const showDropdown = open && q.length > 0;

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
      <input
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); setActive(-1); }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        autoFocus={autoFocus}
        autoComplete="off"
        placeholder={placeholder || 'Cari produk import berkualitas...'}
        className="input pl-10 pr-9 bg-gray-50 focus:bg-white"
        role="combobox"
        aria-expanded={showDropdown}
        aria-autocomplete="list"
      />
      {query && (
        <button
          type="button"
          onClick={() => { setQuery(''); setActive(-1); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 size-5 grid place-items-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
          aria-label="Hapus"
        >
          <X className="size-3.5" />
        </button>
      )}

      {showDropdown && (
        <div className="absolute z-50 mt-2 left-0 right-0 bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden animate-slide-up">
          {results.length > 0 ? (
            <ul role="listbox" className="py-1.5 max-h-[60vh] overflow-y-auto scrollbar-thin">
              {results.map((p, i) => (
                <li key={p.id} role="option" aria-selected={active === i}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => goToProduct(p.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                      active === i ? 'bg-brand-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="size-11 rounded-xl bg-gray-50 grid place-items-center text-2xl shrink-0">{p.emoji}</span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-medium text-gray-900 truncate">{p.name}</span>
                      <span className="block text-[11px] text-gray-400 capitalize">{p.category}</span>
                    </span>
                    <span className="text-sm font-extrabold text-brand-500 whitespace-nowrap shrink-0">{formatPrice(p.price)}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-6 text-center text-sm text-gray-400">
              <TrendingUp className="size-5 mx-auto mb-2 text-gray-300" />
              Tidak ada produk untuk “{query.trim()}”
            </div>
          )}

          <button
            type="button"
            onMouseEnter={() => setActive(results.length)}
            onClick={goToAll}
            className={`w-full flex items-center justify-between gap-2 px-4 py-3 border-t border-gray-100 text-sm font-semibold transition-colors ${
              active === results.length ? 'bg-brand-50 text-brand-600' : 'text-brand-500 hover:bg-gray-50'
            }`}
          >
            <span>Lihat semua hasil untuk “{query.trim()}”</span>
            <ArrowRight className="size-4 shrink-0" />
          </button>
        </div>
      )}
    </div>
  );
}
