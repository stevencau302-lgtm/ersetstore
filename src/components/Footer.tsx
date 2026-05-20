import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, MessageCircle, Music2 } from 'lucide-react';
import { CATEGORIES } from '../data/categories';

const PAYMENTS = ['BCA', 'BNI', 'MANDIRI', 'OVO', 'DANA', 'GOPAY', 'QRIS'];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="container-x py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="lg:col-span-1">
          <Link to="/" className="flex items-center gap-2.5 mb-5">
            <div className="size-10 grid place-items-center bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl text-white font-black text-lg shadow-lg shadow-brand-500/30">
              E
            </div>
            <div className="leading-tight">
              <div className="text-lg font-extrabold text-white tracking-tight">Erset Store</div>
              <div className="text-[10px] font-semibold text-brand-500 tracking-[2px] uppercase">Produk Lengkap & Unik</div>
            </div>
          </Link>
          <p className="text-sm leading-relaxed mb-5">
            Toko online terpercaya untuk gadget, audio, homeware, otomotif, tools, dan hobby. Produk berkualitas dengan harga terbaik, pengiriman cepat ke seluruh Indonesia.
          </p>
          <div className="flex gap-2">
            {[
              { Icon: Instagram, label: 'Instagram' },
              { Icon: Music2, label: 'TikTok' },
              { Icon: Youtube, label: 'YouTube' },
              { Icon: Facebook, label: 'Facebook' },
              { Icon: MessageCircle, label: 'WhatsApp' },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="size-10 grid place-items-center bg-gray-800 hover:bg-brand-500 rounded-xl transition-colors"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Belanja */}
        <div>
          <h5 className="text-xs font-bold text-brand-500 tracking-[2px] uppercase mb-5">Belanja</h5>
          <ul className="flex flex-col gap-3 text-sm">
            <li><Link to="/produk" className="hover:text-brand-500 transition-colors">Semua Produk</Link></li>
            {CATEGORIES.slice(0, 5).map((c) => (
              <li key={c.id}>
                <Link to={`/produk?kategori=${c.id}`} className="hover:text-brand-500 transition-colors">
                  {c.name}
                </Link>
              </li>
            ))}
            <li><a href="#" className="hover:text-brand-500 transition-colors">Flash Sale</a></li>
          </ul>
        </div>

        {/* Bantuan */}
        <div>
          <h5 className="text-xs font-bold text-brand-500 tracking-[2px] uppercase mb-5">Bantuan</h5>
          <ul className="flex flex-col gap-3 text-sm">
            <li><Link to="/bantuan#cara-belanja" className="hover:text-brand-500 transition-colors">Cara Belanja</Link></li>
            <li><Link to="/bantuan#cara-pembayaran" className="hover:text-brand-500 transition-colors">Cara Pembayaran</Link></li>
            <li><Link to="/bantuan#pengiriman" className="hover:text-brand-500 transition-colors">Pengiriman</Link></li>
            <li><Link to="/bantuan#pengembalian" className="hover:text-brand-500 transition-colors">Pengembalian</Link></li>
            <li><Link to="/bantuan#faq" className="hover:text-brand-500 transition-colors">FAQ</Link></li>
            <li><Link to="/bantuan#hubungi-kami" className="hover:text-brand-500 transition-colors">Hubungi Kami</Link></li>
          </ul>
        </div>

        {/* Tentang */}
        <div>
          <h5 className="text-xs font-bold text-brand-500 tracking-[2px] uppercase mb-5">Tentang Kami</h5>
          <ul className="flex flex-col gap-3 text-sm">
            <li><Link to="/tentang" className="hover:text-brand-500 transition-colors">Tentang Erset Store</Link></li>
            <li><Link to="/halaman/karir" className="hover:text-brand-500 transition-colors">Karir</Link></li>
            <li><Link to="/halaman/blog" className="hover:text-brand-500 transition-colors">Blog</Link></li>
            <li><Link to="/halaman/syarat-ketentuan" className="hover:text-brand-500 transition-colors">Syarat &amp; Ketentuan</Link></li>
            <li><Link to="/halaman/kebijakan-privasi" className="hover:text-brand-500 transition-colors">Kebijakan Privasi</Link></li>
          </ul>
          <h5 className="text-xs font-bold text-brand-500 tracking-[2px] uppercase mt-6 mb-3">Pembayaran</h5>
          <div className="flex flex-wrap gap-1.5">
            {PAYMENTS.map((p) => (
              <span key={p} className="bg-gray-800 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="container-x py-6 text-center text-xs text-gray-500">
          © 2026 Erset Store. Pusat Belanja Produk Import Indonesia.
        </div>
      </div>
    </footer>
  );
}
