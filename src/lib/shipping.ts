/**
 * Shipping API Service
 * Frontend hooks & functions untuk village search dan ongkir
 */

import { useState, useEffect, useRef, useCallback } from 'react';

// ============ TYPES ============

export interface Village {
  village_code: string;
  village_name: string;
  district_name: string;
  city_name: string;
  province_name: string;
  postal_code: string;
  label: string;
}

export interface ShippingRate {
  courier_code: string;
  courier_name: string;
  price: number;
  weight: number;
  estimation: string | null;
}

export interface ShippingCostResponse {
  status: string;
  origin_village_code: string;
  destination_village_code: string;
  weight: number;
  result: ShippingRate[];
}

// ============ API CALLS ============

/** Search villages by name (min 3 chars) */
export async function searchVillages(query: string): Promise<Village[]> {
  if (!query || query.trim().length < 3) return [];

  const res = await fetch(`/api/villages?search=${encodeURIComponent(query.trim())}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Gagal mencari wilayah' }));
    throw new Error(err.error || 'Gagal mencari wilayah');
  }
  const data = await res.json();
  return data.result || [];
}

/** Fetch shipping costs between two village codes */
export async function fetchShippingCost(
  originCode: string,
  destinationCode: string,
  weight: number
): Promise<ShippingRate[]> {
  if (!originCode || !destinationCode || weight <= 0) return [];

  const params = new URLSearchParams({
    origin_village_code: originCode,
    destination_village_code: destinationCode,
    weight: weight.toString(),
  });

  const res = await fetch(`/api/shipping-cost?${params}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Gagal mengambil ongkir' }));
    throw new Error(err.error || 'Gagal mengambil ongkir');
  }
  const data: ShippingCostResponse = await res.json();
  return data.result || [];
}

// ============ HOOKS ============

/** Hook for village search with debounce */
export function useVillageSearch(debounceMs = 400) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Village[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (query.trim().length < 3) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    timeoutRef.current = setTimeout(async () => {
      try {
        const data = await searchVillages(query);
        setResults(data);
      } catch (err: any) {
        setError(err.message || 'Gagal mencari wilayah');
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
    originCode: string,
    destinationCode: string,
    weight: number
  ) => {
    if (!originCode || !destinationCode || weight <= 0) {
      setRates([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await fetchShippingCost(originCode, destinationCode, weight);
      setRates(data);
    } catch (err: any) {
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
