// Domain row types. PER PROJECT: generate these from your Supabase schema instead
// of hand-writing —
//   npx supabase gen types typescript --project-id <ref> --schema public > src/types/database.ts
// This example set matches docs/database-plan.md (products + orders).

export type Role = 'admin' | 'staff';
export type ProductStatus = 'draft' | 'published' | 'archived';
export type OrderStatus = 'new' | 'paid' | 'fulfilled' | 'cancelled';

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_cents: number;
  status: ProductStatus;
  stock: number;
  created_at: string;
};

export type Order = {
  id: string;
  customer_name: string;
  customer_email: string;
  status: OrderStatus;
  total_cents: number;
  source: 'astro' | 'admin';
  created_at: string;
};
