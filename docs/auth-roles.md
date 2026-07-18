# Auth Roles

Roles + permissions per project. Enforced in **three places**: middleware/layout guards on routes,
`profiles.role` checks in server actions, and **RLS policies in the DB** (the real gate).

## Roles (adjust per client)

- **Admin** — manage dashboard, users, orders/bookings, content, private business data.
- **Staff / Technician** — view assigned jobs, update status, upload photos/notes.
- **Customer** (only if the app has customer accounts) — view own orders/bookings, submit requests,
  edit own profile.

## Where roles live

- A `profiles` table (1:1 with `auth.users`) holds `role`. Read it **server-side**; never trust a
  client-supplied role or claim.

## Enforcement (layered)

- **Route:** `middleware.ts` redirects unauthenticated users; the dashboard `layout.tsx` checks role.
- **Action:** re-check the role in the server action before any privileged write.
- **DB:** RLS policies (`auth.uid()`, role checks) — least privilege; anon gets read-only on published
  rows. See `supabase-skill.md`.

## Rules

- Never expose admin routes publicly. Never rely on client checks alone. Keep role logic simple and
  centralized (one helper that reads `profiles.role`).
