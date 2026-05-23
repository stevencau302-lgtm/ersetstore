import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const API_BASE = 'https://api.binderbyte.com/v1';

// Supabase client for reading settings
const supabaseUrl = 'https://qjklcbicacbfqeitfzau.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqa2xjYmljYWNiZnFlaXRmemF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNDE4MjYsImV4cCI6MjA5NDgxNzgyNn0.uIpmrfLh6hdntkADcBINNZ3xQV9gjzs0BACXPpw8aJk';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Semua kurir yang didukung BinderByte (dipanggil satu per satu)
const ALL_COURIER_LIST = ['jne', 'sicepat', 'jnt', 'ninja', 'anteraja', 'pos', 'tiki', 'lion', 'sap', 'ide', 'wahana', 'spx'];

async function getSettings(): Promise<{ apiKey: string; originId: string }> {
  let map: Record<string, string> = {};
  
  try {
    const { data } = await supabase
      .from('store_settings')
      .select('key, value')
      .in('key', ['binderbyte_api_key', 'store_origin_id']);
    (data || []).forEach((s: any) => { map[s.key] = s.value; });
  } catch (e) {
    console.log('[shipping-cost] Supabase fetch failed, using fallback');
  }

  return {
    apiKey: map['binderbyte_api_key'] || process.env.BINDERBYTE_API_KEY || 'b52da0eef743ef42b031dc8b20880997a24e37eebb41f4bec30e0f3ee2fa93c4',
    originId: map['store_origin_id'] || 'dist_31.72.05',
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Support both GET and POST
  let origin: string | undefined;
  let destination: string | undefined;
  let weight: string | undefined;
  let courier: string | undefined;

  if (req.method === 'GET') {
    origin = req.query.origin as string;
    destination = req.query.destination as string;
    weight = req.query.weight as string;
    courier = req.query.courier as string;
  } else if (req.method === 'POST') {
    origin = req.body?.origin;
    destination = req.body?.destination;
    weight = req.body?.weight;
    courier = req.body?.courier;
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validasi
  if (!destination) return res.status(400).json({ error: 'Parameter "destination" wajib diisi' });
  if (!weight || Number(weight) <= 0) return res.status(400).json({ error: 'Parameter "weight" harus > 0 (gram)' });

  // Get settings from Supabase
  const settings = await getSettings();

  if (!settings.apiKey) {
    console.warn('[shipping-cost] No API key found — this should not happen with fallback');
    return res.status(500).json({ error: 'API key configuration error' });
  }

  // Use origin from request, or fallback to store setting
  if (!origin) origin = settings.originId;

  // Frontend kirim dalam gram, BinderByte mau kilogram. Minimum 1 kg
  const weightKg = Math.max(1, Math.ceil(Number(weight) / 1000));

  // Default: semua kurir populer
  const courierList = courier ? courier.split(',').map(c => c.trim()).filter(Boolean) : ALL_COURIER_LIST;

  try {
    // Fetch setiap kurir satu per satu secara parallel
    const fetchCourier = async (c: string) => {
      try {
        const url = `${API_BASE}/cost?api_key=${settings.apiKey}&origin=${encodeURIComponent(origin!)}&destination=${encodeURIComponent(destination!)}&weight=${weightKg}&courier=${c}`;
        const resp = await fetch(url);
        const text = await resp.text();
        if (!text || text.trim().length === 0) return [];
        const json = JSON.parse(text);
        if (json.code !== '200' && json.code !== 200) return [];
        return json.data?.results || [];
      } catch {
        return [];
      }
    };

    const allResults = await Promise.all(courierList.map(fetchCourier));
    const results = allResults.flat();
    const normalized: any[] = [];

    for (const courierResult of results) {
      const costs = courierResult.costs || [];
      for (const cost of costs) {
        const price = Number(cost.price) || 0;
        if (price > 0) {
          normalized.push({
            courier_code: courierResult.code || cost.code || '',
            courier_name: courierResult.name || cost.name || '',
            service: cost.service || '',
            type: cost.type || '',
            price,
            estimated: cost.estimated || null,
          });
        }
      }
    }

    // Sort by price ascending
    normalized.sort((a, b) => a.price - b.price);

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
