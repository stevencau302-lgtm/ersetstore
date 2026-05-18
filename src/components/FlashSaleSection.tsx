import { Link } from 'react-router-dom';
import { Zap, ArrowRight } from 'lucide-react';
import CountdownTimer, { getEndOfDay } from './CountdownTimer';
import { PRODUCTS } from '../data/products';
import { formatPrice, calcDiscount } from '../lib/format';

export default function FlashSaleSection() {
  const flashProducts = PRODUCTS.filter((p) => p.badge === 'sale').slice(0, 8);
  const endTime = getEndOfDay();

  return (
    <section className="py-8">
      <div className="container-x">
        {/* Header - Clean & Modern */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-brand-500 rounded-xl grid place-items-center">
              <Zap className="size-5 text-white fill-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                Flash Sale
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-gray-500">Berakhir dalam</span>
                <CountdownTimer targetTime={endTime} size="sm" />
              </div>
            </div>
          </div>

          <Link
            to="/produk?promo=sale"
            className="hidden sm:inline-flex items-center gap-1.5 text-brand-500 font-bold text-sm hover:gap-2.5 transition-all"
          >
            Lihat Semua
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {flashProducts.map((p) => {
            const discount = calcDiscount(p.price, p.original);
            const soldPercent = Math.min(95, Math.round((p.sold / (p.sold + p.stock)) * 100));

            return (
              <Link
                key={p.id}
                to={`/produk/${p.id}`}
                className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                {/* Image */}
                <div className="relative aspect-square bg-gradient-to-br from-[#f5f5f0] to-[#eeeee8] grid place-items-center overflow-hidden">
                  {/* Discount badge */}
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md z-10">
                    -{discount}%
                  </span>
                  <span className="text-5xl sm:text-6xl transition-transform duration-300 group-hover:scale-110">
                    {p.emoji}
                  </span>
                </div>

                {/* Info */}
                <div className="p-3">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2 leading-tight min-h-[2rem] mb-2 group-hover:text-brand-500 transition-colors">
                    {p.name}
                  </h3>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-sm sm:text-base font-extrabold text-brand-500">
                      {formatPrice(p.price)}
                    </span>
                    {p.original && (
                      <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                        {formatPrice(p.original)}
                      </span>
                    )}
                  </div>

                  {/* Progress bar stok */}
                  <div className="relative">
                    <div className="w-full h-4 bg-orange-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-500 to-red-500 rounded-full transition-all duration-500 relative"
                        style={{ width: `${soldPercent}%` }}
                      >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[9px] sm:text-[10px] font-bold text-white drop-shadow-sm">
                        {soldPercent >= 80 ? 'Hampir Habis!' : `Terjual ${soldPercent}%`}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mobile: Lihat Semua button */}
        <div className="sm:hidden mt-4 text-center">
          <Link
            to="/produk?promo=sale"
            className="inline-flex items-center gap-1.5 bg-brand-500 text-white font-bold text-sm px-5 py-2.5 rounded-full hover:bg-brand-600 transition-colors"
          >
            Lihat Semua Flash Sale
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
