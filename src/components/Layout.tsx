import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Toaster from './Toaster';
import CartDrawer from './CartDrawer';

export default function Layout() {
  const { pathname } = useLocation();
  // Footer di mobile hanya tampil di Beranda. Halaman lain (checkout, keranjang,
  // detail produk, shop, dll) disembunyikan di mobile agar fokus konversi.
  const showFooterOnMobile = pathname === '/';

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden max-w-[100vw]">
      <Header />
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
      {showFooterOnMobile ? (
        <Footer />
      ) : (
        <div className="hidden lg:block">
          <Footer />
        </div>
      )}
      <Toaster />
      <CartDrawer />
    </div>
  );
}
