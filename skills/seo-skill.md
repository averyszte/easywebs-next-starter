# SEO Skill

The admin app is mostly **private / authed → noindex**; heavy SEO lives on the client's **Astro static
site**. Apply SEO only to the app's **public** pages (marketing, login, pricing) if it has any.

## Public app pages (if present)

- One clear H1 + proper heading hierarchy; semantic HTML.
- Unique `<title>`/description via the App Router `metadata` export or `generateMetadata`.
- Canonical via `alternates.canonical`; JSON-LD in a Server Component; descriptive alt text; clean URLs.

## Private / authed pages

- Set `robots: { index: false, follow: false }` in `metadata` (or a noindex header in middleware).
  Don't spend effort optimizing screens users must log in to see.

## Performance = ranking

- See `browser-performance-skill.md`. Use `next/image`, keep client JS minimal, and hit Core Web Vitals
  (LCP < 2.5s, CLS < 0.1, INP < 200ms) on any public page.
