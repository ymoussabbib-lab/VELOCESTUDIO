# Home Proof System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current editorial case-study homepage with a mobile-first product-proof website and truthful, reusable demo-system detail pages.

**Architecture:** Keep Next.js 14 App Router and Tailwind. Replace `data/portfolioData.ts` as the marketing source with typed project/solution data; render both home and canonical work routes from it. Centralize WhatsApp URLs, normalize visual assets under `public`, and make old project URLs redirect.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, `next/image`, Framer Motion, Playwright.

**Spec:** `docs/superpowers/specs/2026-09-01-home-proof-system-design.md`

## Global Constraints

- Keep Archivo, JetBrains Mono, cream/ink/hairline-rule identity; do not introduce a generic SaaS visual system.
- The four systems are explorable demos. Remove every false production/client/metric claim from user-facing copy.
- Canonical work URLs are `/work/fitpulse-pro`, `/work/estatepulse`, `/work/salonflow`, `/work/restaurant-ecosystem`.
- WhatsApp number is `212659592823`; encode every prefilled message with `URLSearchParams` or `encodeURIComponent`.
- Do not claim form submission succeeds without an actual backend.
- No visual asset is upscaled; use `next/image`, explicit dimensions, and lazy loading below the fold.
- All interactive controls work via keyboard, have visible focus, and meet a 44px target minimum.

---

## Files and ownership

| File | Responsibility |
| --- | --- |
| `lib/contact.ts` | WhatsApp URL generation and stable message helpers. |
| `data/projects.ts` | Typed truthful demo data, asset metadata, selector content, canonical slug mapping. |
| `components/home/*.tsx` | Individual homepage sections; no data duplication. |
| `components/work/*.tsx` | Reusable project detail template, gallery, view toggle, CTA and timeline. |
| `app/page.tsx` | Home composition and minimal local selector state. |
| `app/work/[slug]/page.tsx` | Static canonical work routes, metadata and 404. |
| `app/projects/[slug]/page.tsx` | Legacy redirect only. |
| `app/layout.tsx`, `app/globals.css`, `components/Header.tsx`, `components/Footer.tsx` | Shared navigation, metadata, mobile safe area, focus/reduced-motion rules. |
| `tests/*.spec.ts` | Playwright regression coverage. |

### Task 1: Establish a verifiable baseline and E2E harness

**Files:** Modify `package.json`; create `playwright.config.ts`, `tests/smoke.spec.ts`.

- [ ] Write `tests/smoke.spec.ts` first with a test that visits `/`, asserts exactly one visible H1, and asserts one visible link whose accessible name matches `/see what we build/i`.
- [ ] Run `npx playwright test tests/smoke.spec.ts`; record the expected red failure because the new CTA does not exist.
- [ ] Add Playwright configuration with `baseURL: 'http://127.0.0.1:3000'`, Chromium, and a `webServer` that runs `npm run dev -- --hostname 127.0.0.1 --port 3000`; add `test:e2e` and `test:e2e:ui` scripts.
- [ ] Run `npm run build` before product work. If it fails, stop and document the baseline failure rather than attributing it to redesign work.

### Task 2: Normalize assets without destroying source captures

**Files:** Create `public/assets/better-quality/**`; create `data/assetManifest.ts`; create `tests/assets.spec.ts`.

- [ ] Write an asset-manifest test that imports every project asset and asserts that its `src` begins `/assets/better-quality/`, its `width` and `height` are positive, and its alt/caption are nonempty.
- [ ] Run the asset test and verify it fails because the manifest and normalized directories do not exist.
- [ ] Copy, do not delete, the supplied source files into canonical directories. Use the mappings in the design spec; preserve PNG where conversion tooling is unavailable. Include at least one manager and client image for every project. Add lowercase kebab-case filenames only.
- [ ] Create `data/assetManifest.ts` with `MarketingAsset { src; width; height; alt; caption; }` values measured from the resulting source files. Keep the data importable without React.
- [ ] Re-run the asset test; it must pass. Manually inspect each copied file once at native resolution to catch an accidental wrong mapping.

### Task 3: Introduce truthful project data and contact helpers

**Files:** Create `lib/contact.ts`, `data/projects.ts`, `tests/contact.spec.ts`, `tests/projects.spec.ts`; retire imports of `data/portfolioData.ts` as each consumer migrates.

- [ ] Write `tests/contact.spec.ts`: `createWhatsAppHref('Bonjour, test')` must equal `https://wa.me/212659592823?text=Bonjour%2C+test` (or the equivalent `URLSearchParams` encoding); verify `new URL(result).pathname === '/212659592823'` and decoded `text` matches input.
- [ ] Run it red; `lib/contact.ts` is missing.
- [ ] Implement `WHATSAPP_NUMBER = '212659592823'` and `createWhatsAppHref(message)` using `new URLSearchParams({ text: message })`.
- [ ] Write `tests/projects.spec.ts` to assert four canonical slugs, all projects have manager/client assets, all demo URLs are HTTPS, and JSON-stringified user-facing data does not include `In production`, `daily use`, `Live production`, `148 active`, or `Client` as a proof label.
- [ ] Implement `Project`, `BusinessSolution`, `ProjectAsset`, and `PROJECTS`; use `fitpulse-pro`, `estatepulse`, `salonflow`, and `restaurant-ecosystem` as canonical slugs. Give every project problem, promise, audience, manager/client modules, workflow, automations, customization, implementation list, demo URL(s), and a WhatsApp message.
- [ ] Run the two tests green. Do not migrate UI until the data test passes.

### Task 4: Build the reusable work-detail route first

**Files:** Create `app/work/[slug]/page.tsx`, `components/work/ProjectDetailTemplate.tsx`, `ProjectGallery.tsx`, `ViewToggle.tsx`, `WorkflowTimeline.tsx`, `ProjectCTA.tsx`, `tests/work-routes.spec.ts`.

- [ ] Write Playwright tests that visit all four canonical routes, assert a visible “Demo system” label, a manager/client segmented control, a visible “Explore demo” link, and a WhatsApp anchor beginning `https://wa.me/212659592823`.
- [ ] Run red; routes are absent.
- [ ] Implement `generateStaticParams`, per-route `generateMetadata`, slug lookup, and `notFound()` for unknown slugs. Do not use a client router for static route resolution.
- [ ] Implement the shared template from typed data. Gallery buttons use `type="button"`, `aria-pressed`, label each panel, and switch selected visual/caption without relying on hover. Use `Image` with manifest dimensions.
- [ ] Run the route tests green at 1280px and 390px. Confirm hidden gallery images do not take layout space or remain keyboard-focusable.

### Task 5: Redirect legacy project URLs

**Files:** Replace `app/projects/[slug]/page.tsx`; extend `tests/work-routes.spec.ts`.

- [ ] Add tests expecting `/projects/fitpulse` and `/projects/fitpulse-pro` to finish at `/work/fitpulse-pro`, and `/projects/restaurant` to finish at `/work/restaurant-ecosystem`.
- [ ] Run red against current legacy case-study renderer.
- [ ] Implement a server-side `redirect()` using an explicit legacy-to-canonical map. Remove the legacy client detail renderer only after no app route imports it.
- [ ] Re-run all route tests green and test an unknown legacy slug returns 404 instead of falling back to FitPulse.

### Task 6: Implement homepage sections and selector

**Files:** Create `components/home/Hero.tsx`, `ProofStrip.tsx`, `ProblemSection.tsx`, `BusinessSelector.tsx`, `ProductShowcase.tsx`, `BeforeAfter.tsx`, `ProcessSection.tsx`, `Deliverables.tsx`, `FinalCTA.tsx`; replace `app/page.tsx`; create `tests/home.spec.ts`.

- [ ] Write homepage tests first: hero has the required two-line proposition; the proof strip names four verticals; all five selector options change the visible system heading; each of four project cards links to a `/work/` route; final CTA contains a WhatsApp link.
- [ ] Run red against the prior homepage.
- [ ] Compose sections in the exact narrative order from the design spec. Hero uses the priority FitPulse image plus real supporting frames; no fake dashboard/card artwork. `BusinessSelector` starts on Gym, uses buttons with `aria-pressed`, and supports Enter/Space naturally.
- [ ] Use shared `ProjectCTA` and contact helper everywhere. The CTA labels are “See what we build”, “Explore [system]”, “Explore demo”, “Book a workflow audit”, and “WhatsApp us” as context demands.
- [ ] Run home tests green. Check all UI text against the truth rules before proceeding.

### Task 7: Replace false lead capture with real conversion and navigation

**Files:** Modify `components/Header.tsx`, `components/Footer.tsx`, `components/ContactBand.tsx`; delete `components/ContactModal.tsx` only after no imports remain; add `components/home/MobileStickyCTA.tsx`; extend `tests/home.spec.ts`.

- [ ] Write tests that assert desktop header links to systems/work/process anchors, its primary CTA is a WhatsApp anchor, and at 390px the sticky bar exposes both “See systems” and “WhatsApp”.
- [ ] Run red.
- [ ] Remove modal state from page and shared components. Replace the fake form/result with real external WhatsApp links. Footer becomes `SALÉ / RABAT / CASABLANCA / MOROCCO` and avoids “Systems in production, not concepts.”
- [ ] Implement a mobile menu with labeled menu/close buttons, dialog semantics or an accessible disclosure, Escape close, and an internal CTA. Add bottom safe-area spacing whenever the sticky CTA renders.
- [ ] Run tests green; verify no user-facing “received” or response-time promise remains.

### Task 8: Responsive styling, motion, metadata, and accessibility

**Files:** Modify `app/globals.css`, `app/layout.tsx`, `tailwind.config.js`; extend `tests/home.spec.ts`, `tests/work-routes.spec.ts`.

- [ ] Write viewport tests at 320, 360, 390, 414, 768, 1024, and 1280 asserting `document.documentElement.scrollWidth <= window.innerWidth`, all visible primary anchors/buttons have at least 44px height or width, and hero/project images have nonzero rendered dimensions.
- [ ] Run red where the legacy layout overflows or lacks controls.
- [ ] Apply fluid type with `clamp()`, one-column mobile card ordering, horizontal gallery scroll-snap only where it aids image inspection, and desktop grid layouts. Add global `:focus-visible` and a complete `prefers-reduced-motion` override for transforms, reveal animations, and pulsing.
- [ ] Update homepage and per-project title/descriptions from the design spec; set document language deliberately (`en`) and ensure French only appears in WhatsApp message payloads.
- [ ] Run viewport tests green and manually keyboard-test selector, gallery, mobile menu, links, and close behavior at 200% zoom.

### Task 9: Final verification and visual QA

**Files:** No feature files required; optionally add focused regression tests only if a discovered bug is automated.

- [ ] Run `npm run build`, `npm run test:e2e`, and `npm run lint` (if `next lint` is supported by the installed Next version); record full output and fix any redesign-caused failure.
- [ ] Capture desktop (1280px) and phone (390px) homepage plus one work route using the existing screenshot script or Playwright. Inspect for crop, text overlap, fixed CTA coverage, slow image layout shifts, and horizontal overflow.
- [ ] Verify every external demo and WhatsApp URL manually; if a demo link fails, retain the visual but label it unavailable only after user confirmation—do not silently remove it.
- [ ] Recheck all acceptance criteria in `HOME_REDESIGN_SPEC.md`, applying the truthful-demo decisions in the design spec where the documents conflict.
- [ ] Commit only the files introduced by this redesign with a scoped message such as `feat: rebuild demo proof system` after verification is clean.

## Acceptance matrix

| Requirement | Plan task |
| --- | --- |
| Truthful demo positioning and WhatsApp conversion | 3, 4, 6, 7 |
| High-quality manager/client visual proof | 2, 4, 6 |
| `/work/*` reusable detail pages | 4, 5 |
| Mobile sales flow and sticky CTA | 6, 7, 8 |
| Image loading, metadata, reduced motion, accessibility | 2, 8, 9 |
| Build, E2E, responsive and manual QA | 1, 9 |
