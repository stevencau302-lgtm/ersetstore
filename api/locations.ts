import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// ============================================
// PENCARIAN LOKASI via api.co.id (Regional Wilayah Indonesia)
// Docs: https://docs.api.co.id/products/indonesia-regional
// Auth: header x-api-co-id
// Mengembalikan DESA dengan kode 10 digit, dipakai sebagai
// destination_village_code di cek ongkir.
// ============================================
const REGIONAL_BASE = 'https://use.api.co.id/regional/indonesia';

const supabaseUrl = 'https://qjklcbicacbfqeitfzau.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqa2xjYmljYWNiZnFlaXRmemF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNDE4MjYsImV4cCI6MjA5NDgxNzgyNn0.uIpmrfLh6hdntkADcBINNZ3xQV9gjzs0BACXPpw8aJk';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function getApiKey(): Promise<string> {
  try {
    const { data } = await supabase
      .from('store_settings')
      .select('value')
      .eq('key', 'api_co_id_key')
      .single();
    if (data?.value) return data.value;
  } catch (e) {
    console.log('[locations] Supabase fetch failed, using fallback');
  }
  return process.env.API_CO_ID_KEY || '';
}

// Ambil array data dari berbagai bentuk respons
function getList(json: any): any[] {
  if (Array.isArray(json)) return json;
  return json?.result ?? json?.data ?? [];
}

// Ubah satu item regional jadi Location { id, type, label }
// Hanya item dengan kode desa 10 digit yang dipakai.
function toLocation(item: any): { id: string; type: string; label: string } | null {
  const code = String(item.code ?? item.village_code ?? item.id ?? '');
  if (!/^\d{10}$/.test(code)) return null; // hanya level desa (10 digit)

  const name = item.name ?? item.village_name ?? '';
  const parts = [
    name,
    item.district_name ?? item.district ?? null,
    item.regency_name ?? item.regency ?? item.city_name ?? null,
    item.province_name ?? item.province ?? null,
  ].filter(Boolean);

  const postal = item.postal_code ?? item.zip_code ?? null;
  const label = parts.join(', ') + (postal ? ` (${postal})` : '');

  return { id: code, type: item.type ?? 'village', label: label || code };
}

async function fetchRegional(path: string, apiKey: string) {
  const resp = await fetch(`${REGIONAL_BASE}${path}`, { headers: { 'x-api-co-id': apiKey } });
  const text = await resp.text();
  let json: any = {};
  try { json = text ? JSON.parse(text) : {}; } catch { /* ignore */ }
  return { ok: resp.ok, status: resp.status, json };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { search } = req.query;
  if (!search || typeof search !== 'string' || search.trim().length < 3) {
    return res.status(400).json({ error: 'Parameter "search" minimal 3 karakter' });
  }
  const q = encodeURIComponent(search.trim());

  const apiKey = await getApiKey();
  if (!apiKey) {
    return res.status(500).json({ error: 'API key api.co.id belum diatur. Buka Admin → Pengaturan.' });
  }

  try {
    // 1) Coba endpoint pencarian global (jika tersedia di paket akun)
    let r = await fetchRegional(`/search?search=${q}&query=${q}`, apiKey);

    // 2) Fallback: filter daftar desa berdasarkan nama (tersedia di tier non-premium)
    if (!r.ok && (r.status === 401 || r.status === 403 || r.status === 404)) {
      r = await fetchRegional(`/villages?name=${q}&search=${q}`, apiKey);
    }

    if (!r.ok) {
      return res.status(r.status).json({ error: r.json?.message || `Gagal mencari lokasi (HTTP ${r.status})` });
    }

    const result = getList(r.json)
      .map(toLocation)
      .filter((x): x is { id: string; type: string; label: string } => x !== null)
      .slice(0, 30);

    return res.status(200).json({ status: 'success', result });
  } catch (err: any) {
    console.error('Location search error:', err);
    return res.status(500).json({ error: 'Internal server error: ' + (err.message || 'Unknown') });
  }
}
