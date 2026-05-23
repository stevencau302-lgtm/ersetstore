import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const API_BASE = 'https://api.binderbyte.com/v1';

// Supabase client for reading settings
const supabaseUrl = 'https://qjklcbicacbfqeitfzau.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqa2xjYmljYWNiZnFlaXRmemF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNDE4MjYsImV4cCI6MjA5NDgxNzgyNn0.uIpmrfLh6hdntkADcBINNZ3xQV9gjzs0BACXPpw8aJk';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function getApiKey(): Promise<string> {
  // Try from Supabase store_settings first
  try {
    const { data } = await supabase
      .from('store_settings')
      .select('value')
      .eq('key', 'binderbyte_api_key')
      .single();

    if (data?.value) return data.value;
  } catch (e) {
    console.log('[locations] Supabase fetch failed, using fallback');
  }

  // Fallback to env var
  if (process.env.BINDERBYTE_API_KEY) return process.env.BINDERBYTE_API_KEY;

  // Hardcoded fallback — BinderByte free tier key
  return 'b52da0eef743ef42b031dc8b20880997a24e37eebb41f4bec30e0f3ee2fa93c4';
}

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

  const API_KEY = await getApiKey();
  // API key selalu ada karena ada hardcoded fallback
  console.log('[locations] Using API key (first 8 chars):', API_KEY.slice(0, 8) + '...');

  try {
    const url = `${API_BASE}/locations?search=${encodeURIComponent(search.trim())}&api_key=${API_KEY}`;
    const response = await fetch(url);

    const rawText = await response.text();

    if (!rawText || rawText.trim().length === 0) {
      return res.status(502).json({ error: 'BinderByte returned empty response. Cek API key di Admin → Pengaturan.' });
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
