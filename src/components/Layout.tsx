import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Toaster from './Toaster';

export default function Layout() {
  const { pathname } = useLocation();
  const isCheckout = pathname === '/checkout';

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
      {/* Footer disembunyikan di halaman checkout khusus mobile */}
      {isCheckout ? (
        <div className="hidden lg:block">
          <Footer />
        </div>
      ) : (
        <Footer />
      )}
      <Toaster />
    </div>
  );
}
