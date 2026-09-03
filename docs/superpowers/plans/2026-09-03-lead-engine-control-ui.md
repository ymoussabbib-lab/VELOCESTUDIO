# Lead Engine Control UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A local-only control panel for tuning the resolver — adjust thresholds against a snapshot, see false and missed merges separately, and promote a configuration with a reviewable diff.

**Architecture:** Tunable settings live in a validated JSON file in the repo; guarantees stay in code and are displayed read-only. Human merge decisions become immutable `Verdict` records that the resolver applies before scoring, so no configuration can overturn one. A loopback-bound API imports the core; a Vite/React app consumes it.

**Tech Stack:** TypeScript, Node 20, Vitest, Vite, React 18. No new runtime dependency in the core.

**Spec:** `docs/superpowers/specs/2026-09-03-lead-engine-control-ui-design.md`

**Depends on:** `docs/superpowers/plans/2026-09-02-lead-engine-resolution-core.md` must be complete and merged. This plan modifies `lead-engine/src/resolve/resolve.ts`, which that plan creates.

## Global Constraints

- **No send function may exist**, in the core or in this package.
- **The API binds `127.0.0.1` only** and refuses any other interface.
- **No UI control exists for a locked guarantee** — source role, send capability, opt-out enforcement, Places payload discard, data location, API binding.
- **No prospect data in the repository.** `tuning.json` holds numbers and booleans only; verdicts reference sightings and therefore live in the encrypted store outside the repo.
- **Never report a single accuracy figure.** False merges and missed merges stay separate, and false merges are listed individually.
- **`resolve()` changes must be additive.** Calling it without `opts` keeps the behaviour and signature that the resolution-core plan's tests assert.

## File Structure

| File | Responsibility |
|---|---|
| `lead-engine/config/tuning.json` | The tunable tier, version controlled |
| `lead-engine/src/config/schema.ts` | `ResolutionConfig`, defaults, validation with bounds |
| `lead-engine/src/config/load.ts` | Read, validate and write `tuning.json` |
| `lead-engine/src/resolve/verdicts.ts` | `Verdict`, `ConstraintConflict`, constraint index |
| `lead-engine/src/resolve/resolve.ts` | Extended to take config and verdicts (modified) |
| `lead-engine/src/calibrate/metrics.ts` | Scores a config against verdicts, with each pair withheld |
| `lead-engine/src/calibrate/diff.ts` | Cluster diff between two resolutions |
| `lead-engine/api/server.ts` | Loopback-bound HTTP server and routes |
| `lead-engine/api/guarantees.ts` | The locked tier and its test status |
| `lead-engine/ui/` | Vite + React app: Guarantees, Sources, Calibration |

---

### Task 1: Config schema, defaults and validation

**Files:**
- Create: `lead-engine/src/config/schema.ts`, `lead-engine/config/tuning.json`
- Test: `lead-engine/src/config/schema.test.ts`

**Interfaces:**
- Consumes: `SourceId` from `../sources/types`
- Produces: `ResolutionConfig`, `TuningConfig`, `DEFAULT_TUNING: TuningConfig`, `validateTuning(input: unknown): TuningConfig` (throws `Error` with a specific message on any violation)

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { validateTuning, DEFAULT_TUNING } from './schema';

const valid = () => JSON.parse(JSON.stringify(DEFAULT_TUNING));

describe('validateTuning', () => {
  it('accepts the shipped defaults', () => {
    expect(validateTuning(valid())).toEqual(DEFAULT_TUNING);
  });

  it('rejects an ambiguity floor at or above the merge threshold', () => {
    const c = valid();
    c.resolution.ambiguityFloor = 0.9;
    c.resolution.mergeThreshold = 0.85;
    expect(() => validateTuning(c)).toThrow(/ambiguityFloor must be below mergeThreshold/);
  });

  it('rejects a threshold outside 0..1', () => {
    const c = valid();
    c.resolution.mergeThreshold = 1.4;
    expect(() => validateTuning(c)).toThrow(/mergeThreshold must be between 0 and 1/);
  });

  it('rejects a non-positive proximity radius', () => {
    const c = valid();
    c.resolution.proximityMetres = 0;
    expect(() => validateTuning(c)).toThrow(/proximityMetres must be positive/);
  });

  it('rejects unknown keys rather than ignoring them', () => {
    const c = valid();
    c.resolution.mergeThreshhold = 0.9;
    expect(() => validateTuning(c)).toThrow(/unknown key: resolution.mergeThreshhold/);
  });

  it('rejects an unknown source id', () => {
    const c = valid();
    c.sources.linkedin = { enabled: true };
    expect(() => validateTuning(c)).toThrow(/unknown source: linkedin/);
  });

  it('rejects a source entry carrying a role', () => {
    const c = valid();
    c.sources.instagram = { enabled: true, role: 'citable' };
    expect(() => validateTuning(c)).toThrow(/role is not configurable/);
  });

  it('rejects an unsupported schemaVersion', () => {
    const c = valid();
    c.schemaVersion = 99;
    expect(() => validateTuning(c)).toThrow(/unsupported schemaVersion/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run leads:test`
Expected: FAIL — cannot resolve `./schema`.

- [ ] **Step 3: Write minimal implementation**

```ts
import { SOURCE_REGISTRY } from '../sources/registry';
import type { SourceId } from '../sources/types';

export interface ResolutionConfig {
  mergeThreshold: number;
  ambiguityFloor: number;
  proximityMetres: number;
  sharedContactThreshold: number;
}

export interface TuningConfig {
  schemaVersion: 1;
  resolution: ResolutionConfig;
  sources: Record<SourceId, { enabled: boolean }>;
}

export const DEFAULT_TUNING: TuningConfig = {
  schemaVersion: 1,
  resolution: {
    mergeThreshold: 0.85,
    ambiguityFloor: 0.55,
    proximityMetres: 150,
    sharedContactThreshold: 3,
  },
  sources: Object.fromEntries(
    Object.keys(SOURCE_REGISTRY).map((id) => [id, { enabled: id === 'openstreetmap' }]),
  ) as Record<SourceId, { enabled: boolean }>,
};

const RESOLUTION_KEYS = ['mergeThreshold', 'ambiguityFloor', 'proximityMetres', 'sharedContactThreshold'];

function fail(message: string): never {
  throw new Error(`Invalid tuning config — ${message}`);
}

export function validateTuning(input: unknown): TuningConfig {
  const c = input as TuningConfig;
  if (!c || typeof c !== 'object') fail('expected an object');
  if (c.schemaVersion !== 1) fail(`unsupported schemaVersion: ${c.schemaVersion}`);

  const r = c.resolution;
  if (!r || typeof r !== 'object') fail('missing resolution block');
  for (const key of Object.keys(r)) {
    if (!RESOLUTION_KEYS.includes(key)) fail(`unknown key: resolution.${key}`);
  }
  for (const key of ['mergeThreshold', 'ambiguityFloor'] as const) {
    const v = r[key];
    if (typeof v !== 'number' || v < 0 || v > 1) fail(`${key} must be between 0 and 1`);
  }
  if (r.ambiguityFloor >= r.mergeThreshold) fail('ambiguityFloor must be below mergeThreshold');
  if (typeof r.proximityMetres !== 'number' || r.proximityMetres <= 0) fail('proximityMetres must be positive');
  if (typeof r.sharedContactThreshold !== 'number' || r.sharedContactThreshold <= 0) {
    fail('sharedContactThreshold must be positive');
  }

  if (!c.sources || typeof c.sources !== 'object') fail('missing sources block');
  for (const [id, entry] of Object.entries(c.sources)) {
    if (!(id in SOURCE_REGISTRY)) fail(`unknown source: ${id}`);
    for (const key of Object.keys(entry)) {
      if (key === 'role') fail('role is not configurable — it lives in the source registry');
      if (key !== 'enabled') fail(`unknown key: sources.${id}.${key}`);
    }
    if (typeof entry.enabled !== 'boolean') fail(`sources.${id}.enabled must be a boolean`);
  }
  return c;
}
```

- [ ] **Step 4: Write the shipped config file**

Create `lead-engine/config/tuning.json` containing exactly the JSON form of `DEFAULT_TUNING`.

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run leads:test`
Expected: PASS, 8 tests.

- [ ] **Step 6: Commit**

```bash
git add lead-engine/src/config/schema.ts lead-engine/src/config/schema.test.ts lead-engine/config/tuning.json
git commit -m "feat(leads): add validated tuning config schema"
```

---

### Task 2: Config loading and writing

**Files:**
- Create: `lead-engine/src/config/load.ts`
- Test: `lead-engine/src/config/load.test.ts`

**Interfaces:**
- Consumes: `validateTuning`, `TuningConfig` from `./schema`
- Produces: `loadTuning(file: string): Promise<TuningConfig>`; `writeTuning(file: string, config: TuningConfig): Promise<void>`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { loadTuning, writeTuning } from './load';
import { DEFAULT_TUNING } from './schema';

let dir: string;
beforeEach(() => { dir = mkdtempSync(path.join(tmpdir(), 'leads-cfg-')); });

describe('tuning config file', () => {
  it('loads and validates a good file', async () => {
    const f = path.join(dir, 'tuning.json');
    writeFileSync(f, JSON.stringify(DEFAULT_TUNING));
    expect(await loadTuning(f)).toEqual(DEFAULT_TUNING);
  });

  it('reports the file path when validation fails', async () => {
    const f = path.join(dir, 'tuning.json');
    const bad = JSON.parse(JSON.stringify(DEFAULT_TUNING));
    bad.resolution.ambiguityFloor = 0.99;
    writeFileSync(f, JSON.stringify(bad));
    await expect(loadTuning(f)).rejects.toThrow(/tuning\.json/);
  });

  it('fails loudly on malformed JSON', async () => {
    const f = path.join(dir, 'tuning.json');
    writeFileSync(f, '{ not json');
    await expect(loadTuning(f)).rejects.toThrow();
  });

  it('round-trips a written config', async () => {
    const f = path.join(dir, 'tuning.json');
    const next = JSON.parse(JSON.stringify(DEFAULT_TUNING));
    next.resolution.mergeThreshold = 0.9;
    await writeTuning(f, next);
    expect(await loadTuning(f)).toEqual(next);
  });

  it('refuses to write an invalid config', async () => {
    const f = path.join(dir, 'tuning.json');
    const bad = JSON.parse(JSON.stringify(DEFAULT_TUNING));
    bad.resolution.proximityMetres = -1;
    await expect(writeTuning(f, bad)).rejects.toThrow(/proximityMetres must be positive/);
  });

  it('writes readable, diff-friendly JSON', async () => {
    const f = path.join(dir, 'tuning.json');
    await writeTuning(f, DEFAULT_TUNING);
    expect(readFileSync(f, 'utf8')).toContain('\n  "resolution"');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run leads:test`
Expected: FAIL — cannot resolve `./load`.

- [ ] **Step 3: Write minimal implementation**

```ts
import { readFile, writeFile } from 'node:fs/promises';
import { validateTuning, type TuningConfig } from './schema';

export async function loadTuning(file: string): Promise<TuningConfig> {
  const raw = await readFile(file, 'utf8');
  const parsed = JSON.parse(raw) as unknown;
  try {
    return validateTuning(parsed);
  } catch (err) {
    throw new Error(`${(err as Error).message} (in ${file})`);
  }
}

export async function writeTuning(file: string, config: TuningConfig): Promise<void> {
  validateTuning(config);
  await writeFile(file, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run leads:test`
Expected: PASS, 6 tests.

- [ ] **Step 5: Commit**

```bash
git add lead-engine/src/config/load.ts lead-engine/src/config/load.test.ts
git commit -m "feat(leads): load and write tuning config with validation"
```

---

### Task 3: Verdicts and the constraint index

**Files:**
- Create: `lead-engine/src/resolve/verdicts.ts`
- Test: `lead-engine/src/resolve/verdicts.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `Verdict`, `ConstraintConflict`; `pairKey(a: string, b: string): string`; `buildConstraints(verdicts: Verdict[]): { forcedSame: [string, string][]; forbidden: Set<string>; contradictions: ConstraintConflict[] }`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { buildConstraints, pairKey, type Verdict } from './verdicts';

function v(a: string, b: string, decision: 'same' | 'different'): Verdict {
  return { id: `${a}-${b}`, aSightingId: a, bSightingId: b, decision, decidedAt: '2026-09-03T00:00:00.000Z' };
}

describe('pairKey', () => {
  it('is order independent', () => {
    expect(pairKey('a', 'b')).toBe(pairKey('b', 'a'));
  });
});

describe('buildConstraints', () => {
  it('collects forced-same pairs', () => {
    const c = buildConstraints([v('a', 'b', 'same')]);
    expect(c.forcedSame).toEqual([['a', 'b']]);
  });

  it('collects forbidden pairs order independently', () => {
    const c = buildConstraints([v('a', 'b', 'different')]);
    expect(c.forbidden.has(pairKey('b', 'a'))).toBe(true);
  });

  it('reports a direct contradiction', () => {
    const c = buildConstraints([v('a', 'b', 'same'), v('b', 'a', 'different')]);
    expect(c.contradictions).toHaveLength(1);
    expect(c.contradictions[0].reason).toMatch(/contradictory verdicts/);
  });

  it('has no contradictions for consistent input', () => {
    const c = buildConstraints([v('a', 'b', 'same'), v('c', 'd', 'different')]);
    expect(c.contradictions).toEqual([]);
  });

  it('handles an empty verdict list', () => {
    const c = buildConstraints([]);
    expect(c.forcedSame).toEqual([]);
    expect(c.forbidden.size).toBe(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run leads:test`
Expected: FAIL — cannot resolve `./verdicts`.

- [ ] **Step 3: Write minimal implementation**

```ts
export interface Verdict {
  id: string;
  aSightingId: string;
  bSightingId: string;
  decision: 'same' | 'different';
  decidedAt: string;
  note?: string;
}

export interface ConstraintConflict {
  aSightingId: string;
  bSightingId: string;
  reason: string;
}

export function pairKey(a: string, b: string): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

export function buildConstraints(verdicts: Verdict[]): {
  forcedSame: [string, string][];
  forbidden: Set<string>;
  contradictions: ConstraintConflict[];
} {
  const same = new Map<string, [string, string]>();
  const forbidden = new Set<string>();
  const contradictions: ConstraintConflict[] = [];

  for (const verdict of verdicts) {
    const key = pairKey(verdict.aSightingId, verdict.bSightingId);
    if (verdict.decision === 'same') same.set(key, [verdict.aSightingId, verdict.bSightingId]);
    else forbidden.add(key);
  }
  for (const [key, pair] of same) {
    if (forbidden.has(key)) {
      contradictions.push({
        aSightingId: pair[0],
        bSightingId: pair[1],
        reason: 'contradictory verdicts: marked both same and different',
      });
    }
  }
  return { forcedSame: [...same.values()], forbidden, contradictions };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run leads:test`
Expected: PASS, 6 tests.

- [ ] **Step 5: Commit**

```bash
git add lead-engine/src/resolve/verdicts.ts lead-engine/src/resolve/verdicts.test.ts
git commit -m "feat(leads): add verdict model and constraint index"
```

---

### Task 4: Resolver takes config and verdicts

The task that makes a human judgement impossible to overturn with a slider.

**Files:**
- Modify: `lead-engine/src/resolve/resolve.ts`
- Test: `lead-engine/src/resolve/resolve-constraints.test.ts`

**Interfaces:**
- Consumes: `ResolutionConfig` from `../config/schema`; `Verdict`, `ConstraintConflict`, `buildConstraints`, `pairKey` from `./verdicts`
- Produces: `resolve(sightings, opts?: { config?: ResolutionConfig; verdicts?: Verdict[] }): { businesses; candidates; conflicts: ConstraintConflict[] }`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { resolve } from './resolve';
import { DEFAULT_TUNING } from '../config/schema';
import type { Verdict } from './verdicts';
import type { Sighting, SourceId } from '../sources/types';

function s(id: string, name: string, o: { phones?: string[]; lat?: number; lon?: number; source?: SourceId } = {}): Sighting {
  return { id, source: o.source ?? 'openstreetmap', sourceId: id, fetchedAt: '2026-09-03T00:00:00.000Z',
    raw: {}, extracted: { name, phones: o.phones ?? [], emails: [], lat: o.lat, lon: o.lon } };
}
function v(a: string, b: string, decision: 'same' | 'different'): Verdict {
  return { id: `${a}-${b}`, aSightingId: a, bSightingId: b, decision, decidedAt: '2026-09-03T00:00:00.000Z' };
}

describe('resolve with verdicts', () => {
  it('merges a forced-same pair that scoring would leave apart', () => {
    const { businesses } = resolve(
      [s('a', 'Salon Yasmine'), s('b', 'Coiffure Chez Yasmine')],
      { verdicts: [v('a', 'b', 'same')] },
    );
    expect(businesses).toHaveLength(1);
  });

  it('keeps a forbidden pair apart despite an exact match', () => {
    const { businesses } = resolve(
      [s('a', 'Salon Yasmine', { phones: ['+212611111111'] }),
       s('b', 'Salon Yasmine', { phones: ['+212611111111'] })],
      { verdicts: [v('a', 'b', 'different')] },
    );
    expect(businesses).toHaveLength(2);
  });

  it('blocks a transitive merge that would unify a forbidden pair', () => {
    const { businesses, conflicts } = resolve(
      [s('a', 'Salon Yasmine', { lat: 34.0200, lon: -6.8400 }),
       s('b', 'Salon Yasmine', { lat: 34.0201, lon: -6.8400 }),
       s('c', 'Salon Yasmine', { lat: 34.0202, lon: -6.8400 })],
      { verdicts: [v('a', 'c', 'different')] },
    );
    expect(businesses.length).toBeGreaterThan(1);
    expect(conflicts.length).toBeGreaterThan(0);
  });

  it('surfaces contradictory verdicts', () => {
    const { conflicts } = resolve(
      [s('a', 'Salon Yasmine'), s('b', 'Salon Yasmine')],
      { verdicts: [v('a', 'b', 'same'), v('a', 'b', 'different')] },
    );
    expect(conflicts.some((c) => /contradictory/.test(c.reason))).toBe(true);
  });
});

describe('resolve with config', () => {
  it('merges a loose pair when the threshold is lowered', () => {
    const sightings = [s('a', 'Salon Yasmine Agdal', { lat: 34.02, lon: -6.84 }),
                       s('b', 'Salon Yasmine', { lat: 34.0201, lon: -6.84 })];
    const strict = resolve(sightings, { config: { ...DEFAULT_TUNING.resolution, mergeThreshold: 0.95 } });
    const loose = resolve(sightings, { config: { ...DEFAULT_TUNING.resolution, mergeThreshold: 0.5 } });
    expect(strict.businesses).toHaveLength(2);
    expect(loose.businesses).toHaveLength(1);
  });

  it('honours a widened proximity radius', () => {
    const sightings = [s('a', 'Cafe Atlas', { lat: 34.0200, lon: -6.8400 }),
                       s('b', 'Cafe Atlas', { lat: 34.0230, lon: -6.8400 })];
    expect(resolve(sightings, { config: { ...DEFAULT_TUNING.resolution, proximityMetres: 50 } }).businesses).toHaveLength(2);
    expect(resolve(sightings, { config: { ...DEFAULT_TUNING.resolution, proximityMetres: 600 } }).businesses).toHaveLength(1);
  });

  it('is unchanged when called with no options', () => {
    const { businesses, conflicts } = resolve([s('a', 'Salon Yasmine')]);
    expect(businesses).toHaveLength(1);
    expect(conflicts).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run leads:test`
Expected: FAIL — `resolve` ignores the second argument and returns no `conflicts`.

- [ ] **Step 3: Modify the resolver**

In `lead-engine/src/resolve/resolve.ts`, keep the exported constants as the defaults, then:

- Change the signature to `resolve(sightings: Sighting[], opts: { config?: ResolutionConfig; verdicts?: Verdict[] } = {})`.
- Derive `const cfg = opts.config ?? { mergeThreshold: MERGE_THRESHOLD, ambiguityFloor: AMBIGUITY_FLOOR, proximityMetres: PROXIMITY_METRES, sharedContactThreshold: SHARED_CONTACT_THRESHOLD };` and pass `cfg` into `decide` and `findSharedContacts` in place of the module constants.
- Build constraints once: `const { forcedSame, forbidden, contradictions } = buildConstraints(opts.verdicts ?? []);`
- Track cluster membership so a forbidden pair can be checked before any union:

```ts
const members = new Map<string, Set<string>>();
sightings.forEach((s) => members.set(s.id, new Set([s.id])));

const conflicts: ConstraintConflict[] = [...contradictions];

function wouldViolate(rootA: string, rootB: string): [string, string] | null {
  const a = members.get(rootA)!;
  const b = members.get(rootB)!;
  for (const x of a) for (const y of b) {
    if (forbidden.has(pairKey(x, y))) return [x, y];
  }
  return null;
}

function tryUnion(idA: string, idB: string): boolean {
  const rootA = find(idA);
  const rootB = find(idB);
  if (rootA === rootB) return true;
  const violation = wouldViolate(rootA, rootB);
  if (violation) {
    conflicts.push({
      aSightingId: violation[0],
      bSightingId: violation[1],
      reason: 'merge blocked by a "different" verdict',
    });
    return false;
  }
  const merged = new Set([...members.get(rootA)!, ...members.get(rootB)!]);
  parent.set(rootA, rootB);
  members.set(rootB, merged);
  members.delete(rootA);
  return true;
}
```

- Apply `forcedSame` pairs through `tryUnion` before any scoring.
- Collect scored merges into an array, sort by descending score, then apply each through `tryUnion` — highest-confidence merges claim their clusters first, so a blocked chain loses its weakest link rather than an arbitrary one.
- Return `{ businesses, candidates, conflicts }`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run leads:test`
Expected: PASS — including every test from the resolution-core plan's `resolve.test.ts`, unchanged.

- [ ] **Step 5: Commit**

```bash
git add lead-engine/src/resolve/
git commit -m "feat(leads): apply config and immutable verdicts in the resolver"
```

---

### Task 5: Calibration metrics

**Files:**
- Create: `lead-engine/src/calibrate/metrics.ts`
- Test: `lead-engine/src/calibrate/metrics.test.ts`

**Interfaces:**
- Consumes: `resolve`; `Verdict`, `pairKey`; `ResolutionConfig`
- Produces: `CalibrationMetrics`; `scoreConfig(sightings: Sighting[], verdicts: Verdict[], config: ResolutionConfig): CalibrationMetrics`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { scoreConfig } from './metrics';
import { DEFAULT_TUNING } from '../config/schema';
import type { Verdict } from '../resolve/verdicts';
import type { Sighting } from '../sources/types';

function s(id: string, name: string, lat?: number, lon?: number): Sighting {
  return { id, source: 'openstreetmap', sourceId: id, fetchedAt: '2026-09-03T00:00:00.000Z',
    raw: {}, extracted: { name, phones: [], emails: [], lat, lon } };
}
function v(a: string, b: string, decision: 'same' | 'different'): Verdict {
  return { id: `${a}-${b}`, aSightingId: a, bSightingId: b, decision, decidedAt: '2026-09-03T00:00:00.000Z' };
}
const cfg = DEFAULT_TUNING.resolution;

describe('scoreConfig', () => {
  it('counts a false merge and names the pair', () => {
    const m = scoreConfig(
      [s('a', 'Salon Yasmine', 34.02, -6.84), s('b', 'Salon Yasmine', 34.0201, -6.84)],
      [v('a', 'b', 'different')],
      cfg,
    );
    expect(m.falseMerges).toHaveLength(1);
    expect(m.falseMerges[0]).toMatchObject({ aSightingId: 'a', bSightingId: 'b' });
  });

  it('counts a missed merge', () => {
    const m = scoreConfig(
      [s('a', 'Salon Yasmine'), s('b', 'Coiffure Chez Yasmine')],
      [v('a', 'b', 'same')],
      cfg,
    );
    expect(m.missedMerges).toHaveLength(1);
  });

  it('withholds the pair being scored so a verdict cannot grade itself', () => {
    const m = scoreConfig(
      [s('a', 'Salon Yasmine'), s('b', 'Coiffure Chez Yasmine')],
      [v('a', 'b', 'same')],
      cfg,
    );
    expect(m.missedMerges).toHaveLength(1);
    expect(m.falseMerges).toHaveLength(0);
  });

  it('reports cluster counts', () => {
    const m = scoreConfig([s('a', 'A Gym'), s('b', 'B Salon')], [], cfg);
    expect(m.clusterCount).toBe(2);
    expect(m.largestCluster).toBe(1);
  });

  it('exposes no combined accuracy figure', () => {
    const m = scoreConfig([s('a', 'A Gym')], [], cfg);
    expect(Object.keys(m)).not.toContain('accuracy');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run leads:test`
Expected: FAIL — cannot resolve `./metrics`.

- [ ] **Step 3: Write minimal implementation**

```ts
import type { Sighting } from '../sources/types';
import type { ResolutionConfig } from '../config/schema';
import { resolve } from '../resolve/resolve';
import { pairKey, type Verdict } from '../resolve/verdicts';

export interface LabelledPair { aSightingId: string; bSightingId: string }

export interface CalibrationMetrics {
  falseMerges: LabelledPair[];
  missedMerges: LabelledPair[];
  stillAmbiguous: LabelledPair[];
  clusterCount: number;
  largestCluster: number;
  labelledPairs: number;
}

export function scoreConfig(
  sightings: Sighting[],
  verdicts: Verdict[],
  config: ResolutionConfig,
): CalibrationMetrics {
  const falseMerges: LabelledPair[] = [];
  const missedMerges: LabelledPair[] = [];
  const stillAmbiguous: LabelledPair[] = [];

  for (const verdict of verdicts) {
    const others = verdicts.filter((x) => x.id !== verdict.id);
    const { businesses, candidates } = resolve(sightings, { config, verdicts: others });
    const cluster = businesses.find((bz) => bz.sightingIds.includes(verdict.aSightingId));
    const together = cluster?.sightingIds.includes(verdict.bSightingId) ?? false;
    const pair = { aSightingId: verdict.aSightingId, bSightingId: verdict.bSightingId };
    const key = pairKey(verdict.aSightingId, verdict.bSightingId);
    const ambiguous = candidates.some((c) => pairKey(c.aSightingId, c.bSightingId) === key);

    if (verdict.decision === 'different' && together) falseMerges.push(pair);
    if (verdict.decision === 'same' && !together) missedMerges.push(pair);
    if (ambiguous) stillAmbiguous.push(pair);
  }

  const { businesses } = resolve(sightings, { config, verdicts });
  return {
    falseMerges,
    missedMerges,
    stillAmbiguous,
    clusterCount: businesses.length,
    largestCluster: businesses.reduce((max, bz) => Math.max(max, bz.sightingIds.length), 0),
    labelledPairs: verdicts.length,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run leads:test`
Expected: PASS, 5 tests.

- [ ] **Step 5: Commit**

```bash
git add lead-engine/src/calibrate/metrics.ts lead-engine/src/calibrate/metrics.test.ts
git commit -m "feat(leads): score a config against verdicts, errors reported separately"
```

---

### Task 6: Resolution diff

**Files:**
- Create: `lead-engine/src/calibrate/diff.ts`
- Test: `lead-engine/src/calibrate/diff.test.ts`

**Interfaces:**
- Consumes: `Business` from `../sources/types`
- Produces: `ResolutionDiff`; `diffResolutions(before: Business[], after: Business[]): ResolutionDiff`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { diffResolutions } from './diff';
import type { Business, SourceId } from '../sources/types';

function bz(id: string, sightingIds: string[]): Business {
  const fv = <T,>(value: T) => ({ value, source: 'openstreetmap' as SourceId, sightingId: id,
    firstSeen: '2026-09-03T00:00:00.000Z', lastSeen: '2026-09-03T00:00:00.000Z' });
  return { id, name: fv(id), phones: [], emails: [], verticalMatch: null, sightingIds };
}

describe('diffResolutions', () => {
  it('reports a merge', () => {
    const d = diffResolutions([bz('a', ['a']), bz('b', ['b'])], [bz('a', ['a', 'b'])]);
    expect(d.merged).toHaveLength(1);
    expect(d.merged[0].sightingIds).toEqual(['a', 'b']);
    expect(d.split).toHaveLength(0);
  });

  it('reports a split', () => {
    const d = diffResolutions([bz('a', ['a', 'b'])], [bz('a', ['a']), bz('b', ['b'])]);
    expect(d.split).toHaveLength(1);
    expect(d.merged).toHaveLength(0);
  });

  it('reports nothing when unchanged', () => {
    const d = diffResolutions([bz('a', ['a'])], [bz('a', ['a'])]);
    expect(d.merged).toEqual([]);
    expect(d.split).toEqual([]);
    expect(d.unchanged).toBe(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run leads:test`
Expected: FAIL — cannot resolve `./diff`.

- [ ] **Step 3: Write minimal implementation**

```ts
import type { Business } from '../sources/types';

export interface ResolutionDiff {
  merged: { sightingIds: string[] }[];
  split: { sightingIds: string[] }[];
  unchanged: number;
}

const sig = (b: Business) => [...b.sightingIds].sort().join('|');

export function diffResolutions(before: Business[], after: Business[]): ResolutionDiff {
  const beforeSigs = new Set(before.map(sig));
  const afterSigs = new Set(after.map(sig));
  const merged = after.filter((b) => !beforeSigs.has(sig(b)) && b.sightingIds.length > 1)
    .map((b) => ({ sightingIds: b.sightingIds }));
  const split = before.filter((b) => !afterSigs.has(sig(b)) && b.sightingIds.length > 1)
    .map((b) => ({ sightingIds: b.sightingIds }));
  const unchanged = after.filter((b) => beforeSigs.has(sig(b))).length;
  return { merged, split, unchanged };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run leads:test`
Expected: PASS, 3 tests.

- [ ] **Step 5: Commit**

```bash
git add lead-engine/src/calibrate/diff.ts lead-engine/src/calibrate/diff.test.ts
git commit -m "feat(leads): diff two resolutions into merges and splits"
```

---

### Task 7: Loopback-bound API server

**Files:**
- Create: `lead-engine/api/server.ts`, `lead-engine/api/guarantees.ts`
- Modify: `package.json` (add `leads:ui` script)
- Test: `lead-engine/api/server.test.ts`

**Interfaces:**
- Consumes: `loadTuning`, `writeTuning`; `scoreConfig`; `diffResolutions`; `resolve`; `SOURCE_REGISTRY`
- Produces: `createServer(deps: ServerDeps): http.Server`; `GUARANTEES: Guarantee[]`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { Server } from 'node:http';
import { createServer } from './server';
import { DEFAULT_TUNING } from '../src/config/schema';

let server: Server;
let base: string;

beforeEach(async () => {
  server = createServer({
    loadConfig: async () => DEFAULT_TUNING,
    saveConfig: async () => {},
    loadSightings: async () => [],
    loadVerdicts: async () => [],
  });
  await new Promise<void>((r) => server.listen(0, '127.0.0.1', r));
  const addr = server.address() as { port: number };
  base = `http://127.0.0.1:${addr.port}`;
});
afterEach(() => new Promise<void>((r) => { server.close(() => r()); }));

describe('control API', () => {
  it('binds loopback only', () => {
    expect((server.address() as { address: string }).address).toBe('127.0.0.1');
  });

  it('serves the live config', async () => {
    const res = await fetch(`${base}/api/config`);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(DEFAULT_TUNING);
  });

  it('serves guarantees with a locked flag', async () => {
    const body = await (await fetch(`${base}/api/guarantees`)).json();
    expect(body.length).toBeGreaterThan(0);
    expect(body.every((g: { locked: boolean }) => g.locked)).toBe(true);
  });

  it('exposes source roles read-only', async () => {
    const body = await (await fetch(`${base}/api/sources`)).json();
    const instagram = body.find((s: { id: string }) => s.id === 'instagram');
    expect(instagram.role).toBe('signal');
    expect(instagram.roleEditable).toBe(false);
  });

  it('rejects an invalid candidate config on calibrate', async () => {
    const bad = JSON.parse(JSON.stringify(DEFAULT_TUNING));
    bad.resolution.ambiguityFloor = 0.99;
    const res = await fetch(`${base}/api/calibrate`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ config: bad }),
    });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/ambiguityFloor/);
  });

  it('returns metrics and a diff on a valid calibrate', async () => {
    const res = await fetch(`${base}/api/calibrate`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ config: DEFAULT_TUNING }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.metrics).toBeDefined();
    expect(body.diff).toBeDefined();
    expect(body.metrics.accuracy).toBeUndefined();
  });

  it('has no route that sends anything to a prospect', async () => {
    for (const path of ['/api/send', '/api/outreach', '/api/message']) {
      expect((await fetch(`${base}${path}`)).status).toBe(404);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run leads:test`
Expected: FAIL — cannot resolve `./server`.

- [ ] **Step 3: Write the guarantees list**

```ts
export interface Guarantee {
  id: string;
  statement: string;
  enforcedBy: string;
  locked: true;
}

export const GUARANTEES: Guarantee[] = [
  { id: 'no-send', statement: 'No code can send a message to a prospect.',
    enforcedBy: 'lead-engine/src/invariants.test.ts', locked: true },
  { id: 'citable-only', statement: 'A signal-only source can never be cited at first contact.',
    enforcedBy: 'lead-engine/src/sources/registry.test.ts', locked: true },
  { id: 'optout-all-sources', statement: 'An opt-out blocks re-entry from every source.',
    enforcedBy: 'lead-engine/src/optout/optout.test.ts', locked: true },
  { id: 'no-repo-data', statement: 'Prospect data can never be written inside the repository.',
    enforcedBy: 'lead-engine/src/store/paths.test.ts', locked: true },
  { id: 'loopback-only', statement: 'The control API binds 127.0.0.1 and no other interface.',
    enforcedBy: 'lead-engine/api/server.test.ts', locked: true },
];
```

- [ ] **Step 4: Write the server**

```ts
import http from 'node:http';
import { SOURCE_REGISTRY } from '../src/sources/registry';
import { validateTuning, type TuningConfig } from '../src/config/schema';
import { scoreConfig } from '../src/calibrate/metrics';
import { diffResolutions } from '../src/calibrate/diff';
import { resolve } from '../src/resolve/resolve';
import { GUARANTEES } from './guarantees';
import type { Sighting } from '../src/sources/types';
import type { Verdict } from '../src/resolve/verdicts';

export interface ServerDeps {
  loadConfig(): Promise<TuningConfig>;
  saveConfig(config: TuningConfig): Promise<void>;
  loadSightings(): Promise<Sighting[]>;
  loadVerdicts(): Promise<Verdict[]>;
}

function send(res: http.ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body);
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(payload);
}

async function readJson(req: http.IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

export function createServer(deps: ServerDeps): http.Server {
  return http.createServer(async (req, res) => {
    try {
      const url = req.url ?? '';
      if (req.method === 'GET' && url === '/api/guarantees') return send(res, 200, GUARANTEES);
      if (req.method === 'GET' && url === '/api/config') return send(res, 200, await deps.loadConfig());
      if (req.method === 'GET' && url === '/api/sources') {
        const config = await deps.loadConfig();
        return send(res, 200, Object.values(SOURCE_REGISTRY).map((entry) => ({
          id: entry.id, label: entry.label, role: entry.role, terms: entry.terms,
          roleEditable: false, enabled: config.sources[entry.id]?.enabled ?? false,
        })));
      }
      if (req.method === 'POST' && (url === '/api/calibrate' || url === '/api/config/promote')) {
        const body = await readJson(req) as { config: unknown };
        let candidate: TuningConfig;
        try {
          candidate = validateTuning(body.config);
        } catch (err) {
          return send(res, 400, { error: (err as Error).message });
        }
        const [live, sightings, verdicts] = await Promise.all([
          deps.loadConfig(), deps.loadSightings(), deps.loadVerdicts(),
        ]);
        const before = resolve(sightings, { config: live.resolution, verdicts }).businesses;
        const after = resolve(sightings, { config: candidate.resolution, verdicts }).businesses;
        const payload = {
          metrics: scoreConfig(sightings, verdicts, candidate.resolution),
          diff: diffResolutions(before, after),
        };
        if (url === '/api/config/promote') await deps.saveConfig(candidate);
        return send(res, 200, payload);
      }
      return send(res, 404, { error: 'not found' });
    } catch (err) {
      return send(res, 500, { error: (err as Error).message });
    }
  });
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run leads:test`
Expected: PASS, 7 tests.

- [ ] **Step 6: Commit**

```bash
git add lead-engine/api/ package.json
git commit -m "feat(leads): add loopback-bound control API"
```

---

### Task 8: The control app

**Files:**
- Create: `lead-engine/ui/package.json`, `lead-engine/ui/vite.config.ts`, `lead-engine/ui/index.html`, `lead-engine/ui/src/main.tsx`, `lead-engine/ui/src/App.tsx`, `lead-engine/ui/src/Guarantees.tsx`, `lead-engine/ui/src/Sources.tsx`, `lead-engine/ui/src/Calibration.tsx`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: the API routes from Task 7
- Produces: a browser UI on `127.0.0.1`

- [ ] **Step 1: Scaffold the app with its own dependency tree**

```bash
cd lead-engine/ui
npm create vite@latest . -- --template react-ts
npm install
```

In `lead-engine/ui/vite.config.ts`, bind the dev server to loopback and proxy the API:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    proxy: { '/api': 'http://127.0.0.1:4317' },
  },
});
```

Append `lead-engine/ui/node_modules/` and `lead-engine/ui/dist/` to the root `.gitignore`.

- [ ] **Step 2: Build the Guarantees screen**

Read-only. Fetch `/api/guarantees`, render each statement with the file that enforces it, and a heading that says plainly these are not settings.

```tsx
import { useEffect, useState } from 'react';

interface Guarantee { id: string; statement: string; enforcedBy: string; locked: boolean }

export function Guarantees() {
  const [items, setItems] = useState<Guarantee[]>([]);
  useEffect(() => { fetch('/api/guarantees').then((r) => r.json()).then(setItems); }, []);
  return (
    <section>
      <h2>Guarantees</h2>
      <p>These are not settings. Each is enforced by a test that fails the build.</p>
      <ul>
        {items.map((g) => (
          <li key={g.id}>
            <strong>{g.statement}</strong>
            <code>{g.enforcedBy}</code>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 3: Build the Sources screen**

Fetch `/api/sources`. Render role as a non-interactive badge. Render `enabled` as the only control. Show each source's terms text, because that is the sentence that decides whether it can be cited.

- [ ] **Step 4: Build the Calibration screen**

Four range inputs bound to the resolution config. On change, POST `/api/calibrate` and render:

- **False merges** first, listed individually with their sighting ids, under a heading that says these are pairs a human marked different.
- **Missed merges** second, as a count with an expandable list.
- Cluster count and largest cluster.
- The diff against live: how many businesses would merge and how many would split.

The Promote button POSTs `/api/config/promote` and is disabled whenever `falseMerges.length > 0`, with the reason shown next to it. Under-merging is recoverable; a false merge is the failure the design exists to prevent, so the UI refuses to promote into one rather than warning about it.

- [ ] **Step 5: Add the run script**

In the root `package.json`:

```json
"leads:ui": "node lead-engine/api/main.ts & npm --prefix lead-engine/ui run dev"
```

Create `lead-engine/api/main.ts` wiring `createServer` to the real store and config, listening on `127.0.0.1:4317`.

- [ ] **Step 6: Verify by hand**

Run `npm run leads:ui`, open the printed URL, and confirm: Guarantees lists five locked items; Sources shows Instagram as signal-only with no way to change it; dragging the merge threshold changes the cluster count; Promote is disabled while any false merge is listed.

- [ ] **Step 7: Commit**

```bash
git add lead-engine/ui .gitignore package.json lead-engine/api/main.ts
git commit -m "feat(leads): add local control app with calibration"
```

---

## Self-Review

**Spec coverage.** Two-tier config → Tasks 1, 2, 7, 8. Config in the repo → Task 1. Verdicts as immutable inputs → Tasks 3, 4. Transitive-merge blocking and contradiction surfacing → Tasks 3, 4. Resolver extension, additive → Task 4. Sandboxed calibration with pair withholding → Task 5. Promote diff → Tasks 6, 7. Loopback binding → Task 7. Guarantees displayed rather than hidden → Tasks 7, 8. Separate error counts and no combined figure → Tasks 5, 7, 8.

**Deliberately deferred, per the spec's scope boundary:** the review queue that produces verdicts, opt-out management, ingest runs, retention purge, the Places check. Verdicts are seeded from a JSON file until the queue exists.

**Type consistency:** `ResolutionConfig` is the four-field object from Task 1 and is what `resolve` accepts in Task 4, what `scoreConfig` accepts in Task 5, and what the API passes in Task 7 as `config.resolution` — never the whole `TuningConfig`. `Verdict` keeps `{id, aSightingId, bSightingId, decision, decidedAt, note?}` in Tasks 3, 4, 5. `resolve()` returns `{businesses, candidates, conflicts}` from Task 4 onward; Task 5 and Task 7 destructure only the fields they use, so the resolution-core plan's existing tests continue to pass unchanged.
