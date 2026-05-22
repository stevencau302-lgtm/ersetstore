import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import type { Product } from '../types';
import { formatPrice, calcDiscount } from '../lib/format';
import { cartActions, useWishlist, wishlistActions } from '../lib/cart';
import { toast } from '../lib/toast';

interface Props { product: Product }

const BADGE_STYLES: Record<string, string> = {
  sale: 'bg-red-500 text-white',
  new: 'bg-emerald-500 text-white',
  hot: 'bg-amber-500 text-white',
};

export default function ProductCard({ product: p }: Props) {
  const { ids } = useWishlist();
  const inWishlist = ids.includes(p.id);
  const discount = calcDiscount(p.price, p.original);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    cartActions.add(p.id);
    toast.success('Produk ditambahkan ke keranjang');
  };

  const handleWish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const active = wishlistActions.toggle(p.id);
    toast.show(active ? 'Ditambahkan ke wishlist' : 'Dihapus dari wishlist');
  };

  return (
    <Link
      to={`/produk/${p.id}`}
      className="group card hover:shadow-xl hover:-translate-y-1 hover:border-gray-200 flex flex-col overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gradient-to-br from-[#f5f5f0] to-[#eeeee8] grid place-items-center overflow-hidden">
        {p.badge && (
          <span className={`absolute top-2 left-2 sm:top-3 sm:left-3 z-10 ${BADGE_STYLES[p.badge]} badge text-[9px] sm:text-[11px]`}>
            {p.badge === 'sale' ? `-${discount}%` : p.badge === 'new' ? 'Baru' : 'Hot'}
          </span>
        )}
        <button
          onClick={handleWish}
          aria-label="Wishlist"
          className={`absolute top-2 right-2 sm:top-3 sm:right-3 z-10 size-7 sm:size-9 grid place-items-center rounded-full transition-colors backdrop-blur-md ${
            inWishlist
              ? 'bg-red-50 text-red-500'
              : 'bg-white/80 text-gray-500 hover:text-red-500'
          }`}
        >
          <Heart className={`size-3.5 sm:size-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>
        <span className="text-5xl sm:text-7xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
          {p.emoji}
        </span>
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1 sm:mb-1.5">
          {p.category}
        </div>
        <h3 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2 leading-snug min-h-[2rem] sm:min-h-[2.5rem] mb-2 group-hover:text-brand-500 transition-colors">
          {p.name}
        </h3>
        <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-500 mb-2 sm:mb-3">
          <Star className="size-3 sm:size-3.5 fill-amber-400 text-amber-400" />
          <span className="font-medium text-gray-700">{p.rating}</span>
          <span>•</span>
          <span>{p.sold.toLocaleString('id-ID')} terjual</span>
        </div>
        <div className="flex items-end justify-between mt-auto gap-1.5 sm:gap-2">
          <div className="flex flex-col min-w-0">
            <span className="text-sm sm:text-base font-extrabold text-brand-500 leading-tight truncate">
              {formatPrice(p.price)}
            </span>
            {p.original && (
              <span className="text-[10px] sm:text-xs text-gray-400 line-through leading-tight truncate">
                {formatPrice(p.original)}
              </span>
            )}
          </div>
          <button
            onClick={handleAdd}
            aria-label="Tambah ke keranjang"
            className="size-8 sm:size-9 grid place-items-center bg-gray-900 hover:bg-brand-500 text-white rounded-xl transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            <ShoppingCart className="size-3.5 sm:size-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}
