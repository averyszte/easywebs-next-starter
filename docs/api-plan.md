# API Plan

How the app talks to Supabase, Stripe, and external services. Keep it organized; no duplicated request
logic. **All external calls live in `src/data/*-repository.ts`.**

## Reads (Supabase)

- In **Server Components** via the repository (RLS-aware server client). Select only needed columns;
  handle loading/error; paginate large lists. Don't `useEffect`-fetch data that can render on the server.
- Genuinely client-only data (rare) → a **route handler** + TanStack Query.

## Mutations

- **Server actions** for same-origin app forms (create/update/delete) → repository. Re-validate with Zod.
- **Route handlers** (`app/api/**/route.ts`) for: webhooks (Stripe, Supabase), cross-origin posts (the
  Astro site), CSV import/export, and any non-React caller. Lock CORS to allowed origins.

## Stripe (if used)

- All payment logic server-side; never expose the secret key. Validate webhook signatures in a route
  handler. Never trust payment status from the client — confirm via webhook/DB.

## Forms

- Zod validation client + server; sanitize; clear success/error states. See `form-validation-skill.md`.

## Document per project

For each route handler / server action, record: path, method, **auth/role required**, input schema,
and effect. Avoid duplicated request logic across screens.
