import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// ============================================
// CEK ONGKIR via api.co.id (Indonesia Expedition Cost)
// Docs: https://docs.api.co.id/products/indonesia-expedition-cost
// Auth: header x-api-co-id
// ============================================
const EXPEDITION_BASE = 'https://use.api.co.id/expedition';

// Supabase client for reading settings
const supabaseUrl = 'https://qjklcbicacbfqeitfzau.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqa2xjYmljYWNiZnFlaXRmemF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNDE4MjYsImV4cCI6MjA5NDgxNzgyNn0.uIpmrfLh6hdntkADcBINNZ3xQV9gjzs0BACXPpw8aJk';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function getSettings(): Promise<{ apiKey: string; originVillageCode: string; enabledCouriers: string[] }> {
  const map: Record<string, string> = {};
  try {
    const { data } = await supabase
      .from('store_settings')
      .select('key, value')
      .in('key', ['api_co_id_key', 'store_origin_village_code', 'enabled_couriers']);
    (data || []).forEach((s: any) => { map[s.key] = s.value; });
  } catch (e) {
    console.log('[shipping-cost] Supabase fetch failed, using fallback');
  }

  return {
    apiKey: map['api_co_id_key'] || process.env.API_CO_ID_KEY || '',
    // Default origin: Pademangan, Jakarta (10 digit)
    originVillageCode: map['store_origin_village_code'] || process.env.STORE_ORIGIN_VILLAGE_CODE || '3172051003',
    // Daftar courier_code yang diaktifkan admin. Kosong = tampilkan semua.
    enabledCouriers: (map['enabled_couriers'] || '').split(',').map((s) => s.trim()).filter(Boolean),
  };
}

// Cari array kurir di mana pun lokasinya dalam respons
// (bentuk respons api.co.id bisa beda dari dokumentasi, jadi defensif).
function extractCourierArray(json: any): any[] | null {
  if (Array.isArray(json)) return json;
  if (!json || typeof json !== 'object') return null;

  // Lokasi umum
  const candidates = [json.result, json.data, json.results, json.couriers, json.rates];
  for (const c of candidates) if (Array.isArray(c)) return c;

  // Satu level lebih dalam (mis. result.results, data.result, dll)
  for (const v of Object.values(json)) {
    if (Array.isArray(v)) return v;
    if (v && typeof v === 'object') {
      for (const vv of Object.values(v as Record<string, unknown>)) {
        if (Array.isArray(vv)) return vv as any[];
      }
    }
  }
  return null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  let origin: string | undefined;
  let destination: string | undefined;
  let weight: string | undefined;

  if (req.method === 'GET') {
    origin = req.query.origin as string;
    destination = req.query.destination as string;
    weight = req.query.weight as string;
  } else if (req.method === 'POST') {
    origin = req.body?.origin;
    destination = req.body?.destination;
    weight = req.body?.weight;
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validasi
  if (!destination) return res.status(400).json({ error: 'Parameter "destination" (kode desa) wajib diisi' });
  if (!/^\d{10}$/.test(destination)) return res.status(400).json({ error: 'destination harus kode desa 10 digit' });
  if (!weight || Number(weight) <= 0) return res.status(400).json({ error: 'Parameter "weight" harus > 0 (gram)' });

  const settings = await getSettings();
  if (!settings.apiKey) {
    return res.status(500).json({ error: 'API key api.co.id belum diatur. Buka Admin → Pengaturan.' });
  }

  // Origin dari request, atau fallback ke setting toko
  if (!origin) origin = settings.originVillageCode;
  if (!/^\d{10}$/.test(origin)) {
    return res.status(500).json({ error: 'Kode desa asal toko tidak valid (harus 10 digit). Cek Admin → Pengaturan.' });
  }

  // Frontend kirim gram, api.co.id mau kilogram. Minimum 1 kg.
  const weightKg = Math.max(1, Math.ceil(Number(weight) / 1000));

  try {
    const url = `${EXPEDITION_BASE}/shipping-cost`
      + `?origin_village_code=${encodeURIComponent(origin)}`
      + `&destination_village_code=${encodeURIComponent(destination)}`
      + `&weight=${weightKg}`;

    const resp = await fetch(url, { headers: { 'x-api-co-id': settings.apiKey } });
    const text = await resp.text();

    let json: any;
    try {
      json = text ? JSON.parse(text) : {};
    } catch {
      return res.status(502).json({ error: 'Response api.co.id bukan JSON: ' + text.slice(0, 200) });
    }

    if (!resp.ok) {
      return res.status(resp.status).json({ error: json?.message || `Gagal cek ongkir (HTTP ${resp.status})` });
    }

    // Cari array kurir di mana pun lokasinya dalam respons (bentuk respons
    // api.co.id bisa beda dari dokumentasi, jadi defensif).
    const list = extractCourierArray(json);

    if (!Array.isArray(list)) {
      // Tidak ketemu array — kirim info bentuk respons untuk debugging.
      const shape = json && typeof json === 'object' ? Object.keys(json).join(', ') : typeof json;
      return res.status(502).json({
        error: 'Bentuk respons ongkir tidak dikenali. Keys: [' + shape + ']. Snippet: ' + JSON.stringify(json).slice(0, 300),
      });
    }

    const normalized = list
      .filter((c) => Number(c.price) > 0)
      .map((c) => ({
        courier_code: c.courier_code || c.code || '',
        courier_name: c.courier_name || c.name || c.courier_code || '',
        service: c.service || '',
        type: '',
        price: Number(c.price) || 0,
        estimated: c.estimation ?? c.estimated ?? c.etd ?? null,
      }))
      .sort((a, b) => a.price - b.price);

    return res.status(200).json({
      status: 'success',
      origin: null,
      destination: null,
      weight: weightKg,
      result: normalized,
    });
  } catch (err: any) {
    console.error('Shipping cost error:', err);
    return res.status(500).json({ error: 'Internal server error: ' + (err.message || 'Unknown') });
  }
}
