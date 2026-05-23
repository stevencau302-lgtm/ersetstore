/**
 * BinderByte Shipping API Service
 * Frontend hooks & functions untuk location search dan ongkir
 */

import { useState, useEffect, useRef, useCallback } from 'react';

// ============ TYPES ============

export interface Location {
  id: string;    // e.g. "village_33.22.11.2003" or "dist_36.72.08"
  type: string;  // "village" | "district" | "city"
  label: string; // "Asinan, Bawen, Semarang (50661)"
}

export interface ShippingRate {
  courier_code: string;
  courier_name: string;
  service: string;
  type: string;
  price: number;
  estimated: string | null;
}

// ============ API CALLS ============

/** Search locations by keyword (min 3 chars) */
export async function searchLocations(query: string): Promise<Location[]> {
  if (!query || query.trim().length < 3) {
    console.log('[searchLocations] SKIP: query terlalu pendek:', query);
    return [];
  }

  const url = `/api/locations?search=${encodeURIComponent(query.trim())}`;
  console.log('[searchLocations] 🔍 Fetching:', url);

  try {
    const res = await fetch(url);
    console.log('[searchLocations] Response status:', res.status, res.statusText);

    const text = await res.text();
    console.log('[searchLocations] Raw response (first 500 chars):', text.slice(0, 500));

    let data: any;
    try {
      data = JSON.parse(text);
    } catch (parseErr) {
      console.error('[searchLocations] ❌ JSON PARSE ERROR! Response bukan JSON:', text.slice(0, 200));
      throw new Error('Response bukan JSON. Kemungkinan Vercel error atau API key salah.');
    }

    if (!res.ok) {
      console.error('[searchLocations] ❌ HTTP ERROR:', res.status, data);
      throw new Error(data.error || `HTTP ${res.status}: Gagal mencari lokasi`);
    }

    console.log('[searchLocations] ✅ Success! Results:', (data.result || []).length, 'items');
    return data.result || [];
  } catch (err: any) {
    console.error('[searchLocations] ❌ FETCH FAILED:', err.message || err);
    throw err;
  }
}

/** Fetch shipping costs */
export async function fetchShippingCost(
  origin: string,
  destination: string,
  weight: number,
  courier?: string
): Promise<ShippingRate[]> {
  if (!destination || weight <= 0) return [];

  const params = new URLSearchParams({
    destination,
    weight: weight.toString(),
  });
  if (origin) params.set('origin', origin);
  if (courier) params.set('courier', courier);

  const res = await fetch(`/api/shipping-cost?${params}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}: Gagal mengambil ongkir`);
  }

  return data.result || [];
}

// ============ HOOKS ============

/** Hook for location search with debounce */
export function useLocationSearch(debounceMs = 400) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (query.trim().length < 3) {
      setResults([]);
      setLoading(false);
      setError('');
      return;
    }

    setLoading(true);
    setError('');
    console.log('[useLocationSearch] ⏳ Debouncing search for:', query);

    timeoutRef.current = setTimeout(async () => {
      console.log('[useLocationSearch] 🚀 Executing search for:', query);
      try {
        const data = await searchLocations(query);
        console.log('[useLocationSearch] ✅ Got results:', data.length);
        setResults(data);
        if (data.length === 0) {
          console.log('[useLocationSearch] ⚠️ 0 results — API mungkin belum aktif atau lokasi tidak ditemukan');
        }
      } catch (err: any) {
        console.error('[useLocationSearch] ❌ ERROR:', err.message);
        console.error('[useLocationSearch] Full error:', err);
        setError(err.message || 'Gagal mencari lokasi');
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [query, debounceMs]);

  const clear = useCallback(() => {
    setQuery('');
    setResults([]);
    setError('');
  }, []);

  return { query, setQuery, results, loading, error, clear };
}

/** Hook for fetching shipping rates */
export function useShippingRates() {
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRates = useCallback(async (
    origin: string,
    destination: string,
    weight: number,
    courier?: string
  ) => {
    console.log('[useShippingRates] fetchRates called:', { origin, destination, weight, courier });
    if (!destination || weight <= 0) {
      console.log('[useShippingRates] skipped: no destination or weight <= 0');
      setRates([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await fetchShippingCost(origin, destination, weight, courier);
      console.log('[useShippingRates] got rates:', data.length, 'items');
      setRates(data);
    } catch (err: any) {
      console.error('[useShippingRates] error:', err.message);
      setError(err.message || 'Gagal mengambil ongkir');
      setRates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearRates = useCallback(() => {
    setRates([]);
    setError('');
  }, []);

  return { rates, loading, error, fetchRates, clearRates };
}
