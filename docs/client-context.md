# Client Context

Fill in per project before building the app. It tells the AI who the app is for.

## Business

- **[CLIENT NAME]** — [industry].
- **Has a static Astro marketing site?** [yes/no — if yes, this app shares its Supabase project; see
  `astro-connection-skill.md`]

## The app's job

- **What it manages:** [products / orders / bookings / content / users / …]
- **Primary users + roles:** [admin, staff, customer]
- **The #1 action per main screen:** [...]

## Expected scale

- Users / concurrency at launch and ~12 months: [...]  (drives the stack decision — see CLAUDE.md
  "Scaling"). Don't over-engineer, but flag high-scale up front.

## Brand

- Colours, fonts, logo. If there's an Astro site, **mirror its `@theme` tokens** so the two match.
  Custom UI — not the default shadcn look.

## Key screens / flows

- [Auth, dashboard home, the core CRUD screens, settings, onboarding, …]

## Things to avoid

- Default shadcn look; cluttered admin screens; generic SaaS layouts; over-engineering.
