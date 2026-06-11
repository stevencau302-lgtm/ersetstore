import { Link } from 'react-router-dom';
import {
  ArrowRight, ShoppingBag, Zap, Shield, Smartphone, BarChart3, Headphones,
  Star, CheckCircle2, ExternalLink, MessageCircle, Rocket, Code2, Palette,
} from 'lucide-react';

const FEATURES = [
  { icon: Smartphone, title: 'Mobile-First Design', desc: 'Tampilan super responsif, terasa seperti native app di semua device.' },
  { icon: Zap, title: 'Performa Cepat', desc: 'Dibangun dengan React & Vite, loading time di bawah 2 detik.' },
  { icon: Shield, title: 'Pembayaran Aman', desc: 'Integrasi multi payment gateway dengan enkripsi SSL 256-bit.' },
  { icon: BarChart3, title: 'Dashboard Admin', desc: 'Kelola produk, pesanan, pelanggan, dan pengaturan toko real-time.' },
  { icon: ShoppingBag, title: 'Cek Ongkir Otomatis', desc: 'Ongkos kirim dihitung real-time dengan 15+ kurir (JNE, J&T, SiCepat, dll).' },
  { icon: Headphones, title: 'Support & Maintenance', desc: 'Free support 30 hari setelah launch + maintenance bulanan opsional.' },
];

const PORTFOLIO_STATS = [
  { value: '50+', label: 'Toko Terbangun' },
  { value: '99%', label: 'Client Puas' },
  { value: '<2 Minggu', label: 'Waktu Pengerjaan' },
  { value: '24/7', label: 'Support' },
];

const PACKAGES = [
  {
    name: 'Starter',
    price: 'Rp 1.500.000',
    desc: 'Cocok untuk UMKM & bisnis baru',
    features: ['Hingga 50 produk', 'Desain responsif mobile-first', 'Integrasi 1 payment gateway', 'Cek ongkir otomatis', 'Domain custom (.com)', 'Hosting 1 tahun', 'SSL gratis'],
    cta: 'Pilih Starter',
    popular: false,
  },
  {
    name: 'Professional',
    price: 'Rp 3.500.000',
    desc: 'Untuk bisnis yang ingin scale',
    features: ['Produk unlimited', 'Desain premium custom', 'Multi payment gateway', 'Dashboard admin lengkap', 'Integrasi ongkir 15+ kurir', 'Wishlist & lacak pesanan', 'SEO optimized', 'Support 30 hari'],
    cta: 'Pilih Professional',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    desc: 'Full custom sesuai kebutuhan',
    features: ['Semua fitur Professional', 'Desain 100% custom', 'Integrasi API kustom', 'Multi-admin & role', 'Analytics dashboard', 'Priority support', 'Maintenance bulanan', 'Konsultasi arsitektur'],
    cta: 'Hubungi Kami',
    popular: false,
  },
];

const PROCESS = [
  { step: 1, icon: MessageCircle, title: 'Konsultasi', desc: 'Diskusi kebutuhan, fitur, dan referensi desain yang kamu mau.' },
  { step: 2, icon: Palette, title: 'Desain & Prototipe', desc: 'Kami buatkan mockup yang bisa kamu review sebelum development.' },
  { step: 3, icon: Code2, title: 'Development', desc: 'Pengerjaan oleh tim profesional dengan update progress mingguan.' },
  { step: 4, icon: Rocket, title: 'Launch & Support', desc: 'Go-live di domain kamu + free support & perbaikan 30 hari.' },
];

const TESTIMONIALS = [
  { name: 'Andi Pratama', role: 'Owner, GadgetKu', text: 'Toko online saya jadi jauh lebih profesional. Pelanggan sering bilang tampilannya kaya marketplace besar.' },
  { name: 'Sarah Wijaya', role: 'Founder, Beautybox', text: 'Prosesnya cepet, hasilnya melebihi ekspektasi. Omzet naik 3x setelah pake toko baru.' },
  { name: 'Budi Santoso', role: 'CEO, ToolsID', text: 'Tim-nya responsif, desainnya modern. Worth every penny!' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-[#1a2332] to-[#2d1f1f] text-white">
        <div className="absolute -top-40 -right-32 size-[600px] bg-brand-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 size-[400px] bg-amber-500/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center py-16 sm:py-20 lg:py-28 relative">
          <div className="animate-slide-up">
            <span className="inline-flex items-center gap-1.5 bg-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-5">
              <Zap className="size-3.5 fill-brand-400" /> Jasa Pembuatan Toko Online
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-[1.1] tracking-tight mb-5">
              Toko Online{' '}
              <span className="bg-gradient-to-r from-brand-500 to-amber-400 bg-clip-text text-transparent">
                Premium
              </span>{' '}
              untuk Bisnis Kamu
            </h1>
            <p className="text-base sm:text-lg text-gray-300 max-w-xl mb-8 leading-relaxed">
              Kami bangun toko online modern, super cepat, & responsif yang bikin pelanggan betah belanja. Dari desain sampai go-live, semua kami handle.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="https://wa.me/6281234567890?text=Halo%2C%20saya%20tertarik%20jasa%20pembuatan%20toko%20online" target="_blank" rel="noopener" className="btn btn-primary btn-lg">
                Konsultasi Gratis <ArrowRight className="size-4" />
              </a>
              <Link to="/" className="btn btn-lg border-2 border-white/20 text-white hover:bg-white hover:text-gray-900 transition-colors">
                <ExternalLink className="size-4" /> Lihat Demo
              </Link>
            </div>
          </div>

          {/* Demo preview */}
          <div className="relative hidden lg:block">
            <div className="relative rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl shadow-brand-500/20">
              <div className="bg-gray-800 h-8 flex items-center gap-1.5 px-4">
                <span className="size-2.5 rounded-full bg-red-400" />
                <span className="size-2.5 rounded-full bg-amber-400" />
                <span className="size-2.5 rounded-full bg-emerald-400" />
                <span className="ml-3 text-[10px] text-gray-400 font-mono">ersetstore.vercel.app</span>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 text-center">
                <div className="size-16 mx-auto mb-3 grid place-items-center bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl text-white shadow-lg shadow-brand-500/30">
                  <ShoppingBag className="size-8" />
                </div>
                <p className="text-lg font-extrabold text-gray-900 mb-1">ERSET STORE</p>
                <p className="text-xs text-gray-500 mb-4">Live Demo — Toko Online Premium</p>
                <div className="grid grid-cols-3 gap-2 text-center mb-4">
                  <div className="bg-white rounded-lg p-2 shadow-sm">
                    <p className="text-lg font-bold text-brand-500">24+</p>
                    <p className="text-[10px] text-gray-500">Produk</p>
                  </div>
                  <div className="bg-white rounded-lg p-2 shadow-sm">
                    <p className="text-lg font-bold text-brand-500">15+</p>
                    <p className="text-[10px] text-gray-500">Kurir</p>
                  </div>
                  <div className="bg-white rounded-lg p-2 shadow-sm">
                    <p className="text-lg font-bold text-brand-500">∞</p>
                    <p className="text-[10px] text-gray-500">Fitur</p>
                  </div>
                </div>
                <Link to="/" className="inline-flex items-center gap-1 text-sm font-bold text-brand-500 hover:underline">
                  Buka Demo Lengkap <ExternalLink className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {PORTFOLIO_STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">{s.value}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-500">Fitur Unggulan</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mt-2">Semua yang Toko Online Kamu Butuhkan</h2>
            <p className="text-gray-500 max-w-2xl mx-auto mt-3">Fitur lengkap yang bikin bisnis kamu standout dari kompetitor.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="group p-5 sm:p-6 rounded-2xl border border-gray-100 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-500/5 transition-all duration-300">
                <div className="size-12 rounded-xl bg-brand-50 text-brand-500 grid place-items-center mb-4 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                  <f.icon className="size-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1.5">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-500">Cara Kerja</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mt-2">4 Langkah Simpel</h2>
            <p className="text-gray-500 mt-3">Dari nol sampai live, prosesnya gampang & transparan.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS.map((p) => (
              <div key={p.step} className="relative text-center">
                <div className="size-14 mx-auto mb-4 rounded-2xl bg-white border border-gray-200 shadow-sm grid place-items-center text-brand-500">
                  <p.icon className="size-6" />
                </div>
                <span className="absolute top-0 right-1/2 translate-x-[3.2rem] -translate-y-1 bg-brand-500 text-white text-[10px] font-bold size-5 grid place-items-center rounded-full">{p.step}</span>
                <h4 className="font-bold text-gray-900 mb-1">{p.title}</h4>
                <p className="text-sm text-gray-500">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-500">Harga</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mt-2">Investasi untuk Bisnis Kamu</h2>
            <p className="text-gray-500 mt-3">Pilih paket yang sesuai kebutuhan & budget.</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-5 items-start">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.name}
                className={`rounded-3xl p-6 sm:p-7 border-2 transition-shadow ${
                  pkg.popular
                    ? 'border-brand-500 shadow-xl shadow-brand-500/10 relative'
                    : 'border-gray-200 hover:shadow-md'
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    Paling Populer
                  </span>
                )}
                <h3 className="text-lg font-bold text-gray-900">{pkg.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{pkg.desc}</p>
                <div className="text-3xl font-extrabold text-gray-900 mb-5">{pkg.price}</div>
                <ul className="space-y-2.5 mb-6">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="size-4 text-brand-500 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="https://wa.me/6281234567890?text=Halo%2C%20saya%20tertarik%20paket%20" 
                  target="_blank"
                  rel="noopener"
                  className={`btn btn-lg w-full ${pkg.popular ? 'btn-primary' : 'btn-outline'}`}
                >
                  {pkg.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-500">Testimoni</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mt-2">Apa Kata Klien Kami</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="text-sm font-bold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="bg-gradient-to-br from-gray-900 to-ink-800 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
            <div className="absolute -top-20 -right-20 size-60 bg-brand-500/30 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Siap Punya Toko Online Premium?</h2>
              <p className="text-white/70 max-w-lg mx-auto mb-7">Konsultasi gratis, tanpa komitmen. Ceritakan bisnis kamu dan kami kasih solusi terbaik.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="https://wa.me/6281234567890?text=Halo%2C%20saya%20mau%20konsultasi%20pembuatan%20toko%20online" target="_blank" rel="noopener" className="btn btn-primary btn-lg">
                  <MessageCircle className="size-4" /> Chat WhatsApp
                </a>
                <Link to="/" className="btn btn-lg border-2 border-white/20 text-white hover:bg-white hover:text-gray-900">
                  <ExternalLink className="size-4" /> Lihat Demo Store
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer mini */}
      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-500">
        <p>© 2026 Erset Digital. Jasa Pembuatan Toko Online Premium.</p>
      </footer>
    </div>
  );
}
