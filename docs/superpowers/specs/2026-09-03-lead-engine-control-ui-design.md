# Veloce Lead Engine Control UI — Design

Extends the multi-source design of 2026-09-02. Nothing in this document is built.

## Decision record

- **The control app is local-only and lives outside the deployed site.** A Vite + React app in `lead-engine/ui`, served by a small API in `lead-engine/api` bound to `127.0.0.1`. It must never live under `app/`, which deploys to Netlify — prospect-handling code there would put contact data on the public internet, against D4.
- **Configuration is two-tier.** Tunable values are settings. Guarantees are not, and no UI control exists for them.
- **Tunable config lives in the repository**, at `lead-engine/config/tuning.json`. It holds no personal data, so version control is safe — and git history becomes the audit trail for every threshold change.
- **Human decisions are inputs to resolution, not outputs of it.** Each answer in the "same business?" queue is stored as an immutable `Verdict`. The resolver applies verdicts before scoring, so no configuration can overturn a human judgement.
- **Calibration is sandboxed.** It runs in memory against a snapshot. Promoting writes config and shows the live diff for confirmation before the store changes.
- **No single accuracy number is ever shown.** False merges and missed merges are separate figures, because their consequences are not comparable.
- **Defaults bias toward under-merging.** Seeing one salon twice is an annoyance; approaching one business with another's details is the failure the design exists to prevent.
- **Calibration ships before the operator console.** A queue fed by an untuned matcher is not worth working.

## The two tiers

**Tunable** — merge threshold, ambiguity floor, proximity radius, shared-contact threshold, scoring weights, which sources are enabled, retention per segment, the weekly outreach cap.

**Locked** — whether a source is citable, whether any send capability exists, whether opt-out is enforced across sources, whether Places payload is discarded, whether prospect data may sit in the repository, whether the API binds anything but loopback. These are code plus test plus review. They have no representation in config and no control in the UI.

The application's first screen displays the locked tier rather than hiding it: each guarantee, the test that enforces it, and whether that test currently passes. A control panel that shows what it refuses to control is a better answer to "full control" than one that quietly permits everything.

## Configuration

`lead-engine/config/tuning.json`, validated on load. Unknown keys are rejected rather than ignored, so a typo fails loudly instead of silently reverting a threshold to its default.

```json
{
  "schemaVersion": 1,
  "resolution": {
    "mergeThreshold": 0.85,
    "ambiguityFloor": 0.55,
    "proximityMetres": 150,
    "sharedContactThreshold": 3
  },
  "sources": {
    "openstreetmap": { "enabled": true },
    "telecontact": { "enabled": false },
    "pj": { "enabled": false },
    "glovo": { "enabled": false },
    "kaalix": { "enabled": false },
    "instagram": { "enabled": false },
    "facebook": { "enabled": false }
  }
}
```

`enabled` is the only per-source setting. A source's `role` — citable or signal-only — is read from the code registry and is not expressible here.

Bounds are enforced on load: `ambiguityFloor` must be below `mergeThreshold`, thresholds sit in `0..1`, `proximityMetres` and `sharedContactThreshold` are positive. A configuration that inverts the ambiguity band is a validation error, not a surprising cluster count later.

## Verdicts

```ts
interface Verdict {
  id: string;
  aSightingId: string;
  bSightingId: string;
  decision: 'same' | 'different';
  decidedAt: string;
  note?: string;
}
```

Verdicts reference sightings, which are prospect data, so they live encrypted in the data directory outside the repository — unlike config.

They are applied before scoring and always win. `same` forces a merge at any threshold. `different` forbids one, including a merge that would otherwise happen *transitively*: if A and B merge by score, and B and C merge by score, but a verdict says A and C are different, the chain must not quietly unify all three.

The resolver therefore considers merges in descending score order and, before each union, checks whether joining the two clusters would place any `different` pair together. If it would, the union is skipped and a `ConstraintConflict` is recorded naming the verdict that blocked it. Conflicts are surfaced, never silently resolved — a pair of verdicts that contradict each other is a human error worth seeing.

## Resolver extension

`resolve(sightings)` becomes:

```ts
resolve(
  sightings: Sighting[],
  opts?: { config?: ResolutionConfig; verdicts?: Verdict[] },
): { businesses: Business[]; candidates: MergeCandidate[]; conflicts: ConstraintConflict[] }
```

Additive: omitting `opts` uses the compiled defaults and no verdicts, so existing callers and tests keep working.

## Calibration

A snapshot is the current sighting set, loaded read-only. A calibration run resolves that snapshot under a candidate configuration entirely in memory, and reports:

- **False merges** — pairs a human marked `different` that this configuration would merge. Listed individually, never as a percentage. This is the number that matters.
- **Missed merges** — pairs marked `same` that this configuration would leave apart. A real cost, an order of magnitude less serious.
- **Still ambiguous** — labelled pairs landing in the band, which is neither an error nor a success.
- **Cluster counts and the largest clusters**, so a configuration that collapses half the dataset is obvious at a glance.

Because verdicts force their own outcome, calibration scores each labelled pair with that pair's verdict withheld. Otherwise every configuration would appear perfect on exactly the pairs being measured.

Promoting a candidate configuration validates it, writes `tuning.json`, and returns the diff against live data — which businesses would merge, which would split — for confirmation before anything is written to the store.

## API

Bound to `127.0.0.1` and refusing any other interface. No authentication, per D4: there is no hosted surface and no account to protect.

| Route | Purpose |
|---|---|
| `GET /api/guarantees` | The locked tier and each invariant's current test status |
| `GET /api/sources` | Registry entries, role, enabled state, sighting counts |
| `GET /api/config` | The live tuning configuration |
| `POST /api/calibrate` | Resolve a snapshot under a candidate config; returns metrics, clusters, and the diff against live |
| `POST /api/config/promote` | Validate, write `tuning.json`, return the applied diff |

No route sends anything to a prospect, and the no-send invariant covers this package as it covers the core.

## Screens

**Guarantees** — the locked tier, read-only, with test status.

**Sources** — the register. Role is a badge and cannot be edited; `enabled` is the only control. Shows sighting counts and last ingest per source.

**Calibration** — the four thresholds, the two error counts kept visually apart, a cluster explorer for inspecting what merged and what sits in the band, and a diff against live config behind the Promote action.

## Scope boundary

Deferred to the operator-console plan, with no task here: the review queue and its approve-for-offer decisions, the merge-candidate answering flow that produces verdicts in the first place, opt-out management, ingest runs, retention purge, and the Places check.

Verdicts are read by this plan and written by the next. Until then they are seeded from a JSON file so calibration can be exercised and tested.

## Open questions

- Whether the largest useful snapshot fits comfortably in memory for live threshold dragging, or whether calibration needs a sampled subset. Answerable only against a real ingest.
- Whether `enabled: false` should exclude a source's existing sightings from resolution, or only stop new ingests from it. Current assumption: only stop new ingests, since retroactively hiding evidence would silently change resolution.
