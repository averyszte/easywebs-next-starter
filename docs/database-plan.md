# Database Plan

Per client, define the schema here before building. Below is a **worked example** (products + orders,
the common e-commerce/admin shape) — replace with the client's real domain.

## Tables (example)

- **`profiles`** — 1:1 with `auth.users`. Columns: `id (uuid, FK auth.users)`, `full_name`, `role`
  (`'admin' | 'staff'`), `created_at`. Drives RBAC.
- **`products`** — `id`, `slug (unique)`, `name`, `description`, `price_cents`, `image_url`,
  `status ('draft' | 'published' | 'archived')`, `stock`, `created_at`, `updated_at`.
- **`orders`** — `id`, `customer_name`, `customer_email`, `status ('new' | 'paid' | 'fulfilled' |
  'cancelled')`, `total_cents`, `notes`, `source ('astro' | 'admin')`, `created_at`.
- **`order_items`** — `id`, `order_id (FK)`, `product_id (FK)`, `quantity`, `unit_price_cents`.
- **`leads`** — `id`, `name`, `email`, `message`, `created_at` (from the Astro contact form).

## Relationships

- `profiles.id` → `auth.users.id` (1:1).
- `order_items.order_id` → `orders.id` (many:1); `order_items.product_id` → `products.id`.

## Access split (drives RLS — see supabase-skill + astro-connection-skill)

- **Public data (anon / Astro site):** `SELECT` on `products WHERE status = 'published'`. `INSERT` on
  `orders` + `order_items` + `leads` with a restricted column set (no `status`, server recomputes
  `total_cents`).
- **Admin/staff (authenticated):** full CRUD on `products`, `orders`, `order_items`, `leads`, scoped by
  `profiles.role`.
- **Customer/user data:** if customers get accounts later, they read only their own `orders`.

## RLS notes

- RLS ON for every table from the start. Write policies alongside each `CREATE TABLE` migration.
- The Astro edge function inserts orders via the **service-role** client (bypasses RLS) — so the anon
  INSERT policy can stay tight or be omitted if all public writes go through the edge function.

## Conventions

- Money in integer **cents**, never floats. Timestamps `timestamptz`, default `now()`.
- Index foreign keys and any column you filter/sort by (`products.status`, `orders.status`,
  `orders.created_at`).
- Migrations in `supabase/migrations/`; regenerate `types/database.ts` after each change.
