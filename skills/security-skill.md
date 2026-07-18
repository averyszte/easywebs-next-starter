# Security Skill

## Secrets

- Secrets (service-role key, Stripe secret) are **server-only** — never `NEXT_PUBLIC_`, never in a
  client component. Set them in Vercel, not git.

## Supabase / data

- **RLS on every table**; least privilege; separate public/staff/customer access; never expose the
  service-role key. Validate all input at the boundary with **Zod**; never trust client-side checks.

## Auth / routes

- Guard authed routes in `middleware.ts` + the dashboard `layout.tsx`; re-check role in server actions;
  **RLS is the real gate.** Server actions have built-in CSRF (Origin check) — set `allowedOrigins` only
  for legitimate cross-origin posts (e.g. the Astro site).

## Payments (Stripe)

- All payment logic server-side; validate webhook **signatures** in a route handler; never trust
  client-reported payment status — confirm via webhook/DB.

## Reliability

- Handle errors clearly; don't leak stack traces or sensitive details to the client; test critical user
  flows (auth, a real mutation, a webhook) before shipping.
