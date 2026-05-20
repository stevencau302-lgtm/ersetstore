import { useParams, Link } from 'react-router-dom';
import { FileText, Shield, Briefcase, PenTool, Frown } from 'lucide-react';
import PageHeader from '../components/PageHeader';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <div><h4 className="font-bold text-gray-900 mb-2">{title}</h4>{children}</div>;
}

const PAGES: Record<string, { title: string; icon: any; content: React.ReactNode }> = {
  'syarat-ketentuan': { title: 'Syarat & Ketentuan', icon: FileText, content: (
    <div className="space-y-5 text-sm text-gray-700 leading-relaxed">
      <Section title="1. Umum"><p>Dengan mengakses website Erset Store, Anda menyetujui syarat dan ketentuan yang berlaku.</p></Section>
      <Section title="2. Pemesanan & Pembayaran"><ul className="list-disc list-inside space-y-1 text-xs text-gray-600"><li>Harga dapat berubah sewaktu-waktu</li><li>Pembayaran harus diselesaikan dalam 1×24 jam</li><li>Pesanan belum dibayar otomatis dibatalkan</li></ul></Section>
      <Section title="3. Pengiriman"><p>Estimasi pengiriman adalah perkiraan. Erset Store tidak bertanggung jawab atas keterlambatan dari pihak kurir.</p></Section>
      <Section title="4. Pengembalian"><p>Pengembalian diterima dalam 7 hari jika barang cacat/rusak/tidak sesuai. Sertakan foto/video unboxing.</p></Section>
      <Section title="5. Batasan Tanggung Jawab"><p>Tanggung jawab kami terbatas pada nilai pembelian produk.</p></Section>
      <Section title="6. Perubahan"><p>Ketentuan dapat berubah kapan saja dan berlaku setelah dipublikasikan.</p></Section>
    </div>
  )},
  'kebijakan-privasi': { title: 'Kebijakan Privasi', icon: Shield, content: (
    <div className="space-y-5 text-sm text-gray-700 leading-relaxed">
      <Section title="1. Data yang Dikumpulkan"><ul className="list-disc list-inside space-y-1 text-xs text-gray-600"><li>Nama, email, nomor telepon</li><li>Alamat pengiriman</li><li>Riwayat pesanan</li></ul></Section>
      <Section title="2. Penggunaan Data"><p>Data digunakan untuk memproses pesanan, menghubungi terkait status, dan mengirim promo (jika berlangganan).</p></Section>
      <Section title="3. Keamanan"><p>Kami menggunakan enkripsi SSL 256-bit. Data tidak dijual ke pihak ketiga.</p></Section>
      <Section title="4. Cookies"><p>Website menggunakan cookies untuk keranjang belanja dan preferensi. Bisa dinonaktifkan via browser.</p></Section>
      <Section title="5. Hak Pengguna"><p>Anda berhak meminta akses, koreksi, atau penghapusan data. Hubungi cs@ersetstore.id.</p></Section>
    </div>
  )},
  karir: { title: 'Karir', icon: Briefcase, content: (
    <div className="space-y-5 text-sm text-gray-700 leading-relaxed">
      <p>Bergabunglah dengan tim Erset Store! Kami mencari talenta terbaik di dunia e-commerce.</p>
      <Section title="Posisi Terbuka">
        <div className="space-y-3">{[{ role: 'Customer Service', loc: 'Remote' }, { role: 'Content Creator', loc: 'Jakarta' }, { role: 'Social Media Specialist', loc: 'Remote' }, { role: 'Warehouse Staff', loc: 'Jakarta Selatan' }, { role: 'Digital Marketing', loc: 'Remote' }].map(({ role, loc }) => (
          <div key={role} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"><div><div className="text-sm font-bold text-gray-900">{role}</div><div className="text-xs text-gray-500">Full-time • {loc}</div></div><span className="text-xs font-bold text-brand-500 bg-brand-50 px-2.5 py-1 rounded-full">Open</span></div>
        ))}</div>
      </Section>
      <Section title="Benefit"><ul className="list-disc list-inside space-y-1 text-xs text-gray-600"><li>Gaji kompetitif + bonus</li><li>BPJS Kesehatan & Ketenagakerjaan</li><li>WFH (posisi tertentu)</li><li>Diskon karyawan 50%</li></ul></Section>
      <div className="bg-brand-50 border border-brand-100 rounded-lg p-4 text-xs text-brand-700"><strong>Tertarik?</strong> Kirim CV ke <span className="font-bold">karir@ersetstore.id</span></div>
    </div>
  )},
  blog: { title: 'Blog', icon: PenTool, content: (
    <div className="space-y-4 text-sm text-gray-700">
      <p>Tips, review produk, dan berita terbaru dari Erset Store.</p>
      {[{ title: '10 Gadget Wajib Punya di 2026', date: '15 Mei 2026', desc: 'Rekomendasi gadget import terbaik untuk produktivitas.' }, { title: 'Cara Merawat Earbuds Biar Awet', date: '12 Mei 2026', desc: 'Tips supaya TWS tetap jernih dan baterai tahan lama.' }, { title: 'Review: Smart Watch Series 8', date: '8 Mei 2026', desc: 'Review lengkap smartwatch terlaris di toko kami.' }, { title: 'Setup Workspace Budget 500K', date: '3 Mei 2026', desc: 'Bikin meja kerja keren tanpa mahal.' }].map(({ title, date, desc }) => (
        <div key={title} className="p-4 bg-gray-50 rounded-xl border border-gray-100"><div className="text-xs text-gray-400 mb-1">{date}</div><h4 className="text-sm font-bold text-gray-900 mb-1">{title}</h4><p className="text-xs text-gray-600">{desc}</p></div>
      ))}
      <p className="text-xs text-gray-500 italic">* Blog lengkap segera hadir!</p>
    </div>
  )},
};

export default function Legal() {
  const { slug } = useParams();
  const page = PAGES[slug || ''];
  if (!page) return (<><PageHeader title="Tidak Ditemukan" breadcrumb={[{ label: 'Beranda', to: '/' }, { label: '404' }]} /><div className="container-x pb-16"><div className="card p-8 text-center"><Frown className="size-12 mx-auto text-gray-400 mb-3" /><p className="text-gray-500">Halaman tidak tersedia.</p><Link to="/" className="btn btn-primary btn-sm mt-4">Beranda</Link></div></div></>);
  const Icon = page.icon;
  return (
    <><PageHeader title={page.title} breadcrumb={[{ label: 'Beranda', to: '/' }, { label: page.title }]} />
      <section className="container-x pb-16"><div className="card p-5 sm:p-8 max-w-3xl mx-auto"><div className="flex items-center gap-3 mb-6"><div className="size-10 grid place-items-center bg-brand-50 text-brand-500 rounded-xl"><Icon className="size-5" /></div><h2 className="text-lg sm:text-xl font-extrabold text-gray-900">{page.title}</h2></div>{page.content}</div></section>
    </>
  );
}
