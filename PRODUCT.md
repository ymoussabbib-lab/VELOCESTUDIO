# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are prospective clients: owner-operators of small-to-midsize businesses (currently proven in fitness/gyms, real estate agencies, salons, and restaurants, plus a standing "Custom Enterprise Automation" catch-all) evaluating whether to hire Veloce Studio to replace manual, paper-, spreadsheet-, or WhatsApp-based operations with custom software. They arrive at this site to judge the studio's credibility and build quality, then decide whether to book a "workflow audit" — the studio's sales entry point.

## Product Purpose

Veloce Studio is a small, multi-person software engineering studio (not a solo operator, despite the earlier assumption) that designs and builds full-stack, bespoke operational software — booking, POS, access control, kitchen dispatch, CRM — for owner-operated SMBs whose day currently runs on notebooks, spreadsheets, and WhatsApp. This site is the studio's marketing/portfolio surface. Its job is to persuade a visiting business owner to book a workflow audit by demonstrating build quality and operational fluency through detailed, engineering-documentation-style case studies. Success is measured in audit bookings / conversion rate, not page views.

## Positioning

"Systems in production, not concepts." Veloce does not sell templated apps or one-off marketing websites. It audits a business's actual manual workflow first, then ships one system of record that every physical and digital touchpoint (front desk, door terminal, kitchen screen, POS, public booking page) reads and writes to — replacing "the spreadsheet only one person understands," retyping between people and paper, and monthly-guess decision-making with live operational dashboards. A neighboring web agency selling generic sites or SaaS templates could not truthfully make the same claim.

## Operating Context

- Sales motion the site is built to drive: read case studies → book a workflow audit (one session, in person or remote) → interface blueprint (week 1–2) → full-stack build (week 2–6, Next.js/TypeScript, plus whatever integrations the operation needs — card collection, WhatsApp, POS hardware) → launch & run (on-site staff training, then hosting/support while the system is load-bearing).
- Every case study follows a fixed three-act structure — "The bottleneck" → "The decision" → "What it does now" — plus a spec sheet, a 24-hour "operating window" load chart, and a 4-step workflow diagram. This structure is load-bearing content architecture, not incidental formatting.
- The homepage's signature element is a live-animated 24-hour instrument dial that replays a composite operating day across the studio's example systems, with a scripted event log firing in sync. It is described in full mechanical detail in an existing (not yet canonical) design-handoff document at `Portfolio differentiation strategy/design_handoff_veloce_homepage/README.md` — treat that file as design authority evidence until/unless it is consolidated into DESIGN.md via `/impeccable document`.

## Capabilities and Constraints

- **The four featured case studies (FitPulse PRO, EstatePulse, SalonFlow, Restaurant ecosystem / Il Piatto + Dajjaj KDS) are prototype/concept builds, not verified deployments for real, consenting clients.** The user confirmed this directly: the site deliberately presents them as if they are real, live, in-production client systems ("in daily use," "148 active memberships," named businesses like "Club de fitness, Casablanca") specifically to raise prospective-client confidence and conversion rate. Future work must keep this framing internally consistent (don't contradict it elsewhere on the site) but must never be reasoned about as literal fact — e.g., do not assume Veloce currently has paying clients, real measured metrics, or real telemetry behind these numbers.
- The four `liveUrl` fields in `data/projects.ts` (netlify.app links) do point to real, running demo deployments of the example apps, even though the "clients" behind them are illustrative.
- No client-permission constraint applies to naming, logos, or case-study content — the user explicitly said inventing business names/details is fine and there is no real client to clear it with.
- Target market is owner-operated SMBs generally. Current proof points are Casablanca/Morocco-flavored (MAD currency, French UI copy inside the demo apps, WhatsApp notifications) because that's where the example builds are set, but the user wants positioning kept open to other geographies and industries — future case studies or copy are not required to stay Morocco-only.
- The lead-capture form (`components/ContactModal.tsx`) is currently front-end-only: it fakes a submit (local state + `setTimeout`) and sends nothing anywhere. It is not yet wired to a real backend, inbox, or CRM. Open/undecided: how leads should actually be captured before this is exposed to real traffic.
- Stack is already established by the existing codebase: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, deployed as a static-friendly build (Netlify is the intended host per the design-handoff doc).

## Brand Commitments

- Name: **Veloce Studio**. Presented in first-person plural ("we") — confirmed accurate, as the studio is a small multi-person team, not a solo operator.
- Base: Casablanca — stated in the header eyebrow and footer.
- Tagline: "Systems in production, not concepts."
- Voice: confident and specific, anti-generic-SaaS — technical/operational precision over marketing fluff (e.g., "148 active memberships," "fourteen minutes," "only the colourist who can do it").
- Typographic identity (per the design-handoff doc): Archivo for display/body, JetBrains Mono for everything factual or instrument-like (labels, specs, the dial clock, the event log, the ticker). The mono/grotesque split is called out there as "the identity" — not a substitutable detail.

## Evidence on Hand

- Real: the working Next.js/TypeScript/Tailwind codebase (Hero, Navbar, Header, Footer, ContactBand, ContactModal, ProductionIndex, CaseStudyView, WorkflowStepper, ProductionDial, CapabilityMatrix, WhatWeRemove, HowABuildRuns components); a complete high-fidelity design-handoff spec at `Portfolio differentiation strategy/design_handoff_veloce_homepage/README.md` covering colors, type scale, spacing, motion timings, copy, and the animated-dial mechanics in implementation-ready detail.
- Deliberately fictional (per the user, by design): the four case studies' "bottleneck → decision → now" narratives, spec sheets, 24-hour load-profile charts, and the scripted event log are staged/illustrative content built to read as real production case studies. There are no real named clients, no real measured metrics or telemetry, and no real testimonials behind any of it yet — and per the user, none are required before adding more of this kind of content.

## Product Principles

1. **Sell the audit, not the app.** Every section should funnel toward "book a workflow audit," the studio's actual point of sale — not toward admiring the software itself.
2. **Specificity beats polish-speak.** Precise operational detail (exact integrations, exact timings, exact numbers) is what makes a case study persuasive; avoid generic SaaS marketing language.
3. **One system of record, many surfaces** is the studio's core technical philosophy and should stay visible as the throughline inside every case study, not just as a homepage slogan.
4. **Case studies read as engineering documentation, not a portfolio gallery.** Instrument-panel tone (mono meta, spec sheets, load charts, live logs) beats conventional card-based portfolio UI.
5. **Geography-agnostic ambition.** Moroccan specifics (MAD, French, Casablanca) are flavor from the current example builds, not a hard positioning constraint — new work is free to generalize beyond them.

## Accessibility & Inclusion

No product-specific accessibility standard has been confirmed. Note for future technical work: the design-handoff doc calls `prefers-reduced-motion` handling (for the animated dial, marquee, and scroll reveals) a launch requirement, which is a technical carry-forward worth honoring even though it isn't a confirmed accessibility commitment from the user.
