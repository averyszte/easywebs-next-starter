# Browser-Aware Performance Skill

Design visually rich but **mechanically boring** pages — work _with_ the browser's rendering pipeline,
not against it. Adapted from Addy Osmani's modern-browser writing. Goal: first screen appears fast,
main content is prioritized, interaction stays smooth, layout never shifts under the user.

## Principles

1. **Make the first screen cheap.** One clear LCP candidate; it should look mostly right _before_
   hydration. In Next, keep meaningful structure in **Server Components** so the shell isn't blank.
2. **Prioritize the real LCP element** (hero/product image or headline). Explicit `width`/`height`,
   responsive sources, `fetchpriority="high"`, preload it, and **don't lazy-load** the above-the-fold
   hero. Use `next/image` with `priority` on that one image.
3. **Don't block HTML parsing.** `defer`/`async`/`type=module`; keep analytics, chat, tag managers off
   the critical path (Next `<Script strategy="afterInteractive"|"lazyOnload">`).
4. **Treat CSS as critical infrastructure.** Ship design-system primitives, not per-page CSS
   explosions. Design every component state (empty, loading, long-text, error, hover/focus, responsive)
   or the browser improvises with layout shifts.
5. **Prefer compositor-friendly motion** — animate `transform` and `opacity`, not `width/height/top/
left/margin/box-shadow`.
6. **`will-change` sparingly** — only on an element about to animate (opening drawer/modal), never blanket.
7. **Avoid layout thrashing** — no JS read/write/read loops; prefer Grid/Flex, fixed aspect ratios,
   container queries, batched reads/writes, virtualized long lists/tables.
8. **Design stable layouts (CLS is a design problem).** Reserve space for media, embeds, ads; stable
   nav/toolbar heights; skeletons that match final size; buttons that don't resize on label change.
9. **Make rich media earn its cost** — AVIF/WebP, sized to viewport, cropped, stable dimensions, right
   priority, lighter mobile version.
10. **Third-party scripts on a leash** — never make the primary experience depend on them; reserve space
    and give fallbacks.
11. **Prefetch likely next steps** (Next `<Link>` prefetches by default; speculation rules for the rest)
    — only where the path is predictable.
12. **Hydration enhances, not rescues.** Server-render meaningful structure; defer non-critical client
    components (`next/dynamic`, `Suspense`); the page should survive a slow JS path. In Next: **Server
    Components by default, `'use client'` only where needed.**

## Checklist

- **First viewport:** obvious above-the-fold content + one clear LCP candidate; coherent before JS;
  fonts limited/preloaded/`display:swap`; hero dimensions stable and loaded eagerly (`priority`).
- **Layout:** media/card dimensions constrained; long text doesn't break; loading states ≈ loaded size;
  embeds/maps/videos get reserved space; mobile uses cropped assets.
- **Motion:** transform/opacity only; layout-animating rare; `will-change` on active elements; respects
  `prefers-reduced-motion`.
- **JS:** non-critical scripts deferred, third-party isolated; expensive components lazy below the fold;
  no needless client rendering of static content; DOM reads/writes batched.
- **Nav/assets:** predictable next pages prefetched; images compressed/sized/AVIF-WebP; SVG for
  icons/logos; videos postered/compressed/lazy.

## Red flags

Blank app shell on load · hero depends on a client-side fetch · layout needs JS to know its size · every
scroll section animates layout props · main image is an unpreloaded CSS background · spinner → everything
at once · five third-party scripts in `<head>` · dynamic-height cards with no aspect ratio · mobile
downloads the desktop hero.

## Rules of thumb

One clear first-screen priority beats five competing ideas · the main image is never an afterthought ·
if it moves, transform first; if it fades, opacity · if it resizes, question the animation · if it loads
late, reserve its space · if it needs JS, ask whether HTML+CSS could do most of it · keep non-essential
third-party off the critical path · prefetch the obvious next click · if it feels clever but fragile,
simplify the mechanics.

## Ask the AI to audit

> Review this project against browser-aware performance principles. For the main pages: is there one
> clear LCP element, preloaded with explicit dimensions and `priority`/`fetchpriority`? Are non-critical
> and third-party scripts deferred/async and off the critical path? Do animations use only
> transform/opacity? Are media/card dimensions constrained to prevent layout shift, with loading states
> matching final sizes? Is meaningful content server-rendered rather than fetched after hydration? List
> concrete issues with file references and the specific fix for each.
