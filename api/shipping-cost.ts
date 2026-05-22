import type { VercelRequest, VercelResponse } from '@vercel/node';

const API_BASE = 'https://api.binderbyte.com/v1';
const API_KEY = process.env.BINDERBYTE_API_KEY || '';

// Semua kurir yang didukung BinderByte (dipanggil satu per satu)
const ALL_COURIER_LIST = ['jne', 'sicepat', 'jnt', 'ninja', 'anteraja', 'pos', 'tiki', 'lion', 'sap', 'ide', 'wahana', 'spx'];

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

  // Frontend kirim dalam gram, BinderByte mau kilogram
  // Minimum 1 kg
  const weightKg = Math.max(1, Math.ceil(Number(weight) / 1000));

  // Default: semua kurir populer
  const courierList = courier ? courier.split(',').map(c => c.trim()).filter(Boolean) : ALL_COURIER_LIST;

  if (!API_KEY) {
    return res.status(500).json({ error: 'BINDERBYTE_API_KEY belum di-configure di environment variables' });
  }

  try {
    // Fetch setiap kurir satu per satu secara parallel (BinderByte nggak reliable kalo semua sekaligus)
    const fetchCourier = async (c: string) => {
      try {
        const url = `${API_BASE}/cost?api_key=${API_KEY}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&weight=${weightKg}&courier=${c}`;
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
