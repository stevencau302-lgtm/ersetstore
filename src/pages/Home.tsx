import { Link } from 'react-router-dom';
import {
  Truck, Headphones, ShieldCheck, BadgeCheck, ArrowRight, Sparkles,
  Package, Zap, CheckCircle2,
} from 'lucide-react';
import { useState } from 'react';
import { useProducts } from '../lib/useProducts';
import ProductCard from '../components/ProductCard';
import SectionHead from '../components/SectionHead';
import FlashSaleSection from '../components/FlashSaleSection';
import { toast } from '../lib/toast';

export default function Home() {
  const { products: PRODUCTS } = useProducts();
  const newest = [
    ...PRODUCTS.filter((p) => p.badge === 'new'),
    ...PRODUCTS.filter((p) => p.badge !== 'new'),
  ].slice(0, 8);
  const bestSeller = [...PRODUCTS].sort((a, b) => b.sold - a.sold).slice(0, 8);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1e2a3a] via-[#1a2332] to-[#2d1f1f] text-white">
        <div className="absolute -top-32 -right-20 size-[600px] bg-brand-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 size-[500px] bg-amber-500/10 rounded-full blur-3xl" />

        <div className="container-x grid lg:grid-cols-2 gap-12 items-center py-16 lg:py-24 relative">
          <div className="animate-slide-up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight mb-6 text-gray-100">
              Semua yang Kamu{' '}
              <span className="bg-gradient-to-r from-brand-500 to-amber-400 bg-clip-text text-transparent">
                Butuhkan
              </span>
              , Ada di Sini
            </h1>
            <p className="text-lg text-gray-300/90 max-w-xl mb-8 leading-relaxed">
              Gadget, audio, homeware, tools, hobby & masih banyak lagi — produk pilihan dengan harga terbaik, update setiap hari!
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/produk" className="btn btn-primary btn-lg">
                Mulai Belanja
                <ArrowRight className="size-4" />
              </Link>
              <Link to="/produk" className="btn btn-lg border-2 border-white/20 text-white hover:bg-white hover:text-gray-900 transition-colors">
                Lihat Produk
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 pt-8 border-t border-white/10">
              {[
                { num: '10K+', label: 'Produk Import' },
                { num: '50K+', label: 'Pelanggan' },
                { num: '4.9★', label: 'Rating Toko' },
                { num: '24 Jam', label: 'Pengiriman' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-brand-500 to-amber-400 bg-clip-text text-transparent">
                    {s.num}
                  </div>
                  <div className="text-xs text-gray-300 uppercase tracking-wider mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative hidden lg:block">
            <div className="relative aspect-square max-w-md mx-auto bg-gradient-to-br from-brand-500 to-brand-700 rounded-full grid place-items-center text-9xl shadow-2xl shadow-brand-500/40">
              <Package className="size-48 text-white/90" strokeWidth={1.2} />
            </div>
            {/* Floating cards */}
            <div className="absolute top-8 -left-4 bg-white text-gray-900 rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-3 animate-pulse-soft">
              <div className="size-10 bg-brand-50 text-brand-500 rounded-xl grid place-items-center">
                <Truck className="size-5" />
              </div>
              <div>
                <div className="text-sm font-bold">Gratis Ongkir</div>
                <div className="text-xs text-gray-500">Min. Rp 200rb</div>
              </div>
            </div>
            <div className="absolute bottom-12 -right-4 bg-white text-gray-900 rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-3" style={{ animationDelay: '1s' }}>
              <div className="size-10 bg-amber-50 text-amber-500 rounded-xl grid place-items-center">
                <Zap className="size-5" />
              </div>
              <div>
                <div className="text-sm font-bold">Flash Sale</div>
                <div className="text-xs text-gray-500">Diskon 70%</div>
              </div>
            </div>
            <div className="absolute top-1/2 -right-8 bg-white text-gray-900 rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-3" style={{ animationDelay: '2s' }}>
              <div className="size-10 bg-emerald-50 text-emerald-500 rounded-xl grid place-items-center">
                <CheckCircle2 className="size-5" />
              </div>
              <div>
                <div className="text-sm font-bold">100% Original</div>
                <div className="text-xs text-gray-500">Asli & Berkualitas</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-surface-muted border-b border-gray-100 py-12">
        <div className="container-x grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { Icon: Truck, title: 'Pengiriman Cepat', desc: 'Pesanan diproses cepat dan dikirim setiap hari.' },
            { Icon: Headphones, title: 'Layanan 24 Jam', desc: 'Siap membantu pertanyaan dan kendala kamu.' },
            { Icon: ShieldCheck, title: 'Pembayaran Aman', desc: 'Pembayaran terenkripsi dengan metode terpercaya.' },
            { Icon: BadgeCheck, title: 'Garansi Kualitas', desc: 'Produk import original berkualitas terjamin.' },
          ].map(({ Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4 p-5 rounded-2xl hover:bg-white/80 transition-colors">
              <div className="size-12 grid place-items-center bg-brand-50 text-brand-500 rounded-xl shrink-0">
                <Icon className="size-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FLASH SALE */}
      <FlashSaleSection />

      {/* BANNER CTA */}
      <section className="pb-16">
        <div className="container-x">
          <div className="relative overflow-hidden bg-gradient-to-br from-brand-500 to-brand-600 rounded-3xl p-8 sm:p-12 grid lg:grid-cols-2 gap-8 items-center text-white">
            <div className="absolute -top-20 -right-20 size-72 bg-white/10 rounded-full" />
            <div className="absolute -bottom-32 -left-20 size-64 bg-white/10 rounded-full" />
            <div className="relative">
              <span className="inline-block bg-white/15 backdrop-blur-md text-xs font-bold uppercase tracking-[2px] px-3 py-1.5 rounded-full mb-4">
                <Sparkles className="size-3 inline mr-1" />
                Promo Spesial
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4">
                Belanja Hemat <br /> Setiap Hari!
              </h3>
              <p className="text-white/90 max-w-md mb-6">
                Dapatkan koleksi produk import terbaru dengan harga terbaik. Gratis ongkir untuk pembelian minimum Rp 200.000 ke seluruh Indonesia.
              </p>
              <Link to="/produk" className="btn btn-lg bg-white text-brand-500 hover:bg-gray-900 hover:text-white">
                Mulai Belanja
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="relative hidden lg:grid place-items-center">
              <div className="size-64 bg-white/10 backdrop-blur-md rounded-3xl grid place-items-center text-9xl">
                🛍️
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="pb-16">
        <div className="container-x">
          <SectionHead
            tag="Terbaru"
            title="Produk Terbaru"
            subtitle="Update koleksi produk import terbaru di toko kami"
            linkTo="/produk?promo=new"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {newest.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* BEST SELLER */}
      <section className="pb-16">
        <div className="container-x">
          <SectionHead
            tag="Top Rated"
            title="Produk Terlaris"
            subtitle="Pilihan terbaik dari ribuan pelanggan kami"
            linkTo="/produk"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {bestSeller.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="pb-20">
        <div className="container-x">
          <NewsletterCard />
        </div>
      </section>
    </>
  );
}

function NewsletterCard() {
  const [email, setEmail] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Berhasil berlangganan! Cek email kamu.');
    setEmail('');
  };

  return (
    <div className="relative overflow-hidden bg-gray-900 text-white rounded-3xl py-14 px-6 sm:px-12 text-center">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 size-[400px] bg-brand-500/20 blur-3xl" />
      <div className="relative max-w-xl mx-auto">
        <span className="inline-block text-xs font-bold uppercase tracking-[2px] text-brand-500 mb-3">
          Tetap Terhubung
        </span>
        <h3 className="text-3xl font-extrabold mb-3">Dapatkan Diskon Spesial!</h3>
        <p className="text-gray-300 mb-7">
          Berlangganan newsletter untuk mendapatkan info promo, produk baru, dan diskon eksklusif khusus member.
        </p>
        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Masukkan email kamu"
            className="input bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-brand-500"
          />
          <button type="submit" className="btn btn-primary btn-md sm:px-8">
            Berlangganan
          </button>
        </form>
      </div>
    </div>
  );
}
