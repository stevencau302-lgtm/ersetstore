import type { VercelRequest, VercelResponse } from '@vercel/node';

const API_BASE = 'https://api.binderbyte.com/v1';
const API_KEY = process.env.BINDERBYTE_API_KEY || '';

// Semua kurir yang didukung BinderByte
const ALL_COURIERS = 'jne,pos,tiki,sicepat,anteraja,lion,ninja,sap,ide,jnt,wahana,spx';

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
  if (!origin) return res.status(400).json({ error: 'Parameter "origin" wajib diisi' });
  if (!destination) return res.status(400).json({ error: 'Parameter "destination" wajib diisi' });
  if (!weight || Number(weight) <= 0) return res.status(400).json({ error: 'Parameter "weight" harus > 0 (gram)' });

  // Default: semua kurir
  if (!courier) courier = ALL_COURIERS;

  if (!API_KEY) {
    return res.status(500).json({ error: 'BINDERBYTE_API_KEY belum di-configure di environment variables' });
  }

  try {
    const url = `${API_BASE}/cost?api_key=${API_KEY}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&weight=${weight}&courier=${encodeURIComponent(courier)}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.code !== '200' && data.code !== 200) {
      return res.status(Number(data.code) || 400).json({ error: data.message || 'Gagal menghitung ongkir' });
    }

    // Normalize response untuk frontend
    const results = data.data?.results || [];
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
      origin: data.data?.origin || null,
      destination: data.data?.destination || null,
      weight: data.data?.weight || weight,
      result: normalized,
    });
  } catch (err: any) {
    console.error('Shipping cost error:', err);
    return res.status(500).json({ error: 'Internal server error: ' + (err.message || 'Unknown') });
  }
}
