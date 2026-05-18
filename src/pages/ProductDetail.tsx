import { type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Star, Heart, ShoppingCart, Zap, Plus, Minus, CheckCircle2, Truck, ShieldCheck,
  RotateCcw, Frown, Package,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import ProductCard from '../components/ProductCard';
import { findProduct, PRODUCTS } from '../data/products';
import { formatPrice, calcDiscount } from '../lib/format';
import { cartActions, useWishlist, wishlistActions } from '../lib/cart';
import { toast } from '../lib/toast';
import SectionHead from '../components/SectionHead';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = findProduct(Number(id));

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

  const related = PRODUCTS.filter((x) => x.category === product.category && x.id !== product.id).slice(0, 4);
  const fillerNeeded = 4 - related.length;
  const filler = fillerNeeded > 0
    ? PRODUCTS.filter((x) => x.id !== product.id && !related.includes(x)).slice(0, fillerNeeded)
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

      <section className="container-x pb-16">
        <div className="card p-6 sm:p-8 grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <div>
            <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl grid place-items-center text-[200px] mb-4 relative overflow-hidden">
              <span className="relative z-10 select-none">{thumbs[activeImg]}</span>
              <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, rgba(255,87,34,0.08), transparent 70%)' }} />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {thumbs.map((t, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`aspect-square bg-gray-50 rounded-xl grid place-items-center text-3xl border-2 transition-all ${
                    activeImg === i ? 'border-brand-500 ring-2 ring-brand-500/20' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="text-xs font-bold uppercase tracking-[2px] text-brand-500 mb-2">
              {product.category}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-3">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-5">
              <div className="flex items-center gap-1">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                <strong className="text-gray-900">{product.rating}</strong>
              </div>
              <span>•</span>
              <span>{product.sold.toLocaleString('id-ID')} terjual</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                <CheckCircle2 className="size-3.5" />
                Stok {product.stock} tersedia
              </span>
            </div>

            <div className="flex items-baseline flex-wrap gap-3 py-5 border-y border-gray-100 mb-5">
              <span className="text-4xl font-extrabold text-brand-500">{formatPrice(product.price)}</span>
              {product.original && (
                <>
                  <span className="text-base text-gray-400 line-through">{formatPrice(product.original)}</span>
                  <span className="bg-red-50 text-red-600 px-2.5 py-1 rounded-md text-xs font-bold">
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed mb-6">{product.desc}</p>

            <div className="bg-gray-50 rounded-xl p-5 mb-6 grid sm:grid-cols-2 gap-3 text-sm">
              <Spec icon={Package} label="SKU" value={`ERS-${product.id.toString().padStart(4, '0')}`} />
              <Spec icon={Truck} label="Pengiriman" value="1-3 hari kerja" />
              <Spec icon={ShieldCheck} label="Garansi" value="30 hari tukar barang" />
              <Spec icon={CheckCircle2} label="Original" value="100% Asli" />
            </div>

            <div className="flex items-center gap-4 mb-6 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Jumlah</span>
              <div className="flex items-center bg-white border border-gray-200 rounded-full overflow-hidden">
                <button
                  onClick={() => changeQty(-1)}
                  className="size-10 grid place-items-center hover:bg-gray-100 disabled:opacity-50"
                  disabled={qty <= 1}
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-12 text-center font-bold">{qty}</span>
                <button
                  onClick={() => changeQty(1)}
                  className="size-10 grid place-items-center hover:bg-gray-100 disabled:opacity-50"
                  disabled={qty >= product.stock}
                >
                  <Plus className="size-4" />
                </button>
              </div>
              <span className="text-xs text-gray-500">Maks. {product.stock}</span>
            </div>

            <div className="flex flex-wrap gap-3">
              <button onClick={addToCart} className="btn btn-primary btn-lg flex-1 sm:flex-none">
                <ShoppingCart className="size-4" />
                Tambah ke Keranjang
              </button>
              <button onClick={buyNow} className="btn btn-secondary btn-lg flex-1 sm:flex-none">
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
        <div className="mt-16">
          <SectionHead
            tag="Rekomendasi"
            title="Produk Serupa"
            subtitle="Mungkin kamu juga suka produk ini"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedList.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
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
