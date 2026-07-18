# Dashboard Skill

Admin dashboards: simple, scalable, fast. Next App Router + shadcn/ui.

## Layout

- App shell in the dashboard `layout.tsx`: sidebar nav + top bar + the auth/role guard. Responsive
  (collapsible sidebar on mobile). Clear hierarchy; key actions one click away.

## Data & tables

- Server Components fetch via the `data/` repository; stream with `Suspense` + a **skeleton that matches
  the final table size** (no layout shift). Paginate/virtualize large tables; use **TanStack Table** for
  sort/filter. Filters + pagination live in the **URL `searchParams`**, not local state.

## Interactivity

- Mutations via **server actions** (optimistic UI where it helps); toasts for feedback. `'use client'`
  only for the interactive pieces.

## Performance

- No unnecessary polling; use **Supabase Realtime only** where live updates truly matter. Select minimal
  columns; cache/revalidate with tags. See `browser-performance-skill.md`.

## UX

- Obvious actions, clear labels, and designed empty/loading/error states. Don't ship the default shadcn
  look — theme it to the client's brand.
