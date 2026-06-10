import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import ProductCard from '../components/ProductCard';
import { useWishlist } from '../lib/cart';
import { useProducts } from '../lib/useProducts';
import { findProduct } from '../data/products';
import type { Product } from '../types';

export default function Wishlist() {
  const { ids } = useWishlist();
  const { products } = useProducts();

  const items = ids
    .map((id) => products.find((p) => p.id === id) || findProduct(id))
    .filter((p): p is Product => Boolean(p));

  const breadcrumb = [
    { label: 'Beranda', to: '/' },
    { label: 'Wishlist' },
  ];

  return (
    <>
      <PageHeader title="Wishlist Saya" breadcrumb={breadcrumb} />

      <section className="container-x pb-16">
        {items.length === 0 ? (
          <div className="card text-center py-16 sm:py-20 px-6 animate-fade-in">
            <div className="size-20 mx-auto rounded-full bg-red-50 grid place-items-center mb-4">
              <Heart className="size-9 text-red-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Wishlist Kamu Masih Kosong</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Simpan produk favoritmu dengan menekan ikon hati, biar gampang dicari lagi nanti.
            </p>
            <Link to="/produk" className="btn btn-primary btn-md">
              <ShoppingBag className="size-4" /> Jelajahi Produk
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Heart className="size-5 text-red-500 fill-red-500" />
                Produk Favorit
              </h2>
              <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">{items.length}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
              {items.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
