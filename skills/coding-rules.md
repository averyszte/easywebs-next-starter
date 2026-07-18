# Coding Rules (Next.js)

The non-negotiable practices for writing code in this template.

## Hard rules

- NO file over 300 lines. Split first. NO function over 80 lines.
- NO files named `utils.ts`, `helpers.ts`, `misc.ts`, `common.ts`. Name by purpose.
- NO Supabase / external-service calls outside `src/data/*-repository.ts`. Server Components and server
  actions call the repository; the repository calls Supabase.
- NO business logic in JSX. Compute above the return or in `lib/`.
- **Server Components by default.** Add `'use client'` only for real interactivity; keep it minimal.
- **NEVER expose the service-role key (or any secret) to the client.** It lives in server code only.
- NO relative imports past one level. Use `@/` path aliases.
- NO `any`. Use `unknown` and narrow, or model properly. NO `@ts-ignore` / `@ts-expect-error`.
- NO `console.log` in committed code. NO magic numbers/strings — extract named constants.
- NO mutating props/state/arguments. Treat as readonly.

## Naming conventions

| Kind                 | Convention                  | Example                                               |
| -------------------- | --------------------------- | ----------------------------------------------------- |
| Component file       | kebab-case                  | `product-card.tsx`                                    |
| Component export     | PascalCase                  | `ProductCard`                                         |
| Next special files   | lowercase                   | `page.tsx`, `layout.tsx`, `route.ts`, `middleware.ts` |
| Hook (file / export) | use-kebab.ts / useCamelCase | `use-products.ts` → `useProducts`                     |
| Function             | camelCase                   | `formatPrice`                                         |
| Constant             | SCREAMING_SNAKE_CASE        | `MAX_PAGE_SIZE`                                       |
| Type                 | PascalCase                  | `Product`, `OrderStatus`                              |
| Boolean              | is / has / should / can     | `isLoading`, `hasAccess`                              |

## Component rules

- One component per file. Props via `type FooProps = {...}`. Default values in destructuring.
- Composition over config (`<Card><CardHeader/></Card>`). Don't wrap a shadcn primitive for no behavior.
- Keep `'use client'` components lean; fetch data in a parent Server Component and pass it down.

## Data & Supabase rules

- **All Supabase access lives in `data/*-repository.ts`.** Stable function signatures.
- Use the **RLS-aware server client** (cookie-based) for user-scoped reads/writes. Use the
  **service-role client** ONLY for trusted server tasks (webhooks, admin jobs) — never shipped to the client.
- Reads: in Server Components via the repository. Mutations: server actions or route handlers → repository.
- Client data that must live client-side: **TanStack Query** hitting a route handler. Not `useState`.
- Generated DB types (`types/database.ts`) are the source of truth for row shapes.

## Auth & security

- Guard authed routes in `middleware.ts` and the dashboard `layout.tsx`; enforce again with **RLS**.
- Validate all input at the boundary (Zod on route handlers / server actions). Trust internal calls.
- Never trust the client for authorization — RLS + server checks decide.

## Imports & comments

- `@/` path aliases beyond one level. Group: external → internal → relative.
- No barrel files except `components/ui/`. Default to no comments; comments explain WHY. No
  commented-out code. No `TODO` without an issue number.

## Styling

- Tailwind utilities + shadcn/ui. `cva` for variants. No inline `style` for static styles. No
  `!important`. Don't ship default shadcn styling — customize.

## Performance

- Prefer Server Components + streaming. `next/image` for images. Cache/revalidate deliberately
  (`revalidate`, `revalidateTag`). Paginate/virtualize large lists. Avoid client waterfalls.

## Before finishing any task

1. `npm run typecheck` — must pass
2. `npm run lint` — zero warnings
3. `npm run format`
4. If a file crosses 250 lines, propose a split. If you added a dependency, justify it.
