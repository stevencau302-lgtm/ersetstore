import { useEffect, useState } from 'react';
import { Save, Loader2, Settings, Key, MapPin, Store, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Setting {
  key: string;
  value: string;
}

const SETTINGS_CONFIG = [
  {
    key: 'binderbyte_api_key',
    label: 'BinderByte API Key',
    description: 'API key untuk cek ongkir real-time. Daftar gratis di binderbyte.com',
    icon: Key,
    secret: true,
    placeholder: 'Masukkan API key BinderByte...',
  },
  {
    key: 'store_origin_id',
    label: 'Lokasi Asal Toko (Origin ID)',
    description: 'ID lokasi BinderByte untuk alamat toko. Contoh: dist_31.72.05 (Pademangan, Jakarta)',
    icon: MapPin,
    secret: false,
    placeholder: 'dist_31.72.05',
  },
  {
    key: 'store_name',
    label: 'Nama Toko',
    description: 'Nama toko yang ditampilkan di berbagai tempat',
    icon: Store,
    secret: false,
    placeholder: 'ERSET GEAR LAB',
  },
];

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);
    const { data } = await supabase.from('store_settings').select('key, value');
    const map: Record<string, string> = {};
    (data || []).forEach((s: Setting) => { map[s.key] = s.value; });
    setSettings(map);
    setLoading(false);
  }

  async function saveSettings() {
    setSaving(true);
    setError('');
    setSaved(false);

    try {
      for (const config of SETTINGS_CONFIG) {
        const value = settings[config.key] || '';
        const { error: upsertError } = await supabase
          .from('store_settings')
          .upsert({ key: config.key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });

        if (upsertError) {
          setError('Gagal menyimpan ' + config.label + ': ' + upsertError.message);
          setSaving(false);
          return;
        }
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan settings');
    } finally {
      setSaving(false);
    }
  }

  const toggleSecret = (key: string) => {
    setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="size-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Settings className="size-6 text-brand-500" />
          Pengaturan Toko
        </h1>
        <p className="text-sm text-gray-500 mt-1">Kelola API key dan konfigurasi toko</p>
      </div>

      {/* Settings Form */}
      <div className="space-y-4">
        {SETTINGS_CONFIG.map((config) => {
          const Icon = config.icon;
          const isSecret = config.secret;
          const isVisible = showSecrets[config.key];

          return (
            <div key={config.key} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="size-10 rounded-xl bg-gray-100 grid place-items-center shrink-0">
                  <Icon className="size-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm">{config.label}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{config.description}</p>
                </div>
              </div>
              <div className="relative">
                <input
                  type={isSecret && !isVisible ? 'password' : 'text'}
                  value={settings[config.key] || ''}
                  onChange={(e) => setSettings(prev => ({ ...prev, [config.key]: e.target.value }))}
                  placeholder={config.placeholder}
                  className="input !pr-12"
                />
                {isSecret && (
                  <button
                    type="button"
                    onClick={() => toggleSecret(config.key)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 size-8 rounded-lg hover:bg-gray-100 grid place-items-center transition-colors"
                  >
                    {isVisible ? <EyeOff className="size-4 text-gray-400" /> : <Eye className="size-4 text-gray-400" />}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={saveSettings}
          disabled={saving}
          className="btn btn-primary btn-md disabled:opacity-50"
        >
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
        </button>

        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium animate-fade-in">
            <CheckCircle2 className="size-4" />
            Tersimpan!
          </span>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <strong className="block mb-1">💡 Cara setup:</strong>
        <ol className="list-decimal list-inside space-y-1 text-xs">
          <li>Daftar akun di <a href="https://binderbyte.com" target="_blank" rel="noopener" className="underline font-semibold">binderbyte.com</a></li>
          <li>Copy API key dari dashboard BinderByte</li>
          <li>Paste di field "BinderByte API Key" di atas</li>
          <li>Klik Simpan — ongkir di checkout langsung aktif!</li>
        </ol>
      </div>
    </div>
  );
}
