# Architecture Standards (Next.js)

How every EasyWebs Next.js app is structured. Source of truth for reviews and AI instructions.

## Philosophy

Software gets worse over time unless you prevent it. The decay sources: files that grow without
limits; dumping-ground modules (`utils.ts`, `helpers.ts`); mixed concerns (DB calls in components,
logic in JSX); inconsistent shape across projects. Every rule below prevents one of those.

## Standard folder shape

```
src/
├── app/                  # App Router — routes, layouts, server components, route handlers
│   ├── (auth)/           # login / signup (public)
│   ├── (dashboard)/      # authed app area — layout.tsx owns the sidebar + auth guard
│   │   ├── layout.tsx
│   │   ├── products/     # page.tsx = list; [id]/page.tsx = detail; new/page.tsx = create
│   │   └── orders/
│   ├── api/              # route handlers (webhooks, and the REST the Astro site calls)
│   ├── layout.tsx
│   └── globals.css
├── components/           # UI components (one per file). ui/ = shadcn primitives (don't modify)
│   └── [feature]/        # feature-grouped components
├── data/                 # repository — the ONLY place that talks to Supabase / external services
├── lib/                  # pure utils + supabase client factories (server/browser) + constants
├── types/                # shared TS types (database.ts is generated from Supabase)
└── hooks/                # client hooks (TanStack Query, etc.) — one per file
```

Variations require justification. Next's special files stay lowercase: `page.tsx`, `layout.tsx`,
`route.ts`, `middleware.ts`, `loading.tsx`, `error.tsx`.

## The layer rule

Dependencies flow one direction:

```
app/ routes (Server Components)  ──▶  server actions / route handlers (mutations, API)
            │                                        │
            └───────────────┬────────────────────────┘
                            ▼
                 data/  (repository — the only caller of Supabase / Stripe / email)
                            ▼
        Supabase (Postgres + Auth + Storage)  ·  Stripe  ·  email
```

- **Server Components read through `data/` directly** (server-side, RLS-aware Supabase client).
- **Mutations go through server actions or route handlers**, which call `data/` — never the DB inline.
- **Client Components** get data via props from a Server Component, or via a hook (TanStack Query) that
  hits a route handler. A component NEVER imports the Supabase client directly.
- **RBAC** is enforced twice: middleware/layout guards on the route, and **RLS in the database**.
- `components` and `lib` are shared across layers; `lib` is pure (no DB, no React).

Swapping a backend or provider changes repository bodies, not signatures.

## Server vs client

- **Server Component by default.** Only add `'use client'` for real interactivity (forms with local
  state, charts, drag/drop). Keep client components small and push data-fetching up to the server.
- Secrets (service-role key, Stripe secret) exist ONLY in server code. Never in a client component.

## File size rules

- No file over 300 lines (generated types exempt). No function over 80 lines. At ~250 lines, split by
  concern.

## Decision boundaries (what lives where)

| Concern | Lives in |
|---|---|
| Shared types | `types/` (DB types generated to `types/database.ts`) |
| Supabase / external-service calls | `data/*-repository.ts` only |
| Mutations (create/update/delete) | server actions or `app/api/**/route.ts` → call `data/` |
| Pure transforms (format price/date, slug) | `lib/` |
| React client state/effects | `hooks/` or the client component |
| UI rendering | `components/` |
| Route / page | `app/**` |
| Auth guard + role check | `middleware.ts` + dashboard `layout.tsx` (+ RLS in DB) |
| Server data cache | Next's fetch cache / Server Components; TanStack Query for client data |

## Enforcement

1. **CLAUDE.md** — read every session. 2. **`tsc --noEmit`** (typecheck). 3. **ESLint** (`next lint`),
zero warnings. 4. **Prettier**. 5. **RLS** in the DB. 6. **Code review**.

## Breaking a rule

Document the case, get sign-off, and if it becomes a pattern update this doc — don't let exceptions
become shadow conventions.
