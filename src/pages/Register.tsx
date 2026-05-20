import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, UserPlus, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import PageHeader from '../components/PageHeader';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const breadcrumb = [
    { label: 'Beranda', to: '/' },
    { label: 'Daftar' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Password tidak cocok');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password);
    if (error) {
      setError(error);
      setLoading(false);
    } else {
      // Tanpa email confirm, langsung login & redirect
      navigate('/');
    }
  };

  if (success) {
    return (
      <>
        <PageHeader title="Daftar" breadcrumb={breadcrumb} />
        <div className="container-x pb-16">
          <div className="max-w-md mx-auto">
            <div className="card p-8 text-center">
              <div className="size-14 bg-emerald-50 rounded-full grid place-items-center mx-auto mb-3">
                <CheckCircle2 className="size-6 text-emerald-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Pendaftaran Berhasil!</h2>
              <p className="text-gray-500 text-sm mt-2">
                Silakan cek email kamu untuk verifikasi akun. Kamu akan dialihkan ke halaman masuk...
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Daftar" breadcrumb={breadcrumb} />
      <div className="container-x pb-16">
        <div className="max-w-md mx-auto">
          <div className="card p-8">
            <div className="text-center mb-6">
              <div className="size-14 bg-brand-50 rounded-full grid place-items-center mx-auto mb-3">
                <UserPlus className="size-6 text-brand-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Buat Akun Baru</h2>
              <p className="text-sm text-gray-500 mt-1">Daftar untuk mulai belanja di ERSET</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input pl-10"
                    placeholder="email@contoh.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="input pl-10"
                    placeholder="Minimal 6 karakter"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1.5">Konfirmasi Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="input pl-10"
                    placeholder="Ulangi password"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg w-full"
              >
                {loading ? <Loader2 className="size-5 animate-spin" /> : 'Daftar'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Sudah punya akun?{' '}
              <Link to="/masuk" className="text-brand-500 font-semibold hover:underline">Masuk di sini</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
