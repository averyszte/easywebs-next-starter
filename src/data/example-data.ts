import type { Product, Order } from '@/types/database';

// Demo seed data — shown when Supabase isn't configured yet, so the scaffold runs
// out of the box. Delete once the DB is wired.

export const EXAMPLE_PRODUCTS: Product[] = [
  {
    id: '1',
    slug: 'oak-shelf',
    name: 'Solid Oak Shelf',
    description: 'Handmade floating shelf.',
    price_cents: 8900,
    status: 'published',
    stock: 12,
    created_at: '2026-06-01T10:00:00Z',
  },
  {
    id: '2',
    slug: 'ceramic-mug',
    name: 'Ceramic Mug',
    description: 'Glazed stoneware mug.',
    price_cents: 2400,
    status: 'published',
    stock: 40,
    created_at: '2026-06-03T10:00:00Z',
  },
  {
    id: '3',
    slug: 'wool-throw',
    name: 'Wool Throw Blanket',
    description: 'Lambswool, charcoal.',
    price_cents: 12500,
    status: 'draft',
    stock: 5,
    created_at: '2026-06-05T10:00:00Z',
  },
  {
    id: '4',
    slug: 'brass-lamp',
    name: 'Brass Desk Lamp',
    description: 'Adjustable, warm LED.',
    price_cents: 15900,
    status: 'archived',
    stock: 0,
    created_at: '2026-05-20T10:00:00Z',
  },
];

export const EXAMPLE_ORDERS: Order[] = [
  {
    id: 'o1',
    customer_name: 'Priya Shah',
    customer_email: 'priya@example.com',
    status: 'new',
    total_cents: 11300,
    source: 'astro',
    created_at: '2026-07-10T09:12:00Z',
  },
  {
    id: 'o2',
    customer_name: 'Marcus Lee',
    customer_email: 'marcus@example.com',
    status: 'paid',
    total_cents: 8900,
    source: 'astro',
    created_at: '2026-07-09T16:40:00Z',
  },
  {
    id: 'o3',
    customer_name: 'Dana White',
    customer_email: 'dana@example.com',
    status: 'fulfilled',
    total_cents: 2400,
    source: 'admin',
    created_at: '2026-07-08T11:05:00Z',
  },
];
