# Deployment Skill

## The Next app → Vercel

- Deploy to **Vercel** (native Next.js). Set env vars in the Vercel dashboard (never in git):
  `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server), and
  Stripe keys (server) if used.
- **Preview deploys per PR** — verify auth, RLS, and forms on the preview before promoting.
- Apply DB migrations before/with the deploy; regenerate `types/database.ts` on schema change.
- Custom domain is usually a subdomain (`app.client.com`). Topology + cross-subdomain cookies:
  `astro-connection-skill.md`.

## The paired Astro site → Cloudflare Pages

- The client's public site (if any) stays on **Cloudflare Pages** (static). Its contact/order form runs
  in a **Cloudflare Pages Function** that writes to the shared Supabase using the service-role key
  (secret set in the Cloudflare dashboard). That's the Astro→Next data bridge — see
  `astro-connection-skill.md`.
- Trigger an Astro rebuild on content change via a **Cloudflare Deploy Hook** (called from a Supabase
  webhook or a Next server action after publish).

## Checklist after deploy

Env vars set · migrations applied · RLS verified · auth + a real mutation + a webhook tested · error
monitoring on · any public pages pass Lighthouse.
