import { Link } from 'react-router-dom';
import { Home, Frown } from 'lucide-react';
import PageHeader from '../components/PageHeader';

export default function NotFound() {
  return (
    <>
      <PageHeader title="Halaman Tidak Ditemukan" breadcrumb={[{ label: 'Beranda', to: '/' }, { label: '404' }]} />
      <section className="container-x pb-20">
        <div className="card text-center py-20 px-6 max-w-xl mx-auto">
          <Frown className="size-20 mx-auto text-gray-400 mb-5" />
          <h2 className="text-3xl font-extrabold mb-3">404</h2>
          <p className="text-gray-500 mb-8">
            Halaman yang kamu cari tidak ada atau sudah dipindahkan.
          </p>
          <Link to="/" className="btn btn-primary btn-md">
            <Home className="size-4" />
            Kembali ke Beranda
          </Link>
        </div>
      </section>
    </>
  );
}
