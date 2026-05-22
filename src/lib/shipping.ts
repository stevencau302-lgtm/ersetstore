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
  if (!query || query.trim().length < 3) return [];

  const res = await fetch(`/api/locations?search=${encodeURIComponent(query.trim())}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}: Gagal mencari lokasi`);
  }

  return data.result || [];
}

/** Fetch shipping costs */
export async function fetchShippingCost(
  origin: string,
  destination: string,
  weight: number,
  courier?: string
): Promise<ShippingRate[]> {
  if (!origin || !destination || weight <= 0) return [];

  const params = new URLSearchParams({
    origin,
    destination,
    weight: weight.toString(),
  });
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

    timeoutRef.current = setTimeout(async () => {
      try {
        const data = await searchLocations(query);
        setResults(data);
      } catch (err: any) {
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
    if (!origin || !destination || weight <= 0) {
      setRates([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await fetchShippingCost(origin, destination, weight, courier);
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
