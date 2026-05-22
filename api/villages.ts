import type { VercelRequest, VercelResponse } from '@vercel/node';

const API_BASE = 'https://use.api.co.id/regional/indonesia';
const API_KEY = process.env.API_CO_ID_KEY || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { search } = req.query;

  if (!search || typeof search !== 'string' || search.trim().length < 3) {
    return res.status(400).json({ error: 'Parameter "search" minimal 3 karakter' });
  }

  if (!API_KEY) {
    return res.status(500).json({ error: 'API key belum di-configure di environment variables' });
  }

  try {
    const url = `${API_BASE}/villages?search=${encodeURIComponent(search.trim())}`;
    const response = await fetch(url, {
      headers: { 'x-api-co-id': API_KEY },
    });

    if (response.status === 401) {
      return res.status(401).json({ error: 'API key tidak valid' });
    }
    if (response.status === 429) {
      return res.status(429).json({ error: 'Rate limit tercapai, coba lagi nanti' });
    }
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Gagal mengambil data wilayah' });
    }

    const data = await response.json();

    // Map response ke format yang kita butuhkan
    // Expected format dari api.co.id: { status, result: [...] }
    const villages = (data.result || data.data || []).map((v: any) => ({
      village_code: v.village_code || v.code || '',
      village_name: v.village_name || v.name || '',
      district_name: v.district_name || v.district || '',
      city_name: v.city_name || v.city || '',
      province_name: v.province_name || v.province || '',
      postal_code: v.postal_code || v.zip_code || '',
      // Full label for display
      label: `${v.village_name || v.name || ''}, ${v.district_name || v.district || ''}, ${v.city_name || v.city || ''}, ${v.province_name || v.province || ''}`,
    }));

    return res.status(200).json({ status: 'success', result: villages });
  } catch (err: any) {
    console.error('Village search error:', err);
    return res.status(500).json({ error: 'Internal server error: ' + (err.message || 'Unknown') });
  }
}
