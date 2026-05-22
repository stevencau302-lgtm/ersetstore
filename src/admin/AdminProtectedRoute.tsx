import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

// Daftar email admin — tambahin email yang boleh akses admin panel
const ADMIN_EMAILS = [
  'admin@ersetstore.com',
  'stevencau302@gmail.com',
];

export function isAdmin(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export default function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="size-10 animate-spin text-brand-500 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Memuat panel admin...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/masuk" replace />;
  }

  if (!isAdmin(user.email)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="card p-8 text-center max-w-md mx-4">
          <div className="size-16 rounded-full bg-red-50 grid place-items-center mx-auto mb-4">
            <span className="text-3xl">🚫</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Akses Ditolak</h2>
          <p className="text-gray-500 text-sm mb-6">
            Kamu tidak memiliki akses ke panel admin. Hubungi administrator untuk mendapatkan akses.
          </p>
          <a href="/" className="btn btn-primary btn-md">Kembali ke Toko</a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
