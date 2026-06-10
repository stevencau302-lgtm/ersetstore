import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Search, Heart, User, ShoppingCart, Menu, X, Truck, LogOut, LogIn,
} from 'lucide-react';
import { useCart } from '../lib/cart';
import { useAuth } from '../contexts/AuthContext';

const NAV_LINKS = [
  { to: '/', label: 'Beranda', exact: true },
  { to: '/produk', label: 'Semua Produk' },
  { to: '/produk?promo=sale', label: 'Flash Sale' },
  { to: '/produk?promo=new', label: 'Produk Baru' },
];

export default function Header() {
  const { count } = useCart();
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) navigate(`/produk?cari=${encodeURIComponent(q)}`);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <>
      {/* Top bar */}
      <div className="bg-gray-900 text-gray-300 text-xs">
        <div className="container-x flex items-center justify-between py-2 gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Truck className="size-3.5 shrink-0" />
            <span className="hidden sm:inline">Gratis ongkir min. belanja Rp 200.000 ke seluruh Indonesia</span>
            <span className="sm:hidden truncate">Gratis ongkir min. Rp 200rb</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 shrink-0">
            <a href="#" className="hover:text-brand-500 transition-colors">Bantuan</a>
            <Link to="/lacak" className="hover:text-brand-500 transition-colors">Lacak Pesanan</Link>
            <a href="#" className="hover:text-brand-500 transition-colors">Hubungi Kami</a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="container-x flex items-center gap-2 sm:gap-4 py-3 sm:py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="relative size-9 sm:size-10 grid place-items-center bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl text-white font-black text-base sm:text-lg shadow-lg shadow-brand-500/30">
              E
            </div>
            <div className="leading-tight hidden sm:block">
              <div className="text-lg font-extrabold text-gray-900 tracking-tight">Erset Store</div>
              <div className="text-[10px] font-semibold text-brand-500 tracking-[2px] uppercase">Produk Lengkap & Unik</div>
            </div>
            <span className="sm:hidden text-base font-extrabold text-gray-900">Erset</span>
          </Link>

          {/* Search */}
          <form onSubmit={onSearch} className="hidden md:block flex-1 max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari produk import berkualitas..."
              className="input pl-11 bg-gray-50 focus:bg-white"
            />
          </form>

          {/* Actions */}
          <div className="flex items-center gap-0.5 sm:gap-1 ml-auto">
            <Link to="/wishlist" aria-label="Wishlist" className="hidden sm:grid size-10 place-items-center rounded-xl text-gray-700 hover:text-brand-500 hover:bg-gray-50 transition-colors">
              <Heart className="size-5" />
            </Link>
            {user ? (
              <Link to="/akun" aria-label="Akun Saya" title="Akun Saya" className="size-9 sm:size-10 grid place-items-center rounded-xl text-gray-700 hover:text-brand-500 hover:bg-gray-50 transition-colors">
                <User className="size-5" />
              </Link>
            ) : (
              <Link to="/masuk" aria-label="Masuk" className="size-9 sm:size-10 grid place-items-center rounded-xl text-gray-700 hover:text-brand-500 hover:bg-gray-50 transition-colors">
                <LogIn className="size-5" />
              </Link>
            )}
            <Link to="/keranjang" aria-label="Keranjang" className="relative size-9 sm:size-10 grid place-items-center rounded-xl text-gray-700 hover:text-brand-500 hover:bg-gray-50 transition-colors">
              <ShoppingCart className="size-5" />
              {count > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[16px] h-[16px] px-0.5 bg-brand-500 text-white text-[9px] font-bold rounded-full grid place-items-center">
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </Link>
            <button
              aria-label="Menu"
              className="lg:hidden size-9 sm:size-10 grid place-items-center rounded-xl text-gray-700 hover:bg-gray-50"
              onClick={() => setMenuOpen((s) => !s)}
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Nav menu - desktop */}
        <nav className="hidden lg:block border-t border-gray-100">
          <div className="container-x flex gap-1 overflow-x-auto py-1">
            {NAV_LINKS.map((link, i) => (
              <NavLink
                key={i}
                to={link.to}
                end={link.exact}
                className={({ isActive }) =>
                  `whitespace-nowrap px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'text-brand-500 bg-brand-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Nav menu - mobile */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white animate-fade-in">
            <form onSubmit={onSearch} className="px-4 py-3 relative md:hidden">
              <Search className="absolute left-7 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari produk..."
                className="input pl-10 bg-gray-50"
              />
            </form>
            <div className="container-x py-2 flex flex-col gap-1 max-h-[60vh] overflow-y-auto">
              {NAV_LINKS.map((link, i) => (
                <Link
                  key={i}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-gray-100 mt-2 pt-2">
                {user ? (
                  <>
                    <Link
                      to="/akun"
                      onClick={() => setMenuOpen(false)}
                      className="px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2"
                    >
                      <User className="size-4" /> Akun Saya
                    </Link>
                    <button
                      onClick={() => { handleSignOut(); setMenuOpen(false); }}
                      className="px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-gray-50 rounded-lg w-full text-left flex items-center gap-2"
                    >
                      <LogOut className="size-4" /> Keluar
                    </button>
                  </>
                ) : (
                  <Link
                    to="/masuk"
                    onClick={() => setMenuOpen(false)}
                    className="px-3 py-2.5 text-sm font-medium text-brand-500 hover:bg-gray-50 rounded-lg flex items-center gap-2"
                  >
                    <LogIn className="size-4" /> Masuk / Daftar
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
