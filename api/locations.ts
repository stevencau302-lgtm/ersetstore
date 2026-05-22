import type { VercelRequest, VercelResponse } from '@vercel/node';

const API_BASE = 'https://api.binderbyte.com/v1';
const API_KEY = process.env.BINDERBYTE_API_KEY || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
    return res.status(500).json({ error: 'BINDERBYTE_API_KEY belum di-configure di environment variables' });
  }

  try {
    const url = `${API_BASE}/locations?search=${encodeURIComponent(search.trim())}&api_key=${API_KEY}`;
    const response = await fetch(url);

    // Read as text first to avoid JSON parse crash on empty/invalid response
    const rawText = await response.text();

    if (!rawText || rawText.trim().length === 0) {
      return res.status(502).json({ error: 'BinderByte returned empty response. Cek API key valid atau belum.' });
    }

    let data: any;
    try {
      data = JSON.parse(rawText);
    } catch {
      return res.status(502).json({ error: 'BinderByte response bukan JSON: ' + rawText.slice(0, 200) });
    }

    if (data.code !== '200' && data.code !== 200) {
      return res.status(Number(data.code) || 400).json({ error: data.message || 'Gagal mencari lokasi' });
    }

    return res.status(200).json({
      status: 'success',
      result: data.data || [],
    });
  } catch (err: any) {
    console.error('Location search error:', err);
    return res.status(500).json({ error: 'Internal server error: ' + (err.message || 'Unknown') });
  }
}
