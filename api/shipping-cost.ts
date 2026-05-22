import type { VercelRequest, VercelResponse } from '@vercel/node';

const API_BASE = 'https://use.api.co.id/expedition';
const API_KEY = process.env.API_CO_ID_KEY || '';

export interface ShippingRate {
  courier_code: string;
  courier_name: string;
  price: number;
  weight: number;
  estimation: string | null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { origin_village_code, destination_village_code, weight } = req.query;

  // Validasi input
  if (!origin_village_code || typeof origin_village_code !== 'string') {
    return res.status(400).json({ error: 'origin_village_code wajib diisi (10 digit)' });
  }
  if (!destination_village_code || typeof destination_village_code !== 'string') {
    return res.status(400).json({ error: 'destination_village_code wajib diisi (10 digit)' });
  }
  if (!/^\d{10}$/.test(origin_village_code)) {
    return res.status(400).json({ error: 'origin_village_code harus 10 digit angka' });
  }
  if (!/^\d{10}$/.test(destination_village_code)) {
    return res.status(400).json({ error: 'destination_village_code harus 10 digit angka' });
  }

  const weightNum = Number(weight);
  if (!weight || isNaN(weightNum) || weightNum <= 0) {
    return res.status(400).json({ error: 'weight harus angka > 0 (dalam kg)' });
  }

  if (!API_KEY) {
    return res.status(500).json({ error: 'API key belum di-configure di environment variables' });
  }

  try {
    const url = `${API_BASE}/shipping-cost?origin_village_code=${origin_village_code}&destination_village_code=${destination_village_code}&weight=${weightNum}`;
    const response = await fetch(url, {
      headers: { 'x-api-co-id': API_KEY },
    });

    if (response.status === 401) {
      return res.status(401).json({ error: 'API key tidak valid' });
    }
    if (response.status === 404) {
      return res.status(404).json({ error: 'Kode desa tidak ditemukan' });
    }
    if (response.status === 429) {
      return res.status(429).json({ error: 'Rate limit tercapai, coba lagi nanti' });
    }
    if (!response.ok) {
      const errBody = await response.text();
      return res.status(response.status).json({ error: 'Gagal mengambil ongkir: ' + errBody });
    }

    const data = await response.json();

    // Filter out zero-price couriers
    const rates: ShippingRate[] = (data.result || [])
      .filter((r: any) => r.price > 0)
      .map((r: any) => ({
        courier_code: r.courier_code || '',
        courier_name: r.courier_name || '',
        price: r.price || 0,
        weight: r.weight || weightNum,
        estimation: r.estimation || null,
      }));

    return res.status(200).json({
      status: 'success',
      origin_village_code,
      destination_village_code,
      weight: weightNum,
      result: rates,
    });
  } catch (err: any) {
    console.error('Shipping cost error:', err);
    return res.status(500).json({ error: 'Internal server error: ' + (err.message || 'Unknown') });
  }
}
