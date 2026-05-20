import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { PRODUCTS as LOCAL_PRODUCTS } from '../data/products';
import type { Product } from '../types';

// Map Supabase row to local Product type
function mapRow(row: Record<string, unknown>): Product {
  return {
    id: row.id as number,
    name: row.name as string,
    category: row.category as Product['category'],
    emoji: row.emoji as string,
    price: row.price as number,
    original: (row.original_price as number) || undefined,
    rating: row.rating as number,
    sold: row.sold as number,
    badge: (row.badge as Product['badge']) || undefined,
    stock: row.stock as number,
    desc: (row.description as string) || '',
  };
}

let cachedProducts: Product[] | null = null;

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(cachedProducts || LOCAL_PRODUCTS);
  const [loading, setLoading] = useState(!cachedProducts);

  useEffect(() => {
    if (cachedProducts) return;

    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('id', { ascending: true });

        if (!error && data && data.length > 0) {
          const mapped = data.map(mapRow);
          cachedProducts = mapped;
          setProducts(mapped);
        }
        // If error or empty, keep using local data
      } catch {
        // Fallback to local data silently
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return { products, loading };
}
