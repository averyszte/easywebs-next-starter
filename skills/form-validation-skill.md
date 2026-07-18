# Form Validation & Security Skill

Defence in depth for every form. Never trust the client — validate on the client for UX, then
**re-validate on the server** before anything touches the database.

## The four layers

1. **Client validation (Zod)** — instant, friendly errors.
2. **Sanitize** — strip malicious content before it's sent/stored.
3. **Server re-validation (Zod, same schema)** — the real gate, in the server action / route handler.
4. **DB + CORS** — RLS on the table; CORS locked to allowed origins for cross-origin posts.

## Where things live

- `src/lib/validation.ts` — Zod schemas + helpers, **shared by client and server** (one source of truth).
- `src/lib/sanitize.ts` — string/object sanitizers.
- Mutations go through a **server action** or `app/api/**/route.ts` → `data/*-repository.ts`. Never
  write to Supabase straight from the component.

## Schemas (`lib/validation.ts`)

Define one schema per form; derive the type with `z.infer`. Use `.trim()`, `.toLowerCase()` on email,
length caps, regex where it helps, `z.enum()` for dropdowns, `z.array().min(1)` for required
multi-select, and `.refine()` for custom rules (e.g. phone) and required checkboxes.

```ts
import { z } from 'zod';

export const enquirySchema = z.object({
  name: z.string().trim().min(2).max(100).regex(/^[a-zA-Z\s\-'.]+$/, 'Letters only'),
  email: z.string().trim().toLowerCase().email().max(254),
  phone: z.string().trim().min(10).max(20),
  message: z.string().trim().min(10).max(2000),
  agreedToTerms: z.boolean().refine((v) => v === true, 'You must agree to the terms'),
});
export type EnquiryInput = z.infer<typeof enquirySchema>;

export const getFieldErrors = (e: z.ZodError): Record<string, string> =>
  Object.fromEntries(e.issues.map((i) => [i.path.join('.'), i.message]));
```

## Client (recommended: react-hook-form + zodResolver)

Use `react-hook-form` with `@hookform/resolvers/zod` for clean field-level errors and submit state —
don't hand-roll `useState` validation. Sanitize on submit, then POST to the server action / route.

## Server re-validation (`app/api/enquiry/route.ts`)

Re-parse with the **same schema**, sanitize, then persist via the repository. Return structured
field-level errors. Lock CORS to allowed origins (needed when the client's **Astro site** posts here).

```ts
import { NextRequest, NextResponse } from 'next/server';
import { enquirySchema, getFieldErrors } from '@/lib/validation';
import { sanitizeObject } from '@/lib/sanitize';
import { createLead } from '@/data/leads-repository';

const ALLOWED = ['https://client.com', 'https://www.client.com', 'http://localhost:3000'];

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin') ?? '';
  const cors = ALLOWED.includes(origin) ? { 'Access-Control-Allow-Origin': origin } : {};

  const parsed = enquirySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, errors: getFieldErrors(parsed.error) },
      { status: 400, headers: cors },
    );
  }
  await createLead(sanitizeObject(parsed.data)); // repository → Supabase (RLS still applies)
  return NextResponse.json({ success: true }, { status: 200, headers: cors });
}
```

> **Server actions** are preferred for same-origin app forms (no CORS, progressive enhancement). Use a
> route handler when a **different origin** posts (e.g. the Astro static site) — then CORS matters.
> For the Astro site's own contact form, its Cloudflare edge function writes to Supabase directly
> (service-role) — see `astro-connection-skill.md`; this route handler is for when you want the post to
> hit the Next app instead.

> **CSRF / server actions:** Next blocks cross-origin **server action** posts by default (the `Origin`
> header must match the host). If the Astro site should invoke a Next server action cross-origin, add
> the allowed origins to `next.config.js`:
>
> ```js
> // next.config.js
> module.exports = { experimental: { serverActions: { allowedOrigins: ['client.com', 'app.client.com'] } } };
> ```
>
> For plain public cross-origin posts, prefer a route handler with explicit CORS (as above) over
> loosening server-action origins.

## Sanitize (`lib/sanitize.ts`)

Strip HTML/scripts from free-text before storing. `sanitizeObject` walks strings recursively; keep
email/phone normalizers. (Use a maintained sanitizer such as `isomorphic-dompurify` or `xss`.)

## Checklist

- [ ] One Zod schema per form in `lib/validation.ts`, shared client+server
- [ ] Client validates for UX (react-hook-form + zodResolver); submit disabled while pending
- [ ] Sanitize all free-text before send/store
- [ ] **Server re-validates with the same schema** and sanitizes again
- [ ] Mutation goes through a server action / route handler → `data/` repository (never inline DB)
- [ ] CORS locked to allowed origins for any cross-origin (Astro → Next) posts
- [ ] RLS on the target table is the final gate; structured field errors returned; HTTPS in prod
