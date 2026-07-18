# AI Pairing Skill

How to work effectively with Cursor, Claude Code, and similar assistants without sliding into spaghetti.

## The failure mode

Left to default behavior, AI assistants dump code into the nearest file; reinvent abstractions; skip
lint/typecheck; add unrequested features; use `any`/`@ts-ignore`; don't split large files; hallucinate
file paths; and put Supabase calls straight in components. These failures compound.

## Defense in depth

### 1. CLAUDE.md — read every session

Stack, folder structure, hard rules, before-finish checklist. Non-negotiable.

### 2. Tooling enforcement

- `tsc --noEmit` (typecheck), `next lint` (ESLint, zero warnings), Prettier.
- Husky + lint-staged so bad code can't commit. Key rules: `max-lines`, `no-explicit-any`,
  `ban-ts-comment`, `import/no-cycle`, `no-console`, naming-convention matching `coding-rules.md`.

### 3. Specific prompts

**Bad:** "Add a products page." **Good:**

> Add `app/(dashboard)/products/page.tsx` as a Server Component that reads via `getProducts()` in
> `src/data/products-repository.ts` (create if missing). Render a shadcn data table (name, price,
> status, actions). Mutations via a server action re-validated with Zod. Run `npm run typecheck`.

### 4. Periodic audits

> Audit `src/` in priority order (don't fix yet): files >250 lines; functions >50; duplicated logic;
> files named utils/helpers/common/misc; **Supabase calls outside `data/`**; `'use client'` that could
> be a Server Component; secrets that could leak to the client; `any` usage; inconsistent naming.

### 5. Human review

Catches scope creep, hallucinated APIs, architectural drift, and "should work" code. Read every diff;
run the actual feature.

## Prompt patterns that work

- **One logical unit per task.** Break big asks down.
- **Always specify file paths** (`add getOrders() in src/data/orders-repository.ts`).
- **Describe the contract, not the implementation** (server action + Zod schema + which table).
- **Plan before implementing** anything spanning >5 files; wait for approval.
- **Run lint/typecheck yourself** — don't trust "all good!".

## Anti-patterns to refuse

- "I'll add `any` for now" — model the type.
- "I'll make a `helpers.ts`" — name it by purpose.
- "I'll query Supabase right in the component" — go through `data/`.
- "I'll make this a client component" — Server Component unless it needs interactivity.
- "I'll skip typecheck, small change" — run it.
- "I'll add this feature while I'm here" — do exactly what was asked.

## Bottom line

Architecture is a system you set up so you can't _not_ follow it: CLAUDE.md + typecheck/lint + specific
prompts + audits + human review.
