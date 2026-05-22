import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Loader2, X } from 'lucide-react';
import { useLocationSearch, type Location } from '../lib/shipping';

interface LocationSearchProps {
  label: string;
  placeholder?: string;
  value: Location | null;
  onChange: (location: Location | null) => void;
}

export default function LocationSearch({ label, placeholder, value, onChange }: LocationSearchProps) {
  const { query, setQuery, results, loading, error } = useLocationSearch(400);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (loc: Location) => {
    onChange(loc);
    setQuery('');
    setOpen(false);
  };

  const handleClear = () => {
    onChange(null);
    setQuery('');
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1.5">
        {label}
      </label>

      {value ? (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border-2 border-emerald-200 rounded-xl w-full overflow-hidden">
          <MapPin className="size-4 text-emerald-600 shrink-0" />
          <div className="flex-1 min-w-0 overflow-hidden">
            <p className="text-sm font-semibold text-gray-900 truncate">{value.label}</p>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="size-7 rounded-lg bg-white border border-gray-200 grid place-items-center hover:bg-red-50 hover:border-red-200 transition-colors shrink-0"
          >
            <X className="size-3.5 text-gray-500" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => { if (results.length > 0) setOpen(true); }}
            placeholder={placeholder || 'Ketik nama kelurahan/kecamatan (min 3 huruf)...'}
            className="input pl-10 !py-3"
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 animate-spin" />
          )}
        </div>
      )}

      {/* Dropdown */}
      {open && !value && query.length >= 3 && (
        <div className="absolute z-50 mt-1.5 w-full bg-white rounded-xl border border-gray-200 shadow-xl max-h-60 overflow-y-auto">
          {loading && results.length === 0 && (
            <div className="px-4 py-6 text-center text-gray-400 text-sm">
              <Loader2 className="size-5 animate-spin mx-auto mb-2" />
              Mencari lokasi...
            </div>
          )}

          {error && (
            <div className="px-4 py-3 text-sm text-red-500">{error}</div>
          )}

          {!loading && !error && results.length === 0 && query.length >= 3 && (
            <div className="px-4 py-6 text-center text-gray-400 text-sm">
              Tidak ditemukan lokasi untuk "{query}"
            </div>
          )}

          {results.map((loc, idx) => (
            <button
              key={`${loc.id}-${idx}`}
              type="button"
              onClick={() => handleSelect(loc)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
            >
              <p className="text-sm font-medium text-gray-900 truncate">{loc.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{loc.type}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
