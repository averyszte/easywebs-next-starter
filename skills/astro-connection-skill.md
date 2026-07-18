# Astro Connection Skill

How this Next.js **admin app** connects to a client's **Astro static site** (`easywebs-astro-starter`).

## The model: one Supabase project, two front-ends

Most EasyWebs clients have two properties that share **one Supabase project**:

- **Astro static site** (Cloudflare Pages) — the public face. Reads _published_ data (catalog,
  content) and captures public writes (orders, leads, bookings) via forms.
- **This Next.js app** (Vercel) — the private back-office. Staff log in and manage products, orders,
  content, and users. **This app owns the database schema + migrations.**

```
        Astro static site (public)                 Next.js admin app (staff)
        Cloudflare Pages                            Vercel
             │  reads published rows (build-time)        │  full CRUD (authed, RLS as user)
             │  writes orders/leads (edge function)      │  owns schema + migrations
             └───────────────┬───────────────────────────┘
                             ▼
                   Supabase (Postgres + Auth + Storage)
```

Not every client has an Astro site. When they don't, ignore this file — the app stands alone.

## How the Astro site READS Supabase (catalog / content)

- **Default: build-time (static).** In Astro frontmatter, use the **anon** Supabase client to fetch
  `status = 'published'` rows (`getStaticPaths` for `/products/[slug]`, a list for the catalog). The
  site stays fully static and fast.
- **Rebuild on change.** When staff publish/edit in this app, trigger an Astro rebuild — a Supabase
  Database Webhook → Cloudflare Pages Deploy Hook, or a scheduled rebuild. Document the hook per client.
- **Live data (only if needed).** For stock/price that must be real-time, use the anon client in a
  small Astro island or an Astro SSR endpoint. Prefer static; opt into live only where it matters.

## How the Astro site WRITES to Supabase (orders / leads)

- The Astro form posts to its **Cloudflare Pages Function** (`functions/api/*.ts`). That function uses
  the **service-role key** (secret, server-side only, set in the Cloudflare dashboard) to `INSERT` an
  order/lead row. Turnstile guards spam first.
- The row lands in Supabase → **shows up in this admin app immediately.** That's the core connection:
  public site captures, admin app manages.
- Insert only the columns the public is allowed to set (name, email, items, message). Never let the
  public set `status`, `price_total` (recompute server-side), or admin fields.

## Schema ownership & type sync

- **This app owns the schema** (migrations in `supabase/migrations/`). The Astro site is a consumer.
- Keep row types in sync: generate `types/database.ts` here, and copy the relevant types into the Astro
  repo (or publish a tiny shared types package). Don't hand-redefine shapes in two places.

## RLS split (public vs staff)

- **anon (Astro public):** `SELECT` only `status = 'published'`; `INSERT` into `orders`/`leads` with a
  restricted column set; nothing else.
- **authenticated (staff):** scoped by role in `profiles` — full CRUD on the tables they own.
- **service-role (Astro edge function):** bypasses RLS to insert orders — that's why it's server-only.

## Env / secrets split

| Where | Needs |
|---|---|
| Next app (Vercel) | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server), auth |
| Astro site (Cloudflare) — build | `SUPABASE_URL`, anon key (for build-time reads) |
| Astro Cloudflare Function | `SUPABASE_SERVICE_ROLE_KEY` (secret, edge only — never in the static bundle) |

## Deploy topology & linking

- Astro on the **apex** (`client.com`, Cloudflare). Next app on a **subdomain** (`app.client.com` or
  `admin.client.com`, Vercel). Or path-based if the client prefers.
- The marketing site links to the app ("Staff login" / "Account"); the app can deep-link back to public
  pages.
- **Cross-subdomain auth:** to keep a session valid across `client.com` and `app.client.com`, set the
  Supabase server client's cookie `domain` to `.client.com`. If a form on the Astro site posts to a
  Next **server action** (rather than to Supabase directly), add `serverActions.allowedOrigins` in
  `next.config.js` or Next rejects it as CSRF.
- **Consistent branding:** keep one source of truth for design tokens across both — mirror the Astro
  `@theme` values as CSS variables the Next Tailwind theme reads, or publish a tiny shared tokens
  package both import. Don't hand-duplicate colours/fonts in two places.

## Default recipe (most clients)

1. This app manages the catalog; staff mark rows `published`.
2. A Supabase webhook triggers a Cloudflare Pages rebuild → the Astro site regenerates the catalog.
3. A customer submits an order/lead on the Astro site → Cloudflare Function (service-role) inserts it.
4. Staff see and process it in this app. One database, clean split of responsibilities.
