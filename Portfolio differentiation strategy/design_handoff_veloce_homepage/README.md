# Handoff: Veloce Studio homepage + case studies

## Overview

Marketing site for **Veloce Studio**, a Casablanca software engineering studio that builds
operational systems (booking, POS, access control, kitchen dispatch, CRM) for owner-operated
businesses — gyms, salons, restaurants, real-estate agencies.

The site replaces a generic dark-teal SaaS template. Its argument is: *five real businesses run
their entire operating day on software we built.* Everything in the design serves that claim —
most of all the animated 24-hour "One day in production" dial, which is the page's signature
element and the main reason a visitor stays.

Deliverable: one homepage plus four case-study views (client-side view switch, no page reload).

## About the design files

The files in this bundle are **design references created in HTML** — prototypes that show intended
look and behavior. They are **not production code to copy directly**.

`Veloce Studio Site v2.dc.html` is authored in a proprietary design-component format: a template
using `{{ }}` value holes and `<sc-for>` / `<sc-if>` control-flow tags, plus a logic class,
assembled by a runtime (`support.js`) that is not part of your codebase. Do not try to run or port
that runtime.

The task is to **recreate these designs in the target codebase's environment** using its established
patterns. If no environment exists yet, Next.js (App Router) + TypeScript is the natural choice —
it matches the stack Veloce already ships to clients (Next.js 14 / TypeScript / Tailwind) and
deploys cleanly to Netlify, which is the intended host.

All layout in the reference uses **inline styles**. That is a constraint of the authoring format,
not a design decision. Reimplement with whatever the codebase uses (Tailwind, CSS modules,
styled-components). The token table below is the source of truth.

## Fidelity

**High-fidelity.** Final colors, typography, spacing, motion timings and copy. Recreate pixel-
accurately. Every value needed is documented below; where the reference and this README disagree,
this README wins.

## Global shell

- Page background `#F2EFE8`, text `#17150F`.
- Content column: `max-width: 1440px`, `margin: 0 auto`, `padding: 0 40px`.
- Every major section is separated by a **1px hairline** (`#17150F` for structural rules,
  `#D6D1C5` for internal dividers). There are no cards, no shadows, no border-radius anywhere on
  the page except the three browser-chrome dots and the blinking status dot. Radius is otherwise `0`.
- Section header pattern, used verbatim for every section: a flex row, `align-items: baseline`,
  `justify-content: space-between`, `border-top` (or `border-bottom`) `1px solid #17150F`,
  `padding-bottom: 14px`. Left: `<h2>` in mono 12px / `letter-spacing: 0.12em` / uppercase /
  weight 500. Right: mono 12px, `#8A857A`, a short factual caption.
- Vertical rhythm between sections: `margin-top: 116px`.

### Header (sticky)

- `position: sticky; top: 0; z-index: 50`, height `68px`,
  background `rgba(242,239,232,0.92)`, `backdrop-filter: blur(10px)`,
  `border-bottom: 1px solid #17150F`.
- Left: wordmark, mono 15px, `letter-spacing: -0.02em` — `VELOCE` at weight 700 `#17150F`,
  `STUDIO` at weight 400 `#8A857A`, `gap: 10px`, `align-items: baseline`.
- Right: nav, mono 11.5px, `letter-spacing: 0.06em`, uppercase, `gap: 26px`.
  Items: `The day` (`#day`), `Systems` (`#index`), `Method` (`#method`), then the CTA
  `Book an audit →` with `background: #17150F; color: #F2EFE8; padding: 9px 16px 8px`.

### Footer

`border-top: 1px solid #4A453C`, `background: #17150F`, text `#8A857A`, mono 11.5px,
`padding: 28px 40px`, flex space-between.
Left `© 2026 Veloce Studio — Casablanca`, right `Systems in production, not concepts`.

## Screens / views

### 1. Homepage — hero

**Purpose:** state the claim in four lines and set the instrument-panel tone.

- Section padding `88px 40px 0`.
- Eyebrow row: `gap: 10px`, `align-items: center`, `margin-bottom: 36px`. A `7×7px` circle
  `background: #C7371A; border-radius: 50%` animating `vs-blink` (2.4s, `steps(1)`, infinite),
  then mono 11.5px / `0.1em` / uppercase / `#8A857A`: `Casablanca — software engineering studio`.
- Headline `<h1>`: `font-size: clamp(46px, 6.1vw, 100px)`, `line-height: 0.92`,
  `letter-spacing: -0.04em`, `font-weight: 900`, `max-width: 20ch`, `margin: 0`.
  Four block-level spans, each animating `vs-rise` 800ms `cubic-bezier(.22,.61,.36,1)` with
  staggered delays **60ms / 150ms / 240ms / 330ms**, `animation-fill-mode: both`:

  1. `Five businesses`
  2. `run their entire day`
  3. `on software`
  4. `we built.` — where `we` is `font-weight: 400; font-style: italic`

### 2. Homepage — marquee ticker

- Full-bleed band, `margin-top: 64px`, `border-top`/`border-bottom` `1px solid #17150F`,
  `background: #17150F`, `color: #F2EFE8`, `overflow: hidden`.
- Inner flex row `width: max-content`, animating `vs-slide` **42s linear infinite**
  (`translateX(0)` → `translateX(-50%)`). The content group is rendered **twice** so the loop is
  seamless.
- Each group: `gap: 40px`, `padding: 13px 20px`, mono 12px, `0.08em`, uppercase, `white-space: nowrap`.
- Items are the four projects as `01 FitPulse PRO — Fitness & wellness`, etc., plus
  `Workflow audits open`. Between items a `◆` glyph in the accent color `#C7371A`.

### 3. Homepage — "One day in production" (SIGNATURE — build this first)

The page's centerpiece. A radial 24-hour instrument dial replaying an operating day across five
production systems, with events firing into a live log.

Section caption: right side reads `Five systems · 24 hours · replayed live`.

Layout: `grid-template-columns: 480px 1fr`, `gap: 56px`, `margin-top: 44px`,
`align-items: start`. Left = dial + clock + legend. Right = intro paragraph + log panel.

#### The five systems (ring data)

| # | Name | Color | Operating window | Ring radius |
|---|------|-------|------------------|-------------|
| 0 | FitPulse PRO | `#0F7B5A` | 06:00 → 23:00 | 168 |
| 1 | EstatePulse | `#1B4DE4` | 09:00 → 19:00 | 152 |
| 2 | SalonFlow | `#A31C4B` | 09:00 → 20:00 | 136 |
| 3 | Il Piatto | `#C7371A` | 11:00 → 24:00 | 120 |
| 4 | Dajjaj KDS | `#7A5C00` | 11:00 → 24:00 | 104 |

Note the five systems vs. four case studies: the restaurant ecosystem is two connected apps
(Il Piatto guest menu, Dajjaj Hamoud kitchen terminal) and is drawn as two rings.

#### SVG geometry

`viewBox="-18 -18 456 456"`, `width: 100%`, `height: auto`, `display: block`.
Center is **(210, 210)**. The viewBox is deliberately expanded by 18px on each side so the hour
labels sit inside it — do not use `0 0 420 420` with `overflow: visible`, the labels get clipped.

Draw order, back to front:

1. **Rim circle** — `r: 196`, `fill: none`, `stroke: #D6D1C5`, `stroke-width: 1`.
2. **Hour ticks** — 24 vertical lines rotated `rotate(h * 15, 210, 210)`.
   Major (`h % 6 === 0`): `y1: 178`, `y2: 196`, `stroke: #17150F`, `stroke-width: 1.4`.
   Minor: `y1: 184`, `y2: 196`, `stroke: #C9C4B7`, `stroke-width: 1`.
3. **Hour labels** — `00`, `06`, `12`, `18` at radius **212**,
   `x = 210 + 212·sin(a)`, `y = 214 − 212·cos(a)` where `a = (h / 24) · 2π`.
   `text-anchor: middle`, mono 11px, `fill: #8A857A`, `letter-spacing: 0.06em`.
4. **Rings** — per system, two concentric circles at the radius above:
   a track (`stroke: #E3DFD4`, `stroke-width: 7`) and the active arc
   (`stroke: <system color>`, `stroke-width: 7`, `opacity: 0.9`).
   The arc is drawn with dash math, not a path:
   `C = 2π·r`, `f = (to − from) / 24`,
   `stroke-dasharray = "${f·C} ${C}"`,
   `transform = rotate(${(from / 24) · 360 − 90}, 210, 210)`
   (the `−90` moves SVG's 3-o'clock start to 12 o'clock).
5. **Event markers** — one dot per event at its system's ring radius:
   `cx = 210 + r·sin(a)`, `cy = 210 − r·cos(a)`, `a = (hour / 24) · 2π`.
   `r: 3.4`, `fill: <system color>`, `stroke: #F2EFE8`, `stroke-width: 1.4`.
6. **Ping layer** — an empty `<g>`; ping circles are injected here at runtime (see below).
7. **Hand** — a `<g>` with `transform-origin: 210px 210px` containing
   `<line x1="210" y1="210" x2="210" y2="12" stroke="#17150F" stroke-width="1.4">` and
   `<circle cx="210" cy="12" r="3" fill="#C7371A">`.
8. **Hub** — `<circle cx="210" cy="210" r="4" fill="#17150F">`.

#### Animation loop

One `requestAnimationFrame` loop. **Full day = 26000ms.**

```
prog = ((now - t0) % 26000) / 26000     // 0..1
hour = prog * 24
```

Per frame, mutate the DOM directly — **do not** drive this through component state, it would
re-render the page ~60×/sec:

- Hand: `setAttribute('transform', 'rotate(' + (prog * 360).toFixed(2) + ' 210 210)')`.
- Clock readout: `textContent = HH:MM`, zero-padded, derived from `hour`.

Event firing: find the highest-indexed event whose `h <= hour`. When that index changes, push that
event. State updates therefore happen ~13×/day-cycle, not per frame.

On fire:
- Prepend the entry to the log, cap the list at **7** entries.
- Emit a ping: append an SVG `<circle>` to the ping layer at the event's ring position,
  `r: 3.5`, `fill: none`, `stroke: <system color>`, `stroke-width: 1.6`, animating
  `vs-ping` 900ms `ease-out forwards` (animates `r` 3.5 → 13 and `opacity` 1 → 0).
  Remove the node after 950ms.

Cancel the rAF on unmount. Consider pausing on `document.hidden`.

#### Event script (13 events)

| Time | System | Text |
|------|--------|------|
| 06:15 | FitPulse PRO | QR pass scanned — member through the door before staff arrive |
| 08:00 | FitPulse PRO | Billing run executes across 148 active memberships |
| 09:30 | SalonFlow | Coloration booked — only the colourist who can do it is offered |
| 10:06 | EstatePulse | Map search converts to a lead, attached to a named buyer |
| 11:45 | Il Piatto | Table 7 scans the QR and opens the menu bound to that table |
| 11:47 | Dajjaj KDS | Ticket lands on the kitchen screen, timer starts |
| 13:24 | FitPulse PRO | Front desk sells a day pass; invoice issued in MAD |
| 15:18 | EstatePulse | Private tour scheduled against real agent availability |
| 17:00 | SalonFlow | POS checkout recorded against the appointment, not a loose sale |
| 18:30 | FitPulse PRO | WhatsApp fires: three passes expire inside seven days |
| 20:12 | Il Piatto | Delivery order joins the same dispatch queue as dine-in |
| 21:45 | Dajjaj KDS | Slow ticket flagged at fourteen minutes, while it still matters |
| 23:24 | FitPulse PRO | Last check-in of the day; the dashboard closes the book |

(Source hours are decimal: 6.25, 8.0, 9.5, 10.1, 11.75, 11.78, 13.4, 15.3, 17.0, 18.5, 20.2,
21.75, 23.4. The 11:45/11:47 pair is intentional — it shows the guest's tap arriving in the
kitchen almost instantly.)

#### Clock + legend row

Below the dial: `margin-top: 18px`, `border-top: 1px solid #17150F`, `padding-top: 14px`,
flex space-between, `align-items: baseline`.

- Left: label `Replay clock` (mono 11px, `0.1em`, uppercase, `#8A857A`), then the readout —
  mono **42px**, weight 700, `letter-spacing: -0.03em`, `line-height: 1.05`, `margin-top: 4px`.
  Initial text `00:00`.
- Right: five legend rows, `flex-direction: column`, `gap: 7px`, right-aligned. Each row is
  `align-items: center`, `gap: 9px`, mono 11px: window (`#8A857A`, e.g. `06–23`), then name
  (`#17150F`, `min-width: 96px`, right-aligned), then a `20×7px` swatch in the system color.
  Windows ending at 24 display as `00` (Il Piatto and Dajjaj KDS read `11–00`).

#### Right column

- Intro paragraph: `font-size: 21px`, `line-height: 1.45`, `color: #2A2620`, `max-width: 50ch`,
  `text-wrap: pretty`, `margin-bottom: 28px`. Copy:
  *"This is what we actually sell: the hours between opening and closing, held by software instead
  of by someone's memory. The dial replays a real operating day across the five systems we run in
  production."*
- Log panel: `border: 1px solid #17150F`, `background: #17150F`, `color: #F2EFE8`.
  - Panel header: `padding: 12px 18px`, `border-bottom: 1px solid #3A362E`, mono 11px, `0.1em`,
    uppercase, `#8A857A`, space-between — `Live event log` / `tail -f production`.
  - Body: `min-height: 366px`, `padding: 14px 18px 18px`, flex column, `gap: 12px`.
  - Each entry animates in with `vs-logIn` 460ms `cubic-bezier(.22,.61,.36,1)` fill both
    (`opacity 0→1`, `translateY(-10px)→0`). Mono 12.5px, `line-height: 1.5`. Two rows:
    a meta row (`flex`, `gap: 14px`, `align-items: baseline`) with time in `#8A857A` and system
    name in the **system's color**; then the event text in `#EDE9E0`, `margin-top: 3px`,
    `padding-left: 52px`, `text-indent: -52px` (hangs the first line flush and indents wraps).
  - Newest entry on top. Key entries by event id so re-entry replays the animation.

### 4. Homepage — production index

**Purpose:** the portfolio, as an engineering index rather than a card grid. Hovering a row swaps
the preview and its activity chart; clicking opens the case study.

Section caption: `Hover to preview · click to read the build`.
Layout: `grid-template-columns: 1.05fr 0.95fr`, `gap: 56px`, `align-items: start`.

#### Left: rows (one per project)

Each row is an `<a>`, `position: relative`, `padding: 26px 4px 24px`,
`border-bottom: 1px solid #D6D1C5`, `cursor: pointer`.

- **Accent wipe**: an absolutely positioned span, `left: 0`, `bottom: -1px`, `height: 2px`,
  `background: <project accent>`, `width: 0%` → `100%` when the row is the active one,
  `transition: width 620ms cubic-bezier(.22,.61,.36,1)`. It sits on the row's own bottom hairline.
- Inner grid `46px 1fr auto`, `gap: 20px`, `align-items: start`:
  - Index `01`–`04`: mono 12px, `#8A857A`, `padding-top: 7px`.
  - Title: `font-size: 30px`, weight 800, `letter-spacing: -0.025em`, `line-height: 1.1`.
  - One-liner: `margin-top: 7px`, 15px, `#3B372E`, `max-width: 46ch`, `line-height: 1.45`.
  - Tag chips: `margin-top: 14px`, flex wrap, `gap: 8px`. Each `border: 1px solid #C9C4B7`,
    `padding: 4px 8px 3px`, mono 10.5px, `0.05em`, uppercase, `#5A554A`.
  - Right meta: mono 11px, `0.06em`, uppercase, right-aligned, `padding-top: 9px` — sector in
    `#17150F`, status in `#8A857A` below (`margin-top: 5px`).

Hover sets the active project index. Active state drives the wipe, the preview, the URL bar and the
activity chart.

#### Right: sticky preview (`position: sticky; top: 108px; padding-top: 26px`)

- Browser chrome: `border: 1px solid #17150F`, `background: #F2EFE8`. Bar `padding: 9px 12px`,
  `border-bottom: 1px solid #17150F`, `align-items: center`, `gap: 10px`. Three `8×8px` circles,
  `border: 1px solid #17150F`, `border-radius: 50%`, `gap: 5px`. Then the URL field: `flex: 1`,
  mono 10.5px, `#5A554A`, `background: #EAE6DC`, `border: 1px solid #D6D1C5`, `padding: 4px 9px`,
  showing the active project's URL.
- Viewport: `position: relative`, `aspect-ratio: 552 / 280`, `overflow: hidden`,
  `background: #17150F`. All four screenshots are stacked absolutely and crossfaded — never
  swap a single `src`.

  Each layer: `position: absolute; inset: 0; width/height: 100%`, the image as a CSS
  `background-image` with `background-size: cover`, `background-position: top center`,
  `background-repeat: no-repeat`.
  Active: `opacity: 1`, `transform: scale(1)`. Inactive: `opacity: 0`, `transform: scale(1.05)`.
  `transition: opacity 460ms cubic-bezier(.22,.61,.36,1), transform 900ms cubic-bezier(.22,.61,.36,1)`.

  **Use `background-image`, not `<img src>`.** In the reference this was a real bug: an `<img>`
  whose `src` came from a template hole caused the browser to request the literal unresolved
  string and 404 on every load. In a normal React/Next codebase `next/image` or a plain `<img>`
  is fine — the point is that the crossfade needs stacked layers, and empty/undefined sources must
  never reach `src`.
- Below: activity strip. Meta row mono 11px, `0.08em`, uppercase, `#8A857A`, space-between —
  `Activity profile — <active project>` / `00 → 24h`. Then a 24-bar chart: flex,
  `align-items: flex-end`, `gap: 3px`, `height: 62px`, `border-bottom: 1px solid #17150F`,
  `margin-top: 10px`. Bars are always at full height here (no entrance animation on the homepage).

#### Bar rendering (shared by both charts)

For a 24-value array of `0..1`:

```
flex: 1 1 0
background: <project accent>
height: max(2, value * 100)%        // 2% floor so zero hours still read as a hairline
opacity: value === 0 ? 0.18 : 0.85
transition: height 780ms cubic-bezier(.22,.61,.36,1) <index * 22>ms
```

The staggered per-bar delay is what makes the chart sweep left-to-right on the case pages.

### 5. Homepage — "What we remove"

Section caption `03 recurring failures`. `margin-top: 40px` on the grid.

Three equal columns joined by hairlines — `display: grid`, `grid-template-columns: repeat(3, 1fr)`,
`gap: 1px`, `background: #D6D1C5`, `border: 1px solid #D6D1C5`. Each cell
`background: #F2EFE8`, `padding: 34px 30px 40px`, hover `background: #EAE6DC`.
(The 1px gap over a colored parent is how the internal rules are drawn — no per-cell borders.)

Cell contents: number in mono 11.5px `#C7371A` `0.08em`; `<h3>` `margin: 18px 0 14px`, 25px,
weight 800, `-0.02em`, `line-height: 1.15`, `text-wrap: balance`; body 15.5px, `line-height: 1.55`,
`#3B372E`, `margin-bottom: 22px`; footer rule `border-top: 1px solid #D6D1C5`, `padding-top: 12px`,
mono 11px, `0.05em`, uppercase, `#8A857A`, reading `Replaced by → <value>`.

| # | Title | Body | Replaced by |
|---|-------|------|-------------|
| 01 | The spreadsheet that only one person understands | Every business we have worked with had a workbook holding the real state of things — bookings, stock, who owes what. It is fragile, it is one person's memory, and it does not survive that person taking a holiday. | A system of record with roles |
| 02 | Information retyped between people | An order told to a waiter and written on a pad. A membership renewal noted on paper then entered later. Each retype is a chance to lose data and an hour nobody bills for. | One entry, many surfaces |
| 03 | Decisions made on a monthly guess | Owners we build for could not answer simple questions — committed revenue this month, who lapsed, which service earns most — without an afternoon of adding up receipts. | Live operational dashboards |

### 6. Homepage — "How a build runs"

Section caption `Four phases, one team`. Grid `repeat(4, 1fr)`, `gap: 32px`, `margin-top: 44px`.
Each column: `border-top: 2px solid #17150F`, `padding-top: 18px`. Top row is baseline
space-between — big numeral (`font-size: 42px`, weight 900, `-0.04em`, `line-height: 1`) and
duration (mono 11px, `#8A857A`, `0.05em`, uppercase). Then `<h3>` `margin: 20px 0 10px`, 19px,
weight 800, `-0.015em`; body 15px, `line-height: 1.5`, `#3B372E`.

| # | Duration | Title | Body |
|---|----------|-------|------|
| 01 | Week 1 | Workflow audit | We sit with the people doing the manual work and map every step, including the ones nobody documents. |
| 02 | Week 1–2 | Interface blueprint | Low-friction screens for staff and for customers, designed around the handful of actions each one repeats all day. |
| 03 | Week 2–6 | Full-stack build | Next.js 14 and TypeScript, with the integrations the operation needs: card collection, WhatsApp, POS hardware. |
| 04 | Ongoing | Launch & run | Staff training on site, then hosting and support while the system is load-bearing for the business. |

### 7. Homepage — contact band

Full-bleed `background: #17150F`, `color: #F2EFE8`, `margin-top: 116px`.
Inner `padding: 96px 40px 88px`, grid `1.4fr 1fr`, `gap: 64px`, `align-items: end`.

- `<h2>`: `clamp(38px, 4.6vw, 68px)`, `line-height: 0.98`, `-0.035em`, weight 900,
  `text-wrap: balance` — *"Tell us the part of the day that always goes wrong."*
- Paragraph: `margin-top: 26px`, 17px, `line-height: 1.55`, `#A8A29A`, `max-width: 56ch` —
  *"A workflow audit is one session. We sit with the people doing the manual work, map every step,
  and come back with what software should own and what it shouldn't."*
- Two stacked buttons, `gap: 14px`, each `padding: 20px 24px`, mono 13px, `0.06em`, uppercase,
  flex space-between with a trailing glyph:
  - Primary — `background: #C7371A`, label `Book a workflow audit`, glyph `→`.
    Hover inverts to `background: #F2EFE8; color: #17150F`.
  - Secondary — `border: 1px solid #4A453C`, label `Read a build in full`, glyph `↑`.
    Hover `border-color: #F2EFE8`. Links to `#index`.

### 8. Case study view (×4)

Replaces the homepage content in place (same header/footer). Entering animates the whole article
with `vs-rise` 620ms `cubic-bezier(.22,.61,.36,1)` both. Scroll resets to top on entry.

Order of blocks:

1. **Back link** — `← Production index`, mono 11.5px, `0.08em`, uppercase, `#8A857A`.
   Section padding `64px 40px 0`.
2. **Title block** — `margin-top: 44px`, grid `1fr 340px`, `gap: 64px`, `align-items: end`,
   `border-bottom: 1px solid #17150F`, `padding-bottom: 40px`.
   - Eyebrow: mono 12px, `0.1em`, uppercase, `#C7371A` — `<no> — <sector>`.
   - `<h1>`: `margin-top: 22px`, `clamp(44px, 5.6vw, 88px)`, `line-height: 0.93`, `-0.04em`, weight 900.
   - One-liner: `margin-top: 24px`, 21px, `line-height: 1.42`, `#3B372E`, `max-width: 44ch`,
     `text-wrap: pretty`.
   - Spec sheet (right): rows of mono 11.5px, `0.04em`, `gap: 9px`. Each row
     `border-top: 1px solid #D6D1C5`, `padding-top: 9px`, space-between, `gap: 16px` — key in
     `#8A857A` uppercase, value right-aligned `#17150F`.
3. **Hero screenshot** — `margin-top: 40px`, `border: 1px solid #17150F`, `background: #17150F`,
   `aspect-ratio: 552 / 280`, image as `background-image` with `cover` / `top center`.
   Caption row below: `margin-top: 12px`, mono 11px, `0.05em`, uppercase, `#8A857A`,
   space-between — per-project caption / `Live production environment`.
4. **"Where the load falls"** — `margin-top: 84px`. Section header caption reads
   `Operating window <window label>`. Body grid `1fr 300px`, `gap: 56px`, `margin-top: 34px`,
   `align-items: end`. Left: 24-bar chart, `height: 190px`, `gap: 5px`,
   `border-bottom: 1px solid #17150F`, plus an axis row (`margin-top: 9px`, mono 10.5px,
   `#8A857A`, space-between) labelled `00 06 12 18 24`. Right: the project's `loadNote`,
   15.5px, `line-height: 1.55`, `#3B372E`.
   Bars animate from the 2% floor to full height on entry — hold them collapsed, then release
   ~140ms after the view switch so the stagger is visible.
5. **Chapters** — `margin-top: 84px`. Each chapter is a grid `340px 1fr`, `gap: 64px`,
   `border-top: 1px solid #17150F`, `padding: 34px 0 56px`, `align-items: start`.
   Left rail: label (mono 11.5px, `0.1em`, uppercase, `#8A857A`) and `<h2>` `margin-top: 16px`,
   29px, weight 800, `-0.025em`, `line-height: 1.12`, `text-wrap: balance`.
   Right: paragraphs 18px, `line-height: 1.58`, `#2A2620`, `max-width: 68ch`,
   `text-wrap: pretty`, `margin-bottom: 18px`.
   Optional 2×2 spec grid (`gap: 1px` over `#D6D1C5`, `border: 1px solid #D6D1C5`,
   `margin-top: 26px`); cells `background: #F2EFE8`, `padding: 20px 22px`, key mono 10.5px
   `0.06em` uppercase `#C7371A`, value `margin-top: 8px` 15.5px `line-height: 1.45` `#2A2620`.
   The three chapter labels are always `The bottleneck`, `The decision`, `What it does now`.
6. **"Workflow it owns"** — `border-top: 1px solid #17150F`, `padding-top: 34px`, label as above.
   Then a flex row, `margin-top: 26px`, `border: 1px solid #17150F`, wrapping. Each step
   `flex: 1 1 180px`, `padding: 24px 22px 26px`, `border-right: 1px solid #D6D1C5`,
   hover `background: #EAE6DC`. Number mono 10.5px `#8A857A`; step `margin-top: 12px`, 17px,
   weight 800, `-0.015em`, `line-height: 1.2`; detail `margin-top: 8px`, 14px,
   `line-height: 1.45`, `#5A554A`.
7. **Next build** — `margin-top: 96px`, full-bleed `#17150F`, `padding: 72px 40px`.
   Label `Next build` (mono 11.5px, `0.1em`, uppercase, `#8A857A`). Then a link row,
   `margin-top: 20px`, baseline space-between, `gap: 40px`, `color: #F2EFE8`, hover `#C7371A`:
   project name at `clamp(36px, 5vw, 76px)`, weight 900, `-0.04em`, `line-height: 1`, and a
   `40px` `→`. Below, the next project's one-liner, `margin-top: 22px`, 17px, `#A8A29A`,
   `max-width: 58ch`, `line-height: 1.5`. Cycles 01→02→03→04→01.

## Project data

Accents are per project and drive the row wipe and both charts.

### 01 — FitPulse PRO

- Sector `Fitness & wellness`, status `In production`, accent `#0F7B5A`,
  URL `veloce.studio/fitpulse-pro`, window `06:00 → 23:00`.
- One-liner: *The operating system for a gym: memberships, QR door access, billing and trainer
  schedules in one place.*
- Tags: Member CRM · QR access terminal · Recurring billing · MAD invoicing
- Shot caption: *Owner dashboard — MRR, live check-ins, expiring memberships*
- Load: `0,0,0,0,0,0,.35,.72,.9,.55,.4,.38,.5,.45,.35,.4,.6,.85,1,.9,.62,.4,.22,.1`
- Load note: *Two peaks, not one: the pre-work crowd and the post-work crowd. The door terminal
  has to hold both without a person standing at it, which is why access is enforced by the
  membership record rather than by the desk.*
- Spec: Client `Club de fitness, Casablanca` · Surfaces `Owner dashboard · front desk · door
  terminal · member portal` · Stack `Next.js 14, TypeScript, Tailwind` · Currency / locale
  `MAD · French` · Status `Live, in daily use`
- Flow: `Member onboarding` (Profile, plan, payment method captured once.) → `QR access terminal`
  (Pass scanned at the door; expiry enforced automatically.) → `Automated POS & billing`
  (Recurring charges, MAD invoices, outstanding tracking.) → `Retention signals` (Lapse and expiry
  alerts pushed over WhatsApp.)
- Chapters:
  - *The bottleneck* — **Membership was a notebook and the door was a person.** Two paragraphs:
    renewals tracked on paper so nobody knew who had lapsed until they walked in and argued about
    it; access control was whoever happened to be at the desk; revenue a monthly guess assembled
    from receipt books. Then: the owner did not need a website — he needed to know, at any hour,
    how many members are active, how much money is actually committed this month, and who is
    inside the building right now.
  - *The decision* — **One record per member, everything else reads from it.** We refused a
    multi-tool setup; every surface reads and writes the same member record; a membership that
    expires stops opening the door without anyone doing anything. Spec grid: Access / Billing /
    Scheduling / Notifications (see reference file for exact values).
  - *What it does now* — **The dashboard is the first thing opened and the last thing closed.**
    Active members, committed monthly revenue, today's check-ins, passes expiring inside seven
    days and payments still outstanding on one screen in MAD; live entry feed shows each scan at
    the QR portico. Front desk staff trained in an afternoon because the interface is built around
    the four things they actually do rather than around the database.

### 02 — EstatePulse

- Sector `Real estate`, status `In production`, accent `#1B4DE4`,
  URL `veloce.studio/estatepulse`, window `09:00 → 19:00`.
- One-liner: *A property marketplace with a real sales pipeline behind it — public buyers on one
  side, agents working leads on the other.*
- Tags: Map discovery · Lead intake · Kanban pipeline · 3D tours
- Shot caption: *Public buyer search — map discovery with virtual tour listings*
- Load: `0,0,0,0,0,0,0,.1,.3,.7,.95,.8,.5,.6,.85,1,.8,.6,.35,.15,0,0,0,0`
- Load note: *Buyers browse late morning and again mid-afternoon, which is exactly when agents are
  out on viewings. That gap is why lead capture had to be automatic rather than someone noticing a
  message.*
- Chapters: *Listings lived on portals; leads died in WhatsApp.* / *Treat the marketplace and the
  CRM as one system, not two products.* / *An agent opens one board and knows the day.*
- Flow: Map discovery → Lead ingestion → Kanban pipeline → Tour scheduling

### 03 — SalonFlow

- Sector `Beauty & wellness`, status `In production`, accent `#A31C4B`,
  URL `veloce.studio/salonflow`, window `09:00 → 20:00`.
- One-liner: *Salon booking that knows which stylist can actually do the service, plus the POS and
  the client history behind the chair.*
- Tags: Specialist scheduling · Double-booking guard · POS checkout · Client history
- Shot caption: *Client-facing booking — service selection and specialist availability*
- Load: `0,0,0,0,0,0,0,.1,.4,.85,1,.9,.6,.7,.9,.95,.85,.7,.5,.3,.12,0,0,0`
- Load note: *The salon runs near capacity for most of the day with a dip at lunch. When every hour
  is nearly full, a single double-booking cascades through the rest of the day — which is why the
  constraint is modelled, not the calendar.*
- Chapters: *A shared calendar cannot know that only two people cut curly hair.* / *Model the
  constraint, not the calendar.* / *Reception stopped being the database.*
- Flow: Service selection → Double-booking guard → POS checkout → Client retention

### 04 — Restaurant ecosystem

- Sector `Restaurant ops`, status `Dual system, live`, accent `#C7371A`,
  URL `veloce.studio/restaurant-ecosystem`, window `11:00 → 24:00`.
- One-liner: *Two connected apps: a QR menu guests order from, and a kitchen terminal that
  dispatches and tracks every ticket.*
- Tags: Table QR ordering · Kitchen display · Direct dispatch · Delivery register
- Shot caption: *Guest-facing QR menu — Il Piatto Gastronomy ordering surface*
- Load: `0,0,0,0,0,0,0,0,0,0,.1,.4,.9,1,.6,.3,.35,.5,.75,1,.95,.7,.4,.18`
- Load note: *Two hard services, lunch and dinner, with dinner the heavier of the two. Everything
  in the design answers one question: how many minutes has this ticket been waiting, and can the
  room see it.*
- Spec first row is `Deployments` — `Il Piatto (guest menu) · Dajjaj Hamoud (kitchen terminal)`.
- Chapters: *The order was retyped three times before it reached a pan.* / *The guest's tap is the
  kitchen's ticket. No step in between.* / *Nobody retypes an order.*
- Flow: Table QR scan → Direct dispatch → Kitchen KDS tracking → Delivery register

Full paragraph text for every chapter is in the reference HTML — lift the strings from there
rather than retyping.

## Interactions & behavior

### Navigation

- Header `The day` / `Systems` / `Method` are plain in-page hash anchors on the homepage.
- Clicking a project row (or the "Next build" link) switches to the case view and scrolls to top.
- The back link and header nav return to the homepage. **Two bugs to avoid** — both were real
  defects in the reference:
  1. Do **not** blanket-`preventDefault()` on nav anchors. When already on the homepage, let the
     hash jump happen natively. Only intercept when leaving a case view — and then, after the view
     switches, scroll manually to the target section (`element.top + scrollY − 84`, the 84px
     clearing the 68px sticky header).
  2. `#top` must not trigger a manual scroll offset; treat it as "top of page".

### Scroll reveal

`[data-reveal]` elements — the index header, the four project rows, the three removal cells, the
"What we remove" and "How a build runs" headers, and the four method columns (14 total) — start at
`opacity: 0`, `translateY(24px)` and animate to `opacity: 1`, `transform: none` over 700ms
`cubic-bezier(.22,.61,.36,1)` with a stagger of `(index % 4) * 70ms`.

Three failure modes to handle — the reference shipped this wrong once and stranded content
permanently invisible:

1. Reveal on intersection **or** when `boundingClientRect.top < 0` — an element scrolled past
   above the viewport must still resolve.
2. Before observing, immediately reveal anything already within `0.92 × innerHeight` — covers
   deep-link/hash jumps, browser scroll restoration and short viewports.
3. Keep a hard fallback (a ~9s timer) that reveals every node unconditionally. Content must never
   be able to stay hidden.

Disconnect the observer before re-registering (returning to the homepage re-runs setup) and clear
both the observer and the timer on unmount.

Respect `prefers-reduced-motion`: skip the reveal offsets, the hero stagger and the marquee; the
dial can hold at a static hour.

### State

- `view`: `'home' | 'case'`
- `slug`: which project the case view shows
- `active`: hovered index in the production index (drives wipe, preview, URL, chart)
- `log`: last 7 fired events, newest first
- `chartOn`: gate for the case-study bar entrance (false → true ~140ms after view switch)
- Dial hand rotation and clock text are **not** state — mutate the DOM in the rAF loop.

No data fetching. All content is static; put the project array and event script in a typed module.

## Design tokens

### Color

| Token | Hex | Use |
|-------|-----|-----|
| paper | `#F2EFE8` | page background |
| paper-alt | `#EAE6DC` | hover fill, URL field |
| ink | `#17150F` | text, structural hairlines, dark bands |
| ink-soft | `#2A2620` | long-form body copy |
| ink-muted | `#3B372E` | secondary body copy |
| grey-600 | `#5A554A` | tag chips, flow detail |
| grey-400 | `#8A857A` | mono meta, labels, axis |
| line | `#D6D1C5` | internal hairlines, grid gaps |
| line-alt | `#C9C4B7` | chip borders, minor ticks |
| track | `#E3DFD4` | dial ring track |
| on-dark | `#F2EFE8` | text on ink |
| on-dark-muted | `#A8A29A` | body copy on ink |
| on-dark-log | `#EDE9E0` | log text |
| line-dark | `#4A453C` | hairlines on ink |
| line-dark-alt | `#3A362E` | log panel divider |
| accent | `#C7371A` | brand accent (tweakable) |

System / project colors: `#0F7B5A` FitPulse · `#1B4DE4` EstatePulse · `#A31C4B` SalonFlow ·
`#C7371A` Il Piatto & restaurant · `#7A5C00` Dajjaj KDS.

The accent is a single exposed knob in the reference (options `#C7371A`, `#1B4DE4`, `#0F7B5A`,
`#17150F`). Keep it as one variable — it drives the eyebrow dot, marquee diamonds, section
eyebrows, and the primary button.

### Typography

Two families, both Google Fonts, weights 400/500/600/800/900 and 400/500/700:

- **Archivo** — display and body.
- **JetBrains Mono** — all meta, labels, specs, the clock, the log, the ticker.

The mono/grotesque split is the identity: anything factual or instrument-like is mono; anything
argued in prose is Archivo. Do not substitute Inter or Roboto.

| Role | Size | Weight | Tracking | Leading |
|------|------|--------|----------|---------|
| Hero h1 | `clamp(46px, 6.1vw, 100px)` | 900 | `-0.04em` | 0.92 |
| Case h1 | `clamp(44px, 5.6vw, 88px)` | 900 | `-0.04em` | 0.93 |
| Band h2 | `clamp(38px, 4.6vw, 68px)` | 900 | `-0.035em` | 0.98 |
| Next-build link | `clamp(36px, 5vw, 76px)` | 900 | `-0.04em` | 1 |
| Clock readout (mono) | 42px | 700 | `-0.03em` | 1.05 |
| Method numeral | 42px | 900 | `-0.04em` | 1 |
| Project row title | 30px | 800 | `-0.025em` | 1.1 |
| Chapter h2 | 29px | 800 | `-0.025em` | 1.12 |
| Removal h3 | 25px | 800 | `-0.02em` | 1.15 |
| Lead paragraph | 21px | 400 | — | 1.42–1.45 |
| Chapter body | 18px | 400 | — | 1.58 |
| Method h3 | 19px | 800 | `-0.015em` | — |
| Flow step | 17px | 800 | `-0.015em` | 1.2 |
| Body | 15–16.5px | 400 | — | 1.45–1.55 |
| Log entry (mono) | 12.5px | 400 | — | 1.5 |
| Section label (mono) | 12px | 500 | `0.12em` | — |
| Meta (mono) | 11–11.5px | 400 | `0.04–0.1em` | — |
| Chip / axis (mono) | 10.5px | 400 | `0.05–0.06em` | — |

Uppercase every mono label. Prose uses `text-wrap: pretty`; short headings use `text-wrap: balance`.
Measure caps: body `46ch`/`50ch`, chapter body `68ch`, dark-band copy `56ch`/`58ch`.

### Spacing / geometry

Section rhythm `116px`; internal steps `7 · 9 · 10 · 12 · 14 · 18 · 20 · 22 · 26 · 32 · 34 · 40 ·
44 · 56 · 64px`. Gutter `40px`. Content max width `1440px`. Column gaps: `56px` (index, day),
`64px` (chapters, title block, dark band), `32px` (method).

Radius `0` everywhere except the three chrome dots and the status dot (`50%`). No shadows.
Borders are always `1px` except the method column rule (`2px`) and the dial rings (`7px` strokes).

### Motion

| Name | Duration | Easing | Notes |
|------|----------|--------|-------|
| `vs-rise` | 800ms (hero) / 620ms (case) | `cubic-bezier(.22,.61,.36,1)` | `opacity 0→1`, `translateY(26px)→0` |
| hero stagger | — | — | 60 / 150 / 240 / 330ms |
| `vs-slide` | 42s | linear infinite | marquee, `translateX(0 → -50%)` |
| `vs-blink` | 2.4s | `steps(1)` infinite | status dot, opacity 1 → 0.15 at 60% |
| `vs-logIn` | 460ms | `cubic-bezier(.22,.61,.36,1)` | `opacity 0→1`, `translateY(-10px)→0` |
| `vs-ping` | 900ms | `ease-out forwards` | SVG `r` 3.5→13, opacity 1→0 |
| reveal | 700ms | `cubic-bezier(.22,.61,.36,1)` | stagger `(i % 4) * 70ms` |
| preview crossfade | 460ms opacity / 900ms transform | `cubic-bezier(.22,.61,.36,1)` | scale 1.05 → 1 |
| row accent wipe | 620ms | `cubic-bezier(.22,.61,.36,1)` | width 0 → 100% |
| bar growth | 780ms | `cubic-bezier(.22,.61,.36,1)` | stagger `i * 22ms` |
| dial day | 26000ms | linear, looping | hand + clock, rAF |

`cubic-bezier(.22,.61,.36,1)` is the house easing — use it for anything not listed.

## Assets

`assets/proj-fitpulse.png`, `assets/proj-estatepulse.png`, `assets/proj-salonflow.png`,
`assets/proj-restaurant.png` — four screenshots, ~552×280 each.

**These are placeholders and should be replaced.** They were cropped out of a screenshot of the
previous Veloce site, so they are lossy, low-resolution and re-encoded. Before launch, capture the
four apps directly at 2× (target ~1600×812, same 552:280 ratio, `top center` anchored) and swap
them in. They are the largest visual quality gap in the build.

No icons, no illustrations, no logo file — the wordmark is live text.

## Content status — read before launch

The copy deliberately contains **no invented metrics, client logos, testimonials or live URLs**,
because none were supplied. Everything asserted is verifiable from Veloce's own material
(Casablanca, MAD, French UI, WhatsApp notifications, QR terminals, Next.js 14 stack, the
Il Piatto / Dajjaj Hamoud deployments, 148 active memberships from the FitPulse dashboard).

Two items are illustrative and must not be presented as measured data:

1. **The 24-hour load profiles** — shape-accurate to each business type, not telemetry. They are
   labelled "Activity profile" for that reason. Keep the label, or replace the arrays with real
   numbers.
2. **The event script** — a representative day, not a log export.

The `veloce.studio/...` URL-bar strings are illustrative too. Point them at real deployments or
drop the URL field.

Highest-value additions, in order: real outcome metrics per case study, named clients with
permission, live app links, one client quote each.

## Deployment (Netlify)

Static output, no server runtime needed. For Next.js, `output: 'export'` plus
`@netlify/plugin-nextjs`, or any static host. Points to watch:

- Self-host or `next/font` the two Google families rather than a render-blocking `<link>`; the
  hero stagger is the first thing a visitor sees and should not wait on a font swap.
- The dial is one `<svg>` plus one rAF loop — no chart library, no canvas. Do not pull in a
  charting dependency for the bar charts either; they are flex children with a height percentage.
- Serve the screenshots as WebP/AVIF with explicit dimensions to hold the `552 / 280` box.
- `prefers-reduced-motion` handling is a launch requirement, not a nice-to-have.

## Files

| File | What it is |
|------|------------|
| `Veloce Studio Site v2.dc.html` | **Primary reference.** Current design: dial, live log, reveals, hover previews, four case studies. |
| `Veloce Studio Site.dc.html` | Earlier version, kept for history: same identity and copy, no dial/log/motion. Useful only as a diff. |
| `assets/proj-*.png` | The four screenshots (placeholders — see Assets). |

Both HTML files need the proprietary runtime to render and are reference material only. Read them
for exact strings and values; implement in the target framework.
