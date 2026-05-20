import { Link } from 'react-router-dom';
import {
  ShoppingCart, CreditCard, Truck, RotateCcw, HelpCircle, MessageCircle,
  ChevronRight, Phone, Mail, MapPin, Clock,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';

export default function Info() {
  return (
    <>
      <PageHeader
        title="Pusat Bantuan"
        breadcrumb={[{ label: 'Beranda', to: '/' }, { label: 'Bantuan' }]}
      />

      <section className="container-x pb-16 space-y-8">
        {/* Cara Belanja */}
        <InfoCard id="cara-belanja" icon={ShoppingCart} title="Cara Belanja">
          <ol className="list-decimal list-inside space-y-3 text-sm text-gray-700 leading-relaxed">
            <li><strong>Pilih Produk</strong> — Cari produk yang kamu inginkan melalui halaman Semua Produk atau gunakan fitur pencarian.</li>
            <li><strong>Tambah ke Keranjang</strong> — Klik tombol "Tambah ke Keranjang" atau "Beli Sekarang" di halaman detail produk.</li>
            <li><strong>Cek Keranjang</strong> — Periksa produk, jumlah, dan total harga di halaman Keranjang. Gunakan kode promo jika ada.</li>
            <li><strong>Isi Data Pengiriman</strong> — Masukkan nama, alamat lengkap, nomor HP, dan pilih metode pengiriman.</li>
            <li><strong>Pilih Pembayaran</strong> — Pilih metode pembayaran: Transfer Bank, E-Wallet, atau COD.</li>
            <li><strong>Konfirmasi Pesanan</strong> — Klik "Bayar Sekarang" dan ikuti instruksi pembayaran yang muncul.</li>
            <li><strong>Selesai!</strong> — Pesanan kamu akan diproses setelah pembayaran dikonfirmasi. Cek email untuk detail pesanan.</li>
          </ol>
        </InfoCard>

        {/* Cara Pembayaran */}
        <InfoCard id="cara-pembayaran" icon={CreditCard} title="Cara Pembayaran">
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Transfer Bank</h4>
              <p>Kami menerima transfer dari BCA, BNI, Mandiri, dan BRI. Setelah checkout, nomor rekening akan ditampilkan di halaman konfirmasi. Sertakan nomor pesanan di keterangan transfer.</p>
              <ul className="mt-2 space-y-1 text-xs text-gray-500">
                <li>• BCA: 8720 5431 88 (a/n PT Erset Indonesia)</li>
                <li>• BNI: 0412 7893 21 (a/n PT Erset Indonesia)</li>
                <li>• Mandiri: 1300 0198 7654 (a/n PT Erset Indonesia)</li>
                <li>• BRI: 0321 0100 4567 501 (a/n PT Erset Indonesia)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">E-Wallet</h4>
              <p>Bayar via GoPay, OVO, DANA, atau ShopeePay. Transfer ke nomor yang tertera setelah checkout, lalu screenshot bukti dan kirim ke WhatsApp kami.</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">COD (Bayar di Tempat)</h4>
              <p>Bayar langsung ke kurir saat barang sampai. Siapkan uang pas karena kurir tidak bisa memberikan kembalian. Tersedia untuk area tertentu.</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
              <strong>Batas Waktu Pembayaran:</strong> 1×24 jam setelah checkout. Pesanan otomatis dibatalkan jika belum dibayar.
            </div>
          </div>
        </InfoCard>

        {/* Pengiriman */}
        <InfoCard id="pengiriman" icon={Truck} title="Pengiriman">
          <div className="space-y-4 text-sm text-gray-700">
            <p>Kami bekerja sama dengan jasa pengiriman terpercaya untuk memastikan produk sampai dengan aman dan cepat.</p>
            <table className="w-full text-xs border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-bold">Kurir</th>
                  <th className="text-left p-3 font-bold">Estimasi</th>
                  <th className="text-left p-3 font-bold">Biaya</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-100"><td className="p-3">JNE Reguler</td><td className="p-3">2-3 hari</td><td className="p-3">Rp 15.000</td></tr>
                <tr className="border-t border-gray-100"><td className="p-3">JNE YES</td><td className="p-3">1 hari</td><td className="p-3">Rp 28.000</td></tr>
                <tr className="border-t border-gray-100"><td className="p-3">SiCepat REG</td><td className="p-3">2-3 hari</td><td className="p-3">Rp 14.000</td></tr>
                <tr className="border-t border-gray-100"><td className="p-3">J&T Express</td><td className="p-3">2-4 hari</td><td className="p-3">Rp 13.000</td></tr>
                <tr className="border-t border-gray-100"><td className="p-3">Ninja Xpress</td><td className="p-3">2-3 hari</td><td className="p-3">Rp 12.000</td></tr>
                <tr className="border-t border-gray-100"><td className="p-3">GoSend Instant</td><td className="p-3">Hari ini</td><td className="p-3">Rp 35.000</td></tr>
              </tbody>
            </table>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-800">
              <strong>Gratis Ongkir!</strong> Untuk pembelian minimal Rp 200.000 ke seluruh Indonesia (kecuali GoSend Instant).
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Catatan:</h4>
              <ul className="space-y-1 text-xs text-gray-500">
                <li>• Pesanan diproses setiap hari kerja (Senin-Sabtu)</li>
                <li>• Cut-off pengiriman: jam 15:00 WIB</li>
                <li>• Nomor resi dikirim via email & WhatsApp setelah barang dikirim</li>
              </ul>
            </div>
          </div>
        </InfoCard>

        {/* Pengembalian */}
        <InfoCard id="pengembalian" icon={RotateCcw} title="Pengembalian & Refund">
          <div className="space-y-4 text-sm text-gray-700">
            <p>Kami memberikan garansi 30 hari tukar barang untuk semua produk. Pengembalian diterima jika:</p>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <ChevronRight className="size-3.5 text-brand-500 shrink-0 mt-0.5" />
                <span>Barang yang diterima <strong>tidak sesuai pesanan</strong> (salah produk/varian)</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="size-3.5 text-brand-500 shrink-0 mt-0.5" />
                <span>Barang <strong>rusak/cacat</strong> saat diterima (sertakan foto/video unboxing)</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="size-3.5 text-brand-500 shrink-0 mt-0.5" />
                <span>Barang <strong>tidak berfungsi</strong> sesuai deskripsi produk</span>
              </li>
            </ul>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Prosedur Pengembalian:</h4>
              <ol className="list-decimal list-inside space-y-1 text-xs text-gray-600">
                <li>Hubungi CS kami via WhatsApp dalam 7 hari setelah barang diterima</li>
                <li>Kirim foto/video barang + nomor pesanan</li>
                <li>Tim kami akan review dalam 1×24 jam</li>
                <li>Jika disetujui, kirim balik barang ke alamat kami (ongkir ditanggung kami)</li>
                <li>Refund/penggantian diproses dalam 3-5 hari kerja</li>
              </ol>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-800">
              <strong>Tidak bisa dikembalikan:</strong> Produk yang sudah dipakai, dimodifikasi, atau kemasan dibuka tanpa video unboxing.
            </div>
          </div>
        </InfoCard>

        {/* FAQ */}
        <InfoCard id="faq" icon={HelpCircle} title="FAQ (Pertanyaan Umum)">
          <div className="space-y-4">
            {[
              { q: 'Apakah produk di Erset Store original?', a: 'Ya, semua produk kami 100% original dan import langsung dari supplier terpercaya. Kami memberikan garansi 30 hari untuk setiap produk.' },
              { q: 'Berapa lama pesanan saya diproses?', a: 'Pesanan diproses dalam 1 hari kerja setelah pembayaran dikonfirmasi. Cut-off jam 15:00 WIB.' },
              { q: 'Bagaimana cara melacak pesanan?', a: 'Setelah barang dikirim, nomor resi akan dikirim ke email dan WhatsApp kamu. Gunakan nomor resi untuk tracking di website kurir.' },
              { q: 'Apakah bisa COD?', a: 'Ya, COD tersedia untuk area Jabodetabek dan beberapa kota besar. Pilih opsi COD saat checkout.' },
              { q: 'Bagaimana jika barang tidak sampai?', a: 'Hubungi CS kami dengan nomor pesanan. Kami akan bantu lacak dan selesaikan masalah pengiriman.' },
              { q: 'Apakah ada minimal pembelian?', a: 'Tidak ada minimal pembelian. Tapi untuk gratis ongkir, minimal belanja Rp 200.000.' },
              { q: 'Kode promo yang tersedia?', a: 'ERSET10 (diskon 10%), NEWUSER (diskon 15% untuk pengguna baru), FLASH50K (potongan Rp 50.000).' },
            ].map(({ q, a }) => (
              <div key={q} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                <h4 className="text-sm font-bold text-gray-900 mb-1">{q}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </InfoCard>

        {/* Hubungi Kami */}
        <InfoCard id="hubungi-kami" icon={MessageCircle} title="Hubungi Kami">
          <div className="space-y-4 text-sm text-gray-700">
            <p>Tim customer service kami siap membantu kamu 24 jam setiap hari. Jangan ragu untuk menghubungi kami!</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <ContactItem icon={MessageCircle} label="WhatsApp" value="0812-3456-7890" href="https://wa.me/6281234567890" />
              <ContactItem icon={Mail} label="Email" value="cs@ersetstore.id" href="mailto:cs@ersetstore.id" />
              <ContactItem icon={Phone} label="Telepon" value="021-1234-5678" href="tel:02112345678" />
              <ContactItem icon={Clock} label="Jam Operasional" value="24 Jam / 7 Hari" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                <MapPin className="size-4 text-brand-500" />
                Alamat Gudang
              </h4>
              <p className="text-xs text-gray-600">
                Jl. Raya Import No. 88, Kelurahan Maju Jaya,<br />
                Kecamatan Cepat Sampai, Jakarta Selatan 12345
              </p>
            </div>
          </div>
        </InfoCard>
      </section>
    </>
  );
}

function InfoCard({ id, icon: Icon, title, children }: { id: string; icon: any; title: string; children: React.ReactNode }) {
  return (
    <div id={id} className="card p-5 sm:p-7 scroll-mt-32">
      <div className="flex items-center gap-3 mb-5">
        <div className="size-10 grid place-items-center bg-brand-50 text-brand-500 rounded-xl">
          <Icon className="size-5" />
        </div>
        <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function ContactItem({ icon: Icon, label, value, href }: { icon: any; label: string; value: string; href?: string }) {
  const content = (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
      <Icon className="size-4 text-brand-500 shrink-0" />
      <div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{label}</div>
        <div className="text-sm font-semibold text-gray-900">{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">{content}</a> : content;
}
