import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import PageHeader from '../components/PageHeader';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const breadcrumb = [
    { label: 'Beranda', to: '/' },
    { label: 'Masuk' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);
    if (error) {
      setError(error);
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <PageHeader title="Masuk" breadcrumb={breadcrumb} />
      <div className="container-x pb-16">
        <div className="max-w-md mx-auto">
          <div className="card p-8">
            <div className="text-center mb-6">
              <div className="size-14 bg-brand-50 rounded-full grid place-items-center mx-auto mb-3">
                <LogIn className="size-6 text-brand-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Masuk ke Akun</h2>
              <p className="text-sm text-gray-500 mt-1">Masuk untuk melanjutkan belanja di ERSET</p>
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
                {loading ? <Loader2 className="size-5 animate-spin" /> : 'Masuk'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Belum punya akun?{' '}
              <Link to="/daftar" className="text-brand-500 font-semibold hover:underline">Daftar sekarang</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
