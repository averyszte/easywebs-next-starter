# CLAUDE.md — EasyWebs Next.js App Starter

Read this file before writing any code. These rules are not optional.

## On session start (read this first)

Before responding to my first message in any new session:

1. Read every file in `/docs/` (architecture, api-plan, auth-roles, client-context, current-task,
   database-plan)
2. Read every file in `/skills/` (coding-rules, astro-connection-skill, supabase-skill,
   form-validation-skill, browser-performance-skill, dashboard-skill, security-skill, deployment-skill,
   ui-ux-skill, conversion-skill, seo-skill, ai-pairing-skill)
3. Reply with a short confirmation (<100 words) containing:
   - The stack (1 line)
   - The layer rule (1 line)
   - 3 specific hard rules from coding-rules.md
   - The current task from docs/current-task.md, or "no current task set"
4. Then wait for my actual instruction. Do NOT start writing code yet.

If anything I ask later conflicts with a rule in those docs, stop and flag the conflict instead of
silently breaking the rule.

## What this template is

The EasyWebs **Next.js app starter** — the foundation for **client admin dashboards / web apps**
(manage products, orders, bookings, content, users). Its companion is `easywebs-astro-starter` (the
static public marketing/storefront sites). **Both talk to the same Supabase project** — the Astro site
is the public face; this Next app is the admin/back-office. See `skills/astro-connection-skill.md`.

Every client app **reuses the backbone** (auth, Supabase wiring, RBAC, dashboard shell, data layer,
tokens) and **adjusts per project**: the DB schema + types, the roles, the screens, and the branding.
Not every client has a static site — the Astro connection is available when needed, not forced.

## Project summary

- **Stack:** Next.js (App Router) + TypeScript (strict) + Tailwind + shadcn/ui. Server Components by
  default; `'use client'` only when needed.
- **Backend:** Supabase (Postgres + Auth + Storage), Row Level Security on every table.
- **Data/state:** server fetch through the `data/` layer in Server Components; server actions or route
  handlers for mutations; TanStack Query only for genuinely client-side data.
- **Payments:** Stripe when required (else none).
- **Deploy:** Vercel (recommended for Next.js). The paired Astro site stays on Cloudflare Pages.

## Scaling — this default fits most client apps; escalate deliberately

**Next.js + Supabase is the right default** for typical client dashboards (hundreds to low-thousands of
users, moderate traffic). It's fast to build and cheap to run. **Do not over-engineer by default.**

For a project expecting **very high concurrency / many, many users**, flag it at kickoff and choose a
more scalable setup _before_ building — don't retrofit later:

- **Database:** use Supabase's **connection pooler** (PgBouncer) for serverless; add **read replicas**
  for read-heavy apps; if Supabase's limits bite, evaluate a horizontally-scalable Postgres (Neon,
  PlanetScale/Vitess, CockroachDB) or a dedicated managed instance.
- **Caching:** cache hot reads (Redis / Upstash) and lean on Next's `revalidateTag` / ISR.
- **Background work:** move slow or spiky work off the request path into a queue (Inngest, QStash,
  Trigger.dev).
- **Rate limiting / abuse:** per-IP and per-user limits on public endpoints (e.g. Upstash Ratelimit).
- **Auth at scale:** if Supabase Auth limits bite, evaluate Clerk / WorkOS / Auth0.
- **Heavy compute / realtime:** consider a dedicated API service (separate from serverless functions)
  and a proper realtime layer instead of stretching the default.

Rule: **pick the stack to match the expected load — not the other way around.** State the target scale
in `docs/current-task.md` at kickoff so the decision is explicit and reviewable.

## Folder structure — do not deviate

See `docs/architecture.md` for the canonical `app/` layout and the layer rule.

## Hard rules

See `skills/coding-rules.md` for the full list. The highlights:

- No file over 300 lines. No function over 80 lines.
- No files named `utils` / `helpers` / `common` / `misc`. Name by purpose.
- **No Supabase / external-service calls from components.** Go through `src/data/*-repository.ts`
  (called from Server Components or server actions).
- **Server Components by default.** Add `'use client'` only for real interactivity, and keep it small.
- **Never expose the service-role key to the client.** RLS on every table; never trust the client.
- No `any`, no `@ts-ignore`. Use `@/` path aliases.

## Before finishing any task

1. `npm run typecheck` (tsc --noEmit) — must pass
2. `npm run lint` — must pass with zero warnings
3. `npm run format` — apply Prettier
4. If any file you created or grew crosses 250 lines, propose how to split it

## When in doubt

Stop and ask. Don't guess. Don't invent file paths. Don't add features that weren't requested.

---

# UI / UX / MCP Rules

When building interfaces, use the available MCP servers as design and component support. This is a
React app, so **shadcn/ui is the real component backbone here** (unlike the Astro static template).

Default design style: premium commercial; strong conversion hierarchy; high-trust product/service/
business feel; bold but practical; polished but not artsy; custom agency-built appearance.

Avoid: editorial design; generic SaaS landing pages; fragile minimalist layouts; **default shadcn
styling**; excessive whitespace; gimmicky animations; crypto-style glow; vague placeholder copy;
component-dump interfaces with no strategy.

Prioritize: clear primary action; trust; fast comprehension; strong hierarchy; clean onboarding;
simple forms; **useful dashboards**; obvious next steps; mobile-first UX; scalable app structure.

## MCP usage

- Use **shadcn** for reliable component structure (buttons, forms, tables, dialogs, sheets, etc.).
- Use **Magic UI** only for subtle visual polish.
- Use **21st.dev Magic** for UI inspiration and component variations before major UI builds.
- Do not blindly copy registry components. Customize spacing, typography, colours, copy, hierarchy.
- Make the final interface feel custom, not like a component dump.

## Before coding UI, define

1. The target user + their role/permissions
2. The primary action per screen
3. The visual direction (fresh per client — see the design mandate)
4. The component strategy (which shadcn pieces, what to customize)
5. The screens/flows required
6. Which MCP tools to use and which to avoid

## Important — custom per client

Do not reuse the starter layout as the final design. Every app gets a fresh visual direction based on
the business, audience, user role, and conversion goal. The starter is a technical + planning
foundation, not a visual template. Each build needs a distinct layout rhythm, CTA treatment, and UX
flow.

## Related docs

- `docs/architecture.md` — `app/` shape, the layer rule, file size, refactor signals
- `docs/database-plan.md` / `docs/auth-roles.md` / `docs/api-plan.md` — schema, RBAC, endpoints
- `skills/coding-rules.md` — hard rules, naming, banned patterns
- `skills/astro-connection-skill.md` — how this app connects to a client's Astro static site (shared Supabase)
- `skills/supabase-skill.md` — Supabase client patterns, RLS, storage
- `skills/security-skill.md` / `skills/dashboard-skill.md` — auth, RBAC, dashboard UX
