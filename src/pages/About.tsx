import { Link } from 'react-router-dom';
import { Package, Users, Truck, ShieldCheck, Star, Target, Heart, Zap } from 'lucide-react';
import PageHeader from '../components/PageHeader';

export default function About() {
  return (
    <>
      <PageHeader title="Tentang Erset Store" breadcrumb={[{ label: 'Beranda', to: '/' }, { label: 'Tentang Kami' }]} />
      <section className="container-x pb-16 space-y-8">
        <div className="card p-6 sm:p-8">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Siapa Kami?</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-4"><strong>Erset Store</strong> adalah toko online terpercaya yang berdiri sejak 2020, menyediakan berbagai produk import berkualitas dengan harga terjangkau. Kami percaya semua orang berhak mendapatkan produk berkualitas tanpa harus merogoh kocek dalam-dalam.</p>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">Berawal dari passion terhadap gadget dan teknologi, kami terus berkembang menjadi marketplace produk import yang menjual berbagai kategori — mulai dari aksesoris gadget, audio, homeware, otomotif, outdoor kit, tools, hobby, hingga toys.</p>
          <p className="text-sm text-gray-700 leading-relaxed">Setiap produk yang kami jual telah melalui proses kurasi ketat untuk memastikan kualitas dan keasliannya.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[{ icon: Package, num: '10.000+', label: 'Produk' }, { icon: Users, num: '50.000+', label: 'Pelanggan' }, { icon: Star, num: '4.9/5', label: 'Rating' }, { icon: Truck, num: '100.000+', label: 'Terkirim' }].map(({ icon: Icon, num, label }) => (
            <div key={label} className="card p-5 text-center">
              <Icon className="size-6 text-brand-500 mx-auto mb-2" />
              <div className="text-xl font-extrabold text-gray-900">{num}</div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-3"><Target className="size-5 text-brand-500" /><h3 className="text-lg font-bold text-gray-900">Visi</h3></div>
            <p className="text-sm text-gray-600 leading-relaxed">Menjadi platform belanja online #1 di Indonesia untuk produk import berkualitas dengan harga terbaik.</p>
          </div>
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-3"><Heart className="size-5 text-brand-500" /><h3 className="text-lg font-bold text-gray-900">Misi</h3></div>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2"><Zap className="size-3.5 text-brand-500 shrink-0 mt-1" /><span>Produk original harga kompetitif</span></li>
              <li className="flex items-start gap-2"><Zap className="size-3.5 text-brand-500 shrink-0 mt-1" /><span>Pelayanan 24/7 ramah & responsif</span></li>
              <li className="flex items-start gap-2"><Zap className="size-3.5 text-brand-500 shrink-0 mt-1" /><span>Pengiriman cepat ke seluruh Indonesia</span></li>
              <li className="flex items-start gap-2"><Zap className="size-3.5 text-brand-500 shrink-0 mt-1" /><span>Produk terbaru update setiap hari</span></li>
            </ul>
          </div>
        </div>
        <div className="card p-6 sm:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Kenapa Belanja di Erset Store?</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[{ icon: ShieldCheck, title: '100% Original', desc: 'Import langsung dari supplier terpercaya.' }, { icon: Truck, title: 'Pengiriman Cepat', desc: 'Diproses & dikirim setiap hari.' }, { icon: Star, title: 'Harga Terbaik', desc: 'Potong rantai distribusi, harga lebih murah.' }, { icon: Users, title: 'CS 24 Jam', desc: 'Siap bantu kapan saja via WhatsApp.' }].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <Icon className="size-5 text-brand-500 shrink-0 mt-0.5" />
                <div><h4 className="text-sm font-bold text-gray-900 mb-0.5">{title}</h4><p className="text-xs text-gray-500">{desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
