# EasyWebs — Next.js App Starter

The foundation for EasyWebs **client admin dashboards / web apps** — Next.js (App Router) +
TypeScript + Tailwind + shadcn/ui + **Supabase** (Postgres + Auth + Storage).

Companion to `easywebs-astro-starter` (the public static marketing/storefront sites). **Both talk to
one Supabase project**: the Astro site is the public face, this app is the admin/back-office. See
`skills/astro-connection-skill.md`.

## Shared foundation + per-client adjustments

Every client app reuses the backbone — Supabase auth + client wiring, RBAC, the dashboard shell, the
`data/` repository layer, tokens, and the Astro-connection conventions. Per client you **adjust**: the
DB schema + types, the roles, the screens, and the branding. Some clients have no static site — the
Astro connection is available when needed, not forced.

## Stack

- **Next.js (App Router)** + **TypeScript** (strict)
- **Tailwind** + **shadcn/ui** (the component backbone)
- **Supabase** — Postgres, Auth, Storage, Row Level Security on every table
- **Deploy:** Vercel (the paired Astro site stays on Cloudflare Pages)

## The Astro connection (shared Supabase)

- This app **owns the schema** and lets staff manage products/orders/content/users.
- The Astro static site **reads published rows at build time** and **writes orders/leads** via its
  Cloudflare edge function (service-role) — which then appear in this dashboard.
- Full model + RLS split + env split: `skills/astro-connection-skill.md`.

## Conventions

See `CLAUDE.md`, `docs/` (architecture, database-plan, auth-roles, api-plan), and `skills/` for the
`app/` shape, the layer rule, hard rules, Supabase patterns, and the Astro connection.

> **Status:** methodology + docs are Next.js-ready. The app scaffold (App Router + Supabase auth +
> dashboard shell + example products/orders) is the next build phase.
