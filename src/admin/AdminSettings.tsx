import { useEffect, useState } from 'react';
import { Save, Loader2, Settings, Key, MapPin, Store, Eye, EyeOff, CheckCircle2, Truck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import LocationSearch from '../components/LocationSearch';
import { type Location } from '../lib/shipping';

interface Setting {
  key: string;
  value: string;
}

// Daftar kurir api.co.id (courier_code harus sama persis dengan respons API)
const COURIERS = [
  { code: 'JNE', label: 'JNE Express' },
  { code: 'JNECargo', label: 'JNE Cargo' },
  { code: 'SiCepat', label: 'SiCepat Express' },
  { code: 'SiCepatCargo', label: 'SiCepat Cargo' },
  { code: 'JT', label: 'J&T Express' },
  { code: 'iDexpress', label: 'iDexpress' },
  { code: 'iDlite', label: 'iDlite' },
  { code: 'iDexpressCargo', label: 'iDexpress Cargo' },
  { code: 'SAP', label: 'SAP Express' },
  { code: 'SAPLite', label: 'SAP Lite' },
  { code: 'SapCargo', label: 'SAP Cargo' },
  { code: 'anteraja', label: 'AnterAja' },
  { code: 'lion', label: 'Lion Parcel' },
  { code: 'Ninja', label: 'Ninja Express' },
  { code: 'paxel', label: 'Paxel' },
];

const SETTINGS_CONFIG = [
  {
    key: 'api_co_id_key',
    label: 'API Key api.co.id',
    description: 'API key untuk cek ongkir real-time (header x-api-co-id). Dapatkan di dashboard.api.co.id',
    icon: Key,
    secret: true,
    placeholder: 'Masukkan API key api.co.id...',
  },
  {
    key: 'store_origin_village_code',
    label: 'Lokasi Asal Toko',
    description: 'Cari & pilih desa/kelurahan lokasi toko. Kode dipakai otomatis untuk hitung ongkir.',
    icon: MapPin,
    secret: false,
    placeholder: '3172051003',
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
  const [originLoc, setOriginLoc] = useState<Location | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);
    const { data } = await supabase.from('store_settings').select('key, value');
    const map: Record<string, string> = {};
    (data || []).forEach((s: Setting) => { map[s.key] = s.value; });
    setSettings(map);
    // Set lokasi asal toko untuk ditampilkan di pencarian
    if (map['store_origin_village_code']) {
      setOriginLoc({
        id: map['store_origin_village_code'],
        type: 'village',
        label: map['store_origin_label'] || map['store_origin_village_code'],
      });
    }
    setLoading(false);
  }

  // Saat admin memilih desa toko dari pencarian
  function handleOriginChange(loc: Location | null) {
    setOriginLoc(loc);
    setSettings(prev => ({
      ...prev,
      store_origin_village_code: loc?.id || '',
      store_origin_label: loc?.label || '',
    }));
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

      // Simpan juga label lokasi asal (biar tampil saat dibuka lagi)
      await supabase
        .from('store_settings')
        .upsert({ key: 'store_origin_label', value: settings['store_origin_label'] || '', updated_at: new Date().toISOString() }, { onConflict: 'key' });

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
          const isOrigin = config.key === 'store_origin_village_code';

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

              {isOrigin ? (
                <div>
                  <LocationSearch
                    label=""
                    placeholder="Ketik nama desa/kelurahan toko (min 3 huruf)..."
                    value={originLoc}
                    onChange={handleOriginChange}
                  />
                  {originLoc && (
                    <p className="text-[11px] text-gray-400 mt-1.5">
                      Kode desa: <span className="font-mono font-semibold text-gray-600">{originLoc.id}</span>
                    </p>
                  )}
                </div>
              ) : (
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
              )}
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
          <li>Daftar akun di <a href="https://dashboard.api.co.id" target="_blank" rel="noopener" className="underline font-semibold">dashboard.api.co.id</a></li>
          <li>Aktifkan produk Indonesia Expedition Cost &amp; Regional, lalu copy API key-nya</li>
          <li>Paste di field "API Key api.co.id" di atas</li>
          <li>Isi kode desa toko (10 digit) di field Kode Desa Asal</li>
          <li>Klik Simpan — ongkir di checkout langsung aktif!</li>
        </ol>
      </div>
    </div>
  );
}
