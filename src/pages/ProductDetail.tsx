import { type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Star, Heart, ShoppingCart, Zap, Plus, Minus, CheckCircle2, Truck, ShieldCheck,
  RotateCcw, Frown, Package,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import ProductCard from '../components/ProductCard';
import CountdownTimer, { getEndOfDay } from '../components/CountdownTimer';
import { findProduct } from '../data/products';
import { useProducts } from '../lib/useProducts';
import { formatPrice, calcDiscount } from '../lib/format';
import { cartActions, useWishlist, wishlistActions } from '../lib/cart';
import { toast } from '../lib/toast';
import SectionHead from '../components/SectionHead';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products: allProducts } = useProducts();
  const product = allProducts.find(p => p.id === Number(id)) || findProduct(Number(id));

  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const { ids } = useWishlist();

  if (!product) {
    return (
      <>
        <PageHeader title="Produk Tidak Ditemukan" breadcrumb={[{ label: 'Beranda', to: '/' }, { label: 'Produk', to: '/produk' }, { label: '404' }]} />
        <div className="container-x pb-20">
          <div className="card text-center py-20 px-6">
            <Frown className="size-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Produk yang kamu cari tidak tersedia</h3>
            <p className="text-gray-500 mb-6">Mungkin produk sudah dihapus atau link salah.</p>
            <Link to="/produk" className="btn btn-primary btn-md">Kembali ke Daftar Produk</Link>
          </div>
        </div>
      </>
    );
  }

  const inWishlist = ids.includes(product.id);
  const discount = calcDiscount(product.price, product.original);
  const thumbs = [product.emoji, '📦', '🎁', '✨'];

  const related = allProducts.filter((x) => x.category === product.category && x.id !== product.id).slice(0, 4);
  const fillerNeeded = 4 - related.length;
  const filler = fillerNeeded > 0
    ? allProducts.filter((x) => x.id !== product.id && !related.includes(x)).slice(0, fillerNeeded)
    : [];
  const relatedList = [...related, ...filler];

  const changeQty = (delta: number) => {
    setQty((v) => Math.max(1, Math.min(product.stock, v + delta)));
  };

  const addToCart = () => {
    cartActions.add(product.id, qty);
    toast.success(`${qty}× ${product.name.slice(0, 30)}... ditambahkan`);
  };

  const buyNow = () => {
    cartActions.add(product.id, qty);
    setTimeout(() => navigate('/checkout'), 300);
  };

  const toggleWish = () => {
    const active = wishlistActions.toggle(product.id);
    toast.show(active ? 'Ditambahkan ke wishlist' : 'Dihapus dari wishlist');
  };

  return (
    <>
      <PageHeader
        title={product.name}
        breadcrumb={[
          { label: 'Beranda', to: '/' },
          { label: 'Produk', to: '/produk' },
          { label: product.name.slice(0, 40) + (product.name.length > 40 ? '...' : '') },
        ]}
      />

      <section className="container-x pb-28 lg:pb-16">
        <div className="card p-4 sm:p-6 lg:p-8 grid lg:grid-cols-2 gap-6 lg:gap-12 animate-fade-in">
          {/* Gallery */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl grid place-items-center mb-3 sm:mb-4 relative overflow-hidden">
              <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 40%, rgba(255,87,34,0.10), transparent 65%)' }} />
              {product.badge && (
                <span className="absolute top-3 left-3 z-20 inline-flex items-center gap-1 bg-brand-500 text-white text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full shadow-lg shadow-brand-500/30">
                  {product.badge === 'sale' ? <><Zap className="size-3 fill-current" /> Flash Sale</> : product.badge}
                </span>
              )}
              <span
                key={activeImg}
                className="relative z-10 select-none text-[110px] sm:text-[160px] lg:text-[200px] leading-none animate-fade-in"
              >
                {thumbs[activeImg]}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {thumbs.map((t, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`aspect-square bg-gray-50 rounded-xl sm:rounded-2xl grid place-items-center text-2xl sm:text-3xl border-2 transition-all duration-200 active:scale-95 ${
                    activeImg === i ? 'border-brand-500 ring-2 ring-brand-500/20 bg-brand-50/40' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="animate-slide-up">
            <div className="text-xs font-bold uppercase tracking-[2px] text-brand-500 mb-2">
              {product.category}
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 leading-tight mb-3">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-gray-500 mb-5">
              <div className="flex items-center gap-1">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                <strong className="text-gray-900">{product.rating}</strong>
              </div>
              <span className="text-gray-300">•</span>
              <span>{product.sold.toLocaleString('id-ID')} terjual</span>
              <span className="text-gray-300">•</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Stok {product.stock} tersedia
              </span>
            </div>

            <div className="flex items-baseline flex-wrap gap-3 py-5 border-y border-gray-100 mb-5">
              <span className="text-3xl sm:text-4xl font-extrabold text-brand-500">{formatPrice(product.price)}</span>
              {product.original && (
                <>
                  <span className="text-base text-gray-400 line-through">{formatPrice(product.original)}</span>
                  <span className="bg-red-50 text-red-600 px-2.5 py-1 rounded-md text-xs font-bold">
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            {/* Flash Sale Box */}
            {product.badge === 'sale' && (
              <div className="border-2 border-brand-500 rounded-2xl p-4 mb-5 bg-brand-50/40">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="size-4 text-brand-500 fill-brand-500" />
                    <span className="text-sm font-bold text-brand-500 uppercase tracking-wide">Flash Sale</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span>Berakhir dalam</span>
                    <CountdownTimer targetTime={getEndOfDay()} size="sm" />
                  </div>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-extrabold text-brand-500">{formatPrice(product.price)}</span>
                  {product.original && (
                    <>
                      <span className="text-sm text-gray-400 line-through">{formatPrice(product.original)}</span>
                      <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                        Hemat {formatPrice(product.original - product.price)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}

            <p className="text-gray-600 leading-relaxed mb-6">{product.desc}</p>

            <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 mb-6 grid grid-cols-2 gap-3 sm:gap-4 text-sm">
              <Spec icon={Package} label="SKU" value={`ERS-${product.id.toString().padStart(4, '0')}`} />
              <Spec icon={Truck} label="Pengiriman" value="1-3 hari kerja" />
              <Spec icon={ShieldCheck} label="Garansi" value="30 hari tukar" />
              <Spec icon={RotateCcw} label="Pengembalian" value="7 hari retur" />
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Jumlah</span>
              <div className="flex items-center bg-white border border-gray-200 rounded-full overflow-hidden">
                <button
                  onClick={() => changeQty(-1)}
                  className="size-10 grid place-items-center hover:bg-gray-100 disabled:opacity-40 active:scale-90 transition-transform"
                  disabled={qty <= 1}
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-12 text-center font-bold tabular-nums">{qty}</span>
                <button
                  onClick={() => changeQty(1)}
                  className="size-10 grid place-items-center hover:bg-gray-100 disabled:opacity-40 active:scale-90 transition-transform"
                  disabled={qty >= product.stock}
                >
                  <Plus className="size-4" />
                </button>
              </div>
              <span className="text-xs text-gray-500">Maks. {product.stock}</span>
            </div>

            {/* CTA — desktop */}
            <div className="hidden lg:flex flex-wrap gap-3">
              <button onClick={addToCart} className="btn btn-primary btn-lg flex-1">
                <ShoppingCart className="size-4" />
                Tambah ke Keranjang
              </button>
              <button onClick={buyNow} className="btn btn-secondary btn-lg flex-1">
                <Zap className="size-4" />
                Beli Sekarang
              </button>
              <button
                onClick={toggleWish}
                aria-label="Wishlist"
                className={`size-12 grid place-items-center rounded-full border-2 transition-colors ${
                  inWishlist
                    ? 'border-red-500 bg-red-50 text-red-500'
                    : 'border-gray-200 text-gray-500 hover:border-red-500 hover:text-red-500'
                }`}
              >
                <Heart className={`size-5 ${inWishlist ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Related */}
        <div className="mt-12 lg:mt-16">
          <SectionHead
            tag="Rekomendasi"
            title="Produk Serupa"
            subtitle="Mungkin kamu juga suka produk ini"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {relatedList.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Sticky CTA — mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-3 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] lg:hidden shadow-[0_-4px_24px_rgba(0,0,0,0.12)]">
        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleWish}
            aria-label="Wishlist"
            className={`size-12 shrink-0 grid place-items-center rounded-xl border-2 transition-colors ${
              inWishlist ? 'border-red-500 bg-red-50 text-red-500' : 'border-gray-200 text-gray-500'
            }`}
          >
            <Heart className={`size-5 ${inWishlist ? 'fill-current' : ''}`} />
          </button>
          <button onClick={addToCart} className="btn btn-outline btn-md flex-1 !border-2">
            <ShoppingCart className="size-4" />
            Keranjang
          </button>
          <button onClick={buyNow} className="btn btn-primary btn-md flex-1">
            <Zap className="size-4" />
            Beli Sekarang
          </button>
        </div>
      </div>
    </>
  );
}

function Spec({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="size-4 text-brand-500 shrink-0 mt-0.5" />
      <div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{label}</div>
        <div className="font-semibold text-gray-900">{value}</div>
      </div>
    </div>
  );
}
