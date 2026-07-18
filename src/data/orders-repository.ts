import { isSupabaseConfigured } from '@/lib/supabase-config';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { EXAMPLE_ORDERS } from '@/data/example-data';
import type { Order } from '@/types/database';

// The ONLY place orders touch Supabase. Orders are created on the public Astro
// site (via its edge function → service-role insert) and managed here.

export async function getOrders(): Promise<Order[]> {
  if (!isSupabaseConfigured) return EXAMPLE_ORDERS;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Order[];
}
