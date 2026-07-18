# Supabase Skill

Supabase is the backend: **Postgres + Auth + Storage**, shared with the client's Astro static site
(see `astro-connection-skill.md`).

## Clients — three, kept separate

1. **Browser client** (`createBrowserClient`) — for `'use client'` components. Uses the anon key + the
   user session. RLS applies.
2. **Server client** (`@supabase/ssr` `createServerClient`, cookie-based) — for Server Components, server
   actions, and route handlers. Carries the user's session so **RLS applies as that user** (the current
   official SSR/auth package). Default for app reads/writes.
3. **Service-role client** — bypasses RLS. ONLY in trusted server code (webhooks, admin jobs, the Astro
   site's Cloudflare Function). **Never imported into a client component or shipped to the browser.**

All three live behind `src/lib/supabase/*` and are used only by `src/data/*-repository.ts`.

## Row Level Security (non-negotiable)

- **RLS ON for every table.** No table ships without policies.
- Typical policy set per table: public/anon can `SELECT` only published/safe rows; authenticated users
  can read/write their own rows; admins (via a role claim or a `profiles.role` check) get full access.
- The service-role client bypasses RLS — that's why it's server-only.
- Test policies with the anon key before trusting them.

## Auth

- Supabase Auth (email/password and/or OAuth). Session in cookies; refresh handled by the server client.
- Guard authed routes in `middleware.ts` + the dashboard `layout.tsx`; RLS is the real enforcement.
- Store role/permissions in a `profiles` table (1:1 with `auth.users`), not just JWT claims.

## Types & migrations

- Generate types: `supabase gen types typescript --project-id <id> > src/types/database.ts`. Regenerate
  after every schema change; it's the source of truth for row shapes.
- Keep schema changes as SQL migrations in `supabase/migrations/` — the app owns the schema.

## Storage

- Public bucket for site assets (product images shown on the Astro site); private bucket for sensitive
  uploads. Clean folder structure. Serve public images via the CDN URL.

## Queries

- Select only needed columns. Add indexes on filtered/foreign-key columns. Always handle loading/error
  states. Avoid N+1 — use joins/`select('*, relation(*)')`. Paginate with `range()`.

## Env vars

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (safe for the browser).
- `SUPABASE_SERVICE_ROLE_KEY` — **server only**, never `NEXT_PUBLIC_`. Set in Vercel, not in git.
