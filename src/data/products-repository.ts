import { isSupabaseConfigured } from '@/lib/supabase-config';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { EXAMPLE_PRODUCTS } from '@/data/example-data';
import type { Product } from '@/types/database';

// The ONLY place products touch Supabase. Server Components / server actions call
// these; never query the DB from a component. Returns demo data until configured.

export async function getProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured) return EXAMPLE_PRODUCTS;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!isSupabaseConfigured) return EXAMPLE_PRODUCTS.find((p) => p.id === id) ?? null;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('products').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Product | null) ?? null;
}
