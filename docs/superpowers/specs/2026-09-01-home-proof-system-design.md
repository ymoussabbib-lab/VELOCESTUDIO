# Veloce Studio Home Proof System — Design

## Decision record

- The featured systems are **real, explorable demos**, not client case studies. Never describe them as deployed for a named client, in daily use, in production, or measured with real client/user/revenue metrics.
- Canonical project URLs are `/work/fitpulse-pro`, `/work/estatepulse`, `/work/salonflow`, and `/work/restaurant-ecosystem`. Existing `/projects/*` URLs redirect to their equivalent canonical URL.
- Primary conversion is WhatsApp: `https://wa.me/212659592823?text=<encoded message>`. “Book a workflow audit” and “WhatsApp us” use that same destination with context-specific French messages.
- Preserve the existing studio identity: cream `#F2EFE8`, ink `#17150F`, Archivo + JetBrains Mono, hairline rules, restrained red accent. The new composition is product-led, not a generic SaaS dashboard.

## Scope

Rebuild the homepage and reusable work-detail surface around visual product proof. The existing animated production dial is not carried forward: it depends on fictional telemetry and conflicts with the new proof policy. Existing live demo URLs remain as “Explore demo” outbound links.

## Information architecture

### Homepage

1. Compact navigation: Systems, Work, Process, About, Start a project.
2. Split hero: positioning copy and a composed software proof stack. Desktop uses FitPulse dashboard as the dominant frame with two smaller real captures; mobile shows one primary frame and up to two supporting cards without overlap that hides text.
3. Proof strip: “One studio. Four operating systems.” followed by industries. No numerical claims.
4. Problem transformation: manual chain (WhatsApp → notebook → spreadsheet → missed follow-up) versus system chain (system → automation → notification → action → traceable result).
5. Five-option business selector: Gym, Salon / Spa, Restaurant / Café, Real Estate, Custom Business. It changes copy, modules, sample workflow, image, and project CTA; keyboard and touch selection are equally supported.
6. Four large system previews: promise, manager visual, client visual, modules, outcome, and a canonical work-page link.
7. Before/after transformation, compact four-step process, buying-clarity deliverables, truthful demo proof, final CTA, footer.
8. Mobile-only fixed action bar: See systems and WhatsApp; `main` receives bottom padding plus safe-area inset so content is never obscured.

### Work detail pages

Each route is one shared template fed by a project object: hero, the operational problem, system architecture, segmented Manager / Client gallery, grouped modules, daily workflow, automations, customization, implementation includes, demo link, and WhatsApp CTA. The gallery displays only the selected audience’s images; buttons have `aria-pressed`, visible focus rings, and no hover-only content.

## Data and component boundaries

`data/projects.ts` is the sole content source. It exposes `Project`, `ProjectAsset`, `ProjectAudience`, `BusinessSolution`, and canonical slug helpers. It contains all commercial copy, demo links, image metadata/captions, and WhatsApp message text. Presentation components receive typed data and never infer a project from its visual filename.

`lib/contact.ts` exports `WHATSAPP_NUMBER`, `createWhatsAppHref(message: string)`, and project/general message helpers. This prevents malformed phone links and duplicate message strings.

Homepage components are small purpose-built sections: `Hero`, `ProofStrip`, `ProblemSection`, `BusinessSelector`, `ProductShowcase`, `BeforeAfter`, `ProcessSection`, `Deliverables`, `FinalCTA`, `MobileStickyCTA`. Work components are `ProjectDetailTemplate`, `ProjectGallery`, `ViewToggle`, `WorkflowTimeline`, and `ProjectCTA`.

## Asset contract

Marketing-ready files live below `public/assets/better-quality/<canonical-slug>/<manager|client>/`. Filenames are lowercase kebab case, no spaces, and are not browser screenshots with chrome. Each asset carries width, height, alt text, and a one-sentence caption in data. Below-fold images use `next/image` and lazy loading; the hero’s first image has `priority`.

The currently supplied source folder is `Portfolio differentiation strategy/design_handoff_veloce_homepage/assets/better qualitty/`. Available groups are FITPLUS, estatepulse, SALON BEAUTY, and RESTAURATION. Normalization examples: `FITPLUS/MANAGER/TABLEAU DE BORD.png` → `fitpulse-pro/manager/dashboard.png`; `RESTAURATION/SERVICE CLIENT/HOME PAGE.png` → `restaurant-ecosystem/client/digital-menu.png`; `estatepulse/manager/vue globale.png` → `estatepulse/manager/dashboard.png`.

## Truth, language, and conversion rules

- Use “Demo system”, “Explore demo”, and “Example workflow”; never “client”, “production”, “live deployment”, “daily use”, “active memberships”, named customers, or real-world outcome metrics.
- Commercial copy is English. WhatsApp prefill is French, as specified:
  - general: `Bonjour, je souhaite en savoir plus sur les solutions de Veloce Studio.`
  - gym: `Bonjour, je suis intéressé par votre solution de gestion pour salle de sport.`
  - restaurant: `Bonjour, je souhaite voir votre solution de menu QR et commande digitale.`
  - salon: `Bonjour, je souhaite voir la solution de réservation pour mon salon.`
  - real estate: `Bonjour, je souhaite voir votre solution immobilière et CRM.`
- The current fake-submit contact modal is removed from the conversion path. Do not claim a request has been received when no backend exists.

## Quality bar

Validate 320, 360, 375, 390, 414, 768, 1024, and 1280px. There must be no horizontal overflow, all targets are at least 44px, reduced motion removes nonessential motion, images reserve their layout space, and every primary path reaches a detail page or WhatsApp in one tap. Use semantic landmarks, one H1 per page, descriptive metadata, keyboard controls, and meaningful image alt text.
