# Lead Engine Resolution Core — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ingest a local OpenStreetMap export of Moroccan businesses and produce deduplicated business records carrying per-field provenance, stored encrypted outside the repository.

**Architecture:** A standalone Node/TypeScript tool in `lead-engine/`, excluded from the Next build. Source adapters parse local export files into immutable `Sighting` records. Normalisation reduces phones, names and categories to comparable keys. A deliberately conservative resolver clusters sightings into `Business` records, refusing to merge on shared contacts and sending ambiguous pairs to a human queue instead of guessing. Everything is offline: no network calls exist in this plan.

**Tech Stack:** TypeScript, Node 20, Vitest. No database — append-only JSONL encrypted with AES-256-GCM.

**Spec:** `docs/superpowers/specs/2026-09-02-lead-engine-multi-source-design.md`

## Global Constraints

- **No send function may exist.** No code that transmits a message to a prospect, on any channel.
- **No network calls in this plan.** Adapters parse local files only. The Places checker belongs to the next plan.
- **No prospect data in the repository or any build output.** Enforced by Task 1.
- **A source may only be cited if its registry entry says `citable`.** Enforced by Task 2.
- **An opt-out blocks re-entry from every source**, not only the one that supplied the record. Enforced by Task 12.
- **Never merge two businesses on a shared contact, shared email domain, or shared address alone.** Enforced by Task 10.
- **First adapter is OpenStreetMap.** Directory adapters wait on a terms review; no extraction code is written for them here.

## Scope Boundary

Deferred to the next plan, with no task here: the Google Places check and its invariant that no Places payload is persisted; `softwareFit` and `mapFit` scoring; the review queue UI. This plan ends with an inspectable, deduplicated business store.

## File Structure

| File | Responsibility |
|---|---|
| `lead-engine/tsconfig.json` | Node/TS config for the tool, separate from the Next app |
| `lead-engine/src/store/paths.ts` | Resolves the data directory and refuses any path inside the repo |
| `lead-engine/src/sources/types.ts` | `Sighting`, `SourceAdapter`, `ExtractedFields`, `Business`, `FieldValue` |
| `lead-engine/src/sources/registry.ts` | Source terms register and `assertCitable` |
| `lead-engine/src/sources/openstreetmap.ts` | First adapter: Overpass JSON → sightings |
| `lead-engine/src/normalise/phone.ts` | Moroccan phone numbers → E.164 |
| `lead-engine/src/normalise/name.ts` | French / Arabic / transliterated names → comparison key |
| `lead-engine/src/normalise/category.ts` | OSM tags → vertical |
| `lead-engine/src/store/crypto.ts` | AES-256-GCM encrypt/decrypt for the store |
| `lead-engine/src/store/jsonl.ts` | Append-only encrypted record store |
| `lead-engine/src/resolve/shared.ts` | Shared-contact guard |
| `lead-engine/src/resolve/similarity.ts` | Name similarity scoring |
| `lead-engine/src/resolve/resolve.ts` | Merge rules, ambiguity band, business assembly |
| `lead-engine/src/optout/optout.ts` | Opt-out store and cross-source suppression |
| `lead-engine/src/cli/ingest.ts` | `ingest` command wiring the pipeline together |

---

### Task 1: Tool scaffold and the data-path guard

The earliest enforcement point for "no prospect data in the repository". Everything else writes through this.

**Files:**
- Create: `lead-engine/tsconfig.json`, `lead-engine/src/store/paths.ts`, `vitest.config.ts`
- Modify: `package.json`, `tsconfig.json`
- Test: `lead-engine/src/store/paths.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `resolveDataDir(env?: NodeJS.ProcessEnv, repoRoot?: string): string` — throws `Error` if the resolved directory is inside the repo.

- [ ] **Step 1: Install Vitest and add scripts**

```bash
npm install -D vitest
```

Add to `package.json` scripts:

```json
"leads:test": "vitest run",
"leads:ingest": "node --experimental-strip-types lead-engine/src/cli/ingest.ts"
```

- [ ] **Step 2: Configure Vitest so it never collects the Playwright suite**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['lead-engine/**/*.test.ts'],
    environment: 'node',
  },
});
```

- [ ] **Step 3: Keep the tool out of the Next build**

Create `lead-engine/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true,
    "types": ["node"]
  },
  "include": ["src/**/*.ts"]
}
```

In the root `tsconfig.json`, add `"lead-engine"` to the `exclude` array so `next build` never typechecks Node-only code.

- [ ] **Step 4: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { resolveDataDir } from './paths';

const REPO = '/home/x/VELOCESTUDIO';

describe('resolveDataDir', () => {
  it('returns an explicit directory outside the repo', () => {
    expect(resolveDataDir({ VELOCE_DATA_DIR: '/home/x/veloce-data' }, REPO))
      .toBe('/home/x/veloce-data');
  });

  it('refuses a directory inside the repo', () => {
    expect(() => resolveDataDir({ VELOCE_DATA_DIR: '/home/x/VELOCESTUDIO/data' }, REPO))
      .toThrow(/inside the repository/);
  });

  it('refuses the repo root itself', () => {
    expect(() => resolveDataDir({ VELOCE_DATA_DIR: REPO }, REPO))
      .toThrow(/inside the repository/);
  });

  it('refuses a traversal that lands back inside the repo', () => {
    expect(() => resolveDataDir({ VELOCE_DATA_DIR: '/home/x/veloce-data/../VELOCESTUDIO/d' }, REPO))
      .toThrow(/inside the repository/);
  });

  it('falls back to a home-directory default when unset', () => {
    const dir = resolveDataDir({ HOME: '/home/x' }, REPO);
    expect(dir).toBe('/home/x/.veloce-lead-engine');
  });
});
```

- [ ] **Step 5: Run test to verify it fails**

Run: `npm run leads:test`
Expected: FAIL — `resolveDataDir` is not defined.

- [ ] **Step 6: Write minimal implementation**

```ts
import path from 'node:path';

export function resolveDataDir(
  env: NodeJS.ProcessEnv = process.env,
  repoRoot: string = process.cwd(),
): string {
  const home = env.HOME ?? env.USERPROFILE ?? '';
  const raw = env.VELOCE_DATA_DIR ?? path.join(home, '.veloce-lead-engine');
  const dir = path.resolve(raw);
  const repo = path.resolve(repoRoot);
  const rel = path.relative(repo, dir);
  const inside = rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
  if (inside) {
    throw new Error(
      `Refusing to use ${dir}: it is inside the repository. Prospect data must live outside it.`,
    );
  }
  return dir;
}
```

- [ ] **Step 7: Run test to verify it passes**

Run: `npm run leads:test`
Expected: PASS, 5 tests.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json tsconfig.json vitest.config.ts lead-engine/
git commit -m "feat(leads): scaffold tool and refuse data paths inside the repo"
```

---

### Task 2: Source types and the terms register

Turns "a source may be usable without being nameable" from a policy into a thrown error.

**Files:**
- Create: `lead-engine/src/sources/types.ts`, `lead-engine/src/sources/registry.ts`
- Test: `lead-engine/src/sources/registry.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `SourceId`, `SourceRole`, `ExtractedFields`, `Sighting`, `SourceAdapter`, `Vertical`, `FieldValue<T>`, `Business`; `SOURCE_REGISTRY: Record<SourceId, SourceEntry>`; `assertCitable(id: SourceId): void`; `isCitable(id: SourceId): boolean`.

- [ ] **Step 1: Write the shared types**

Create `lead-engine/src/sources/types.ts`:

```ts
export type SourceId =
  | 'openstreetmap' | 'telecontact' | 'pj'
  | 'glovo' | 'kaalix' | 'instagram' | 'facebook';

export type SourceRole = 'citable' | 'signal';

export interface SourceEntry {
  id: SourceId;
  label: string;
  role: SourceRole;
  terms: string;
}

export interface ExtractedFields {
  name: string;
  phones: string[];
  emails: string[];
  website?: string;
  address?: string;
  locality?: string;
  lat?: number;
  lon?: number;
  category?: string;
}

export interface Sighting {
  id: string;
  source: SourceId;
  sourceId: string;
  fetchedAt: string;
  sourceUrl?: string;
  raw: unknown;
  extracted: ExtractedFields;
}

export interface SourceAdapter {
  id: SourceId;
  parse(contents: string, fetchedAt: string): Sighting[];
}

export type Vertical = 'gym' | 'salon' | 'restaurant' | 'agency';

export interface FieldValue<T> {
  value: T;
  source: SourceId;
  sightingId: string;
  firstSeen: string;
  lastSeen: string;
}

export interface Business {
  id: string;
  name: FieldValue<string>;
  phones: FieldValue<string>[];
  emails: FieldValue<string>[];
  website?: FieldValue<string>;
  address?: FieldValue<string>;
  location?: FieldValue<{ lat: number; lon: number }>;
  verticalMatch: Vertical | null;
  sightingIds: string[];
}
```

- [ ] **Step 2: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { SOURCE_REGISTRY, assertCitable, isCitable } from './registry';

describe('source terms register', () => {
  it('marks OpenStreetMap and the directories citable', () => {
    expect(isCitable('openstreetmap')).toBe(true);
    expect(isCitable('telecontact')).toBe(true);
  });

  it('marks delivery and social sources signal-only', () => {
    expect(isCitable('glovo')).toBe(false);
    expect(isCitable('instagram')).toBe(false);
  });

  it('throws when a signal-only source would be cited', () => {
    expect(() => assertCitable('instagram'))
      .toThrow(/instagram is signal-only and may not be cited/);
  });

  it('does not throw for a citable source', () => {
    expect(() => assertCitable('openstreetmap')).not.toThrow();
  });

  it('records the terms position for every registered source', () => {
    for (const entry of Object.values(SOURCE_REGISTRY)) {
      expect(entry.terms.length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm run leads:test`
Expected: FAIL — cannot resolve `./registry`.

- [ ] **Step 4: Write minimal implementation**

```ts
import type { SourceEntry, SourceId } from './types';

export const SOURCE_REGISTRY: Record<SourceId, SourceEntry> = {
  openstreetmap: { id: 'openstreetmap', label: 'OpenStreetMap', role: 'citable',
    terms: 'ODbL. Commercial use permitted with attribution; bulk extracts published for reuse.' },
  telecontact: { id: 'telecontact', label: 'Telecontact', role: 'citable',
    terms: 'Business directory. Bulk extraction is against site terms — pending commercial risk review.' },
  pj: { id: 'pj', label: 'Pages Jaunes Maroc', role: 'citable',
    terms: 'Business directory. Bulk extraction is against site terms — pending commercial risk review.' },
  glovo: { id: 'glovo', label: 'Glovo', role: 'signal',
    terms: 'Platform listings. Liveness evidence only; never cited as the origin of contact details.' },
  kaalix: { id: 'kaalix', label: 'Kaalix', role: 'signal',
    terms: 'Platform listings. Liveness evidence only; never cited as the origin of contact details.' },
  instagram: { id: 'instagram', label: 'Instagram', role: 'signal',
    terms: 'Automated collection is against platform terms. Signal only; never cited.' },
  facebook: { id: 'facebook', label: 'Facebook', role: 'signal',
    terms: 'Automated collection is against platform terms. Signal only; never cited.' },
};

export function isCitable(id: SourceId): boolean {
  return SOURCE_REGISTRY[id]?.role === 'citable';
}

export function assertCitable(id: SourceId): void {
  if (!isCitable(id)) {
    throw new Error(`${id} is signal-only and may not be cited at first contact.`);
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run leads:test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add lead-engine/src/sources/
git commit -m "feat(leads): add source types and citable-source enforcement"
```

---

### Task 3: Moroccan phone normalisation

**Files:**
- Create: `lead-engine/src/normalise/phone.ts`
- Test: `lead-engine/src/normalise/phone.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `normalisePhone(raw: string): string | null` — returns E.164 (`+212XXXXXXXXX`) or `null` when the input is not a valid Moroccan number.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { normalisePhone } from './phone';

describe('normalisePhone', () => {
  it.each([
    ['0612345678', '+212612345678'],
    ['06 12 34 56 78', '+212612345678'],
    ['06-12-34-56-78', '+212612345678'],
    ['+212612345678', '+212612345678'],
    ['212612345678', '+212612345678'],
    ['00212612345678', '+212612345678'],
    ['+212 (0)6 12 34 56 78', '+212612345678'],
    ['0522123456', '+212522123456'],
    ['0712345678', '+212712345678'],
  ])('normalises %s', (input, expected) => {
    expect(normalisePhone(input)).toBe(expected);
  });

  it.each([
    ['', 'empty'],
    ['12345', 'too short'],
    ['0912345678', 'invalid prefix'],
    ['+33612345678', 'not Moroccan'],
    ['not a phone', 'garbage'],
  ])('rejects %s (%s)', (input) => {
    expect(normalisePhone(input)).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run leads:test`
Expected: FAIL — cannot resolve `./phone`.

- [ ] **Step 3: Write minimal implementation**

```ts
const NATIONAL = /^0([5-7]\d{8})$/;
const E164 = /^\+212([5-7]\d{8})$/;

export function normalisePhone(raw: string): string | null {
  if (!raw) return null;
  let s = raw.replace(/[()\s.\- ]/g, '');
  if (s.startsWith('00')) s = `+${s.slice(2)}`;
  if (/^212/.test(s)) s = `+${s}`;
  if (s.startsWith('+212')) {
    const rest = s.slice(4).replace(/^0/, '');
    s = `+212${rest}`;
    return E164.test(s) ? s : null;
  }
  const m = NATIONAL.exec(s);
  return m ? `+212${m[1]}` : null;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run leads:test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lead-engine/src/normalise/phone.ts lead-engine/src/normalise/phone.test.ts
git commit -m "feat(leads): normalise Moroccan phone numbers to E.164"
```

---

### Task 4: Name normalisation across French, Arabic and transliteration

The component the spec flags as least suited to a first guess. Keep it mechanical and testable; thresholds are tuned later against real output.

**Files:**
- Create: `lead-engine/src/normalise/name.ts`
- Test: `lead-engine/src/normalise/name.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `normaliseName(raw: string): string` — a lowercase, diacritic-free, generic-word-free comparison key; `nameTokens(raw: string): string[]`.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { normaliseName, nameTokens } from './name';

describe('normaliseName', () => {
  it('lowercases and strips French diacritics', () => {
    expect(normaliseName('Café Été')).toBe('cafe ete');
  });

  it('drops legal-form suffixes', () => {
    expect(normaliseName('Fitness Plus SARL')).toBe('fitness plus');
    expect(normaliseName('Atlas Immobilier S.A.R.L.')).toBe('atlas immobilier');
  });

  it('collapses punctuation and repeated whitespace', () => {
    expect(normaliseName('  Salon   "Yasmine" -- Rabat ')).toBe('salon yasmine rabat');
  });

  it('strips Arabic diacritics and unifies letter forms', () => {
    // alef variants unify to a bare alef; ta marbuta becomes ha
    expect(normaliseName('ألمنزل')).toBe('المنزل');
  });

  it('removes the Arabic definite article prefix', () => {
    expect(normaliseName('المنزل')).toBe('منزل');
  });

  it('returns an empty string for empty input', () => {
    expect(normaliseName('   ')).toBe('');
  });
});

describe('nameTokens', () => {
  it('splits a normalised name into tokens', () => {
    expect(nameTokens('Salon Yasmine SARL')).toEqual(['salon', 'yasmine']);
  });

  it('returns no tokens for empty input', () => {
    expect(nameTokens('')).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run leads:test`
Expected: FAIL — cannot resolve `./name`.

- [ ] **Step 3: Write minimal implementation**

```ts
const LEGAL_FORMS = /\b(s\.?a\.?r\.?l\.?|s\.?a\.?|s\.?n\.?c\.?|sarlau|eurl|inc|ltd)\b/g;
const ARABIC_TASHKEEL = /[ً-ٰٟ]/g;

function unifyArabic(s: string): string {
  return s
    .replace(ARABIC_TASHKEEL, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/^ال/, '')
    .replace(/\sال/g, ' ');
}

export function normaliseName(raw: string): string {
  if (!raw) return '';
  let s = raw.normalize('NFD').replace(/[̀-ͯ]/g, '');
  s = s.toLowerCase();
  s = unifyArabic(s);
  s = s.replace(LEGAL_FORMS, ' ');
  s = s.replace(/[^\p{L}\p{N}\s]/gu, ' ');
  return s.replace(/\s+/g, ' ').trim();
}

export function nameTokens(raw: string): string[] {
  const n = normaliseName(raw);
  return n ? n.split(' ') : [];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run leads:test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lead-engine/src/normalise/name.ts lead-engine/src/normalise/name.test.ts
git commit -m "feat(leads): normalise business names across French and Arabic forms"
```

---

### Task 5: Category mapping to the four verticals

**Files:**
- Create: `lead-engine/src/normalise/category.ts`
- Test: `lead-engine/src/normalise/category.test.ts`

**Interfaces:**
- Consumes: `Vertical` from `../sources/types`
- Produces: `verticalFromOsmTags(tags: Record<string, string>): Vertical | null`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { verticalFromOsmTags } from './category';

describe('verticalFromOsmTags', () => {
  it.each([
    [{ leisure: 'fitness_centre' }, 'gym'],
    [{ leisure: 'sports_centre', sport: 'fitness' }, 'gym'],
    [{ shop: 'hairdresser' }, 'salon'],
    [{ shop: 'beauty' }, 'salon'],
    [{ amenity: 'restaurant' }, 'restaurant'],
    [{ amenity: 'cafe' }, 'restaurant'],
    [{ office: 'estate_agent' }, 'agency'],
  ])('maps %o', (tags, expected) => {
    expect(verticalFromOsmTags(tags)).toBe(expected);
  });

  it.each([
    [{ amenity: 'pharmacy' }],
    [{ shop: 'bakery' }],
    [{}],
  ])('returns null for out-of-scope %o', (tags) => {
    expect(verticalFromOsmTags(tags)).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run leads:test`
Expected: FAIL — cannot resolve `./category`.

- [ ] **Step 3: Write minimal implementation**

```ts
import type { Vertical } from '../sources/types';

export function verticalFromOsmTags(tags: Record<string, string>): Vertical | null {
  if (tags.leisure === 'fitness_centre') return 'gym';
  if (tags.leisure === 'sports_centre' && tags.sport === 'fitness') return 'gym';
  if (tags.shop === 'hairdresser' || tags.shop === 'beauty') return 'salon';
  if (tags.amenity === 'restaurant' || tags.amenity === 'cafe') return 'restaurant';
  if (tags.office === 'estate_agent') return 'agency';
  return null;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run leads:test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lead-engine/src/normalise/category.ts lead-engine/src/normalise/category.test.ts
git commit -m "feat(leads): map OpenStreetMap tags to the four verticals"
```

---

### Task 6: Encrypted record store

**Files:**
- Create: `lead-engine/src/store/crypto.ts`, `lead-engine/src/store/jsonl.ts`
- Test: `lead-engine/src/store/jsonl.test.ts`

**Interfaces:**
- Consumes: `resolveDataDir` from `./paths`
- Produces: `loadKey(env?: NodeJS.ProcessEnv): Buffer`; `encrypt(plain: string, key: Buffer): string`; `decrypt(payload: string, key: Buffer): string`; `appendRecords<T>(file: string, records: T[], key: Buffer): Promise<void>`; `readRecords<T>(file: string, key: Buffer): Promise<T[]>`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import { appendRecords, readRecords } from './jsonl';

let dir: string;
const key = randomBytes(32);

beforeEach(() => { dir = mkdtempSync(path.join(tmpdir(), 'leads-')); });

describe('encrypted record store', () => {
  it('round-trips records', async () => {
    const file = path.join(dir, 'sightings.jsonl');
    await appendRecords(file, [{ id: 'a', n: 1 }, { id: 'b', n: 2 }], key);
    expect(await readRecords(file, key)).toEqual([{ id: 'a', n: 1 }, { id: 'b', n: 2 }]);
  });

  it('appends without dropping earlier records', async () => {
    const file = path.join(dir, 'sightings.jsonl');
    await appendRecords(file, [{ id: 'a' }], key);
    await appendRecords(file, [{ id: 'b' }], key);
    expect(await readRecords(file, key)).toEqual([{ id: 'a' }, { id: 'b' }]);
  });

  it('writes nothing readable as plaintext', async () => {
    const file = path.join(dir, 'sightings.jsonl');
    await appendRecords(file, [{ name: 'Salon Yasmine' }], key);
    expect(readFileSync(file, 'utf8')).not.toContain('Yasmine');
  });

  it('fails loudly on the wrong key', async () => {
    const file = path.join(dir, 'sightings.jsonl');
    await appendRecords(file, [{ id: 'a' }], key);
    await expect(readRecords(file, randomBytes(32))).rejects.toThrow();
  });

  it('returns an empty list when the file does not exist', async () => {
    expect(await readRecords(path.join(dir, 'missing.jsonl'), key)).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run leads:test`
Expected: FAIL — cannot resolve `./jsonl`.

- [ ] **Step 3: Write the crypto helper**

```ts
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

export function loadKey(env: NodeJS.ProcessEnv = process.env): Buffer {
  const hex = env.VELOCE_DATA_KEY;
  if (!hex || hex.length !== 64) {
    throw new Error('VELOCE_DATA_KEY must be a 64-character hex string (32 bytes).');
  }
  return Buffer.from(hex, 'hex');
}

export function encrypt(plain: string, key: Buffer): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const body = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  return [iv.toString('base64'), cipher.getAuthTag().toString('base64'), body.toString('base64')].join('.');
}

export function decrypt(payload: string, key: Buffer): string {
  const [iv, tag, body] = payload.split('.');
  const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(iv, 'base64'));
  decipher.setAuthTag(Buffer.from(tag, 'base64'));
  return Buffer.concat([decipher.update(Buffer.from(body, 'base64')), decipher.final()]).toString('utf8');
}
```

- [ ] **Step 4: Write the store**

```ts
import { appendFile, readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { encrypt, decrypt } from './crypto';

export async function appendRecords<T>(file: string, records: T[], key: Buffer): Promise<void> {
  if (records.length === 0) return;
  await mkdir(path.dirname(file), { recursive: true });
  const lines = records.map((r) => `${encrypt(JSON.stringify(r), key)}\n`).join('');
  await appendFile(file, lines, 'utf8');
}

export async function readRecords<T>(file: string, key: Buffer): Promise<T[]> {
  let raw: string;
  try {
    raw = await readFile(file, 'utf8');
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw err;
  }
  return raw.split('\n').filter(Boolean).map((line) => JSON.parse(decrypt(line, key)) as T);
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run leads:test`
Expected: PASS, 5 tests.

- [ ] **Step 6: Commit**

```bash
git add lead-engine/src/store/
git commit -m "feat(leads): add encrypted append-only record store"
```

---

### Task 7: OpenStreetMap adapter

**Files:**
- Create: `lead-engine/src/sources/openstreetmap.ts`, `lead-engine/fixtures/osm-sample.json`
- Test: `lead-engine/src/sources/openstreetmap.test.ts`

**Interfaces:**
- Consumes: `Sighting`, `SourceAdapter` from `./types`; `verticalFromOsmTags`; `normalisePhone`
- Produces: `openStreetMapAdapter: SourceAdapter`

- [ ] **Step 1: Create the fixture**

`lead-engine/fixtures/osm-sample.json` — an Overpass-shaped response:

```json
{
  "elements": [
    { "type": "node", "id": 111, "lat": 34.0209, "lon": -6.8416,
      "tags": { "name": "Salon Yasmine", "shop": "hairdresser", "phone": "06 12 34 56 78", "addr:city": "Rabat" } },
    { "type": "node", "id": 222, "lat": 33.9716, "lon": -6.8498,
      "tags": { "name": "Fitness Plus SARL", "leisure": "fitness_centre", "contact:phone": "+212522123456" } },
    { "type": "node", "id": 333, "lat": 34.0100, "lon": -6.8300,
      "tags": { "name": "Pharmacie Centrale", "amenity": "pharmacy", "phone": "0612345670" } },
    { "type": "node", "id": 444, "lat": 34.0300, "lon": -6.8200,
      "tags": { "shop": "beauty", "phone": "0612345671" } }
  ]
}
```

- [ ] **Step 2: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { openStreetMapAdapter } from './openstreetmap';

const contents = readFileSync(path.join(__dirname, '../../fixtures/osm-sample.json'), 'utf8');
const AT = '2026-09-02T10:00:00.000Z';

describe('openStreetMapAdapter', () => {
  const sightings = openStreetMapAdapter.parse(contents, AT);

  it('keeps only in-scope verticals', () => {
    expect(sightings.map((s) => s.sourceId)).toEqual(['node/111', 'node/222']);
  });

  it('drops elements with no name', () => {
    expect(sightings.find((s) => s.sourceId === 'node/444')).toBeUndefined();
  });

  it('normalises phones and reads both phone tags', () => {
    expect(sightings[0].extracted.phones).toEqual(['+212612345678']);
    expect(sightings[1].extracted.phones).toEqual(['+212522123456']);
  });

  it('stamps source, fetch time and a stable id', () => {
    expect(sightings[0].source).toBe('openstreetmap');
    expect(sightings[0].fetchedAt).toBe(AT);
    expect(sightings[0].id).toBe(`openstreetmap:node/111:${AT}`);
  });

  it('retains the raw element', () => {
    expect((sightings[0].raw as { id: number }).id).toBe(111);
  });

  it('carries locality and coordinates through', () => {
    expect(sightings[0].extracted.locality).toBe('Rabat');
    expect(sightings[0].extracted.lat).toBeCloseTo(34.0209);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm run leads:test`
Expected: FAIL — cannot resolve `./openstreetmap`.

- [ ] **Step 4: Write minimal implementation**

```ts
import type { Sighting, SourceAdapter } from './types';
import { verticalFromOsmTags } from '../normalise/category';
import { normalisePhone } from '../normalise/phone';

interface OsmElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  tags?: Record<string, string>;
}

export const openStreetMapAdapter: SourceAdapter = {
  id: 'openstreetmap',
  parse(contents: string, fetchedAt: string): Sighting[] {
    const parsed = JSON.parse(contents) as { elements?: OsmElement[] };
    const out: Sighting[] = [];
    for (const el of parsed.elements ?? []) {
      const tags = el.tags ?? {};
      const name = tags.name?.trim();
      if (!name) continue;
      if (!verticalFromOsmTags(tags)) continue;
      const sourceId = `${el.type}/${el.id}`;
      const phones = [tags.phone, tags['contact:phone']]
        .map((p) => (p ? normalisePhone(p) : null))
        .filter((p): p is string => p !== null);
      const emails = [tags.email, tags['contact:email']].filter((e): e is string => Boolean(e));
      out.push({
        id: `openstreetmap:${sourceId}:${fetchedAt}`,
        source: 'openstreetmap',
        sourceId,
        fetchedAt,
        sourceUrl: `https://www.openstreetmap.org/${el.type}/${el.id}`,
        raw: el,
        extracted: {
          name,
          phones,
          emails,
          website: tags.website ?? tags['contact:website'],
          address: tags['addr:street'],
          locality: tags['addr:city'],
          lat: el.lat,
          lon: el.lon,
          category: JSON.stringify(tags),
        },
      });
    }
    return out;
  },
};
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run leads:test`
Expected: PASS, 6 tests.

- [ ] **Step 6: Commit**

```bash
git add lead-engine/src/sources/openstreetmap.ts lead-engine/src/sources/openstreetmap.test.ts lead-engine/fixtures/
git commit -m "feat(leads): add OpenStreetMap adapter"
```

---

### Task 8: Shared-contact guard

Franchise numbers and shared inboxes are disqualified as matching keys before the resolver ever sees them.

**Files:**
- Create: `lead-engine/src/resolve/shared.ts`
- Test: `lead-engine/src/resolve/shared.test.ts`

**Interfaces:**
- Consumes: `Sighting` from `../sources/types`; `normaliseName`
- Produces: `SHARED_CONTACT_THRESHOLD: number`; `findSharedContacts(sightings: Sighting[], threshold?: number): Set<string>`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { findSharedContacts, SHARED_CONTACT_THRESHOLD } from './shared';
import type { Sighting } from '../sources/types';

function s(id: string, name: string, phones: string[], emails: string[] = []): Sighting {
  return { id, source: 'openstreetmap', sourceId: id, fetchedAt: '2026-09-02T00:00:00.000Z',
    raw: {}, extracted: { name, phones, emails } };
}

describe('findSharedContacts', () => {
  it('flags a phone used by more distinct names than the threshold', () => {
    const list = ['A Gym', 'B Salon', 'C Cafe', 'D Agency']
      .map((n, i) => s(String(i), n, ['+212500000000']));
    expect(findSharedContacts(list).has('+212500000000')).toBe(true);
  });

  it('leaves a phone used by one business alone', () => {
    expect(findSharedContacts([s('1', 'A Gym', ['+212611111111'])]).has('+212611111111')).toBe(false);
  });

  it('counts distinct names, not sightings', () => {
    const list = Array.from({ length: 6 }, (_, i) => s(String(i), 'Same Salon', ['+212622222222']));
    expect(findSharedContacts(list).has('+212622222222')).toBe(false);
  });

  it('flags shared email addresses too', () => {
    const list = ['A', 'B', 'C', 'D'].map((n, i) => s(String(i), n, [], ['contact@example.ma']));
    expect(findSharedContacts(list).has('contact@example.ma')).toBe(true);
  });

  it('honours an explicit threshold', () => {
    const list = ['A', 'B'].map((n, i) => s(String(i), n, ['+212633333333']));
    expect(findSharedContacts(list, 2).has('+212633333333')).toBe(true);
  });

  it('exports a documented default threshold', () => {
    expect(SHARED_CONTACT_THRESHOLD).toBeGreaterThan(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run leads:test`
Expected: FAIL — cannot resolve `./shared`.

- [ ] **Step 3: Write minimal implementation**

```ts
import type { Sighting } from '../sources/types';
import { normaliseName } from '../normalise/name';

/** Provisional. Retune once real Moroccan data has been ingested. */
export const SHARED_CONTACT_THRESHOLD = 3;

export function findSharedContacts(
  sightings: Sighting[],
  threshold: number = SHARED_CONTACT_THRESHOLD,
): Set<string> {
  const names = new Map<string, Set<string>>();
  for (const s of sightings) {
    const key = normaliseName(s.extracted.name);
    for (const contact of [...s.extracted.phones, ...s.extracted.emails]) {
      if (!names.has(contact)) names.set(contact, new Set());
      names.get(contact)!.add(key);
    }
  }
  const shared = new Set<string>();
  for (const [contact, distinct] of names) {
    if (distinct.size > threshold) shared.add(contact);
  }
  return shared;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run leads:test`
Expected: PASS, 6 tests.

- [ ] **Step 5: Commit**

```bash
git add lead-engine/src/resolve/shared.ts lead-engine/src/resolve/shared.test.ts
git commit -m "feat(leads): disqualify shared contacts as matching keys"
```

---

### Task 9: Name similarity and geographic proximity

**Files:**
- Create: `lead-engine/src/resolve/similarity.ts`
- Test: `lead-engine/src/resolve/similarity.test.ts`

**Interfaces:**
- Consumes: `nameTokens` from `../normalise/name`
- Produces: `nameSimilarity(a: string, b: string): number` (0–1); `metresBetween(a: {lat:number;lon:number}, b: {lat:number;lon:number}): number`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { nameSimilarity, metresBetween } from './similarity';

describe('nameSimilarity', () => {
  it('scores identical names 1', () => {
    expect(nameSimilarity('Salon Yasmine', 'Salon Yasmine')).toBe(1);
  });

  it('ignores legal form and diacritics', () => {
    expect(nameSimilarity('Café Atlas SARL', 'Cafe Atlas')).toBe(1);
  });

  it('scores partial overlap between 0 and 1', () => {
    const score = nameSimilarity('Salon Yasmine Rabat', 'Salon Yasmine');
    expect(score).toBeGreaterThan(0.5);
    expect(score).toBeLessThan(1);
  });

  it('scores unrelated names near 0', () => {
    expect(nameSimilarity('Salon Yasmine', 'Pharmacie Centrale')).toBe(0);
  });

  it('scores empty input 0', () => {
    expect(nameSimilarity('', 'Salon Yasmine')).toBe(0);
  });
});

describe('metresBetween', () => {
  it('is 0 for the same point', () => {
    expect(metresBetween({ lat: 34.02, lon: -6.84 }, { lat: 34.02, lon: -6.84 })).toBe(0);
  });

  it('measures a short distance in metres', () => {
    const d = metresBetween({ lat: 34.0200, lon: -6.8400 }, { lat: 34.0209, lon: -6.8400 });
    expect(d).toBeGreaterThan(90);
    expect(d).toBeLessThan(110);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run leads:test`
Expected: FAIL — cannot resolve `./similarity`.

- [ ] **Step 3: Write minimal implementation**

```ts
import { nameTokens } from '../normalise/name';

export function nameSimilarity(a: string, b: string): number {
  const ta = new Set(nameTokens(a));
  const tb = new Set(nameTokens(b));
  if (ta.size === 0 || tb.size === 0) return 0;
  let shared = 0;
  for (const t of ta) if (tb.has(t)) shared += 1;
  return (2 * shared) / (ta.size + tb.size);
}

const EARTH_RADIUS_M = 6_371_000;

export function metresBetween(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number },
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run leads:test`
Expected: PASS, 7 tests.

- [ ] **Step 5: Commit**

```bash
git add lead-engine/src/resolve/similarity.ts lead-engine/src/resolve/similarity.test.ts
git commit -m "feat(leads): add name similarity and geographic distance"
```

---

### Task 10: The resolver

The task the whole plan exists to get right. Every red line from the spec gets an explicit failing test first.

**Files:**
- Create: `lead-engine/src/resolve/resolve.ts`
- Test: `lead-engine/src/resolve/resolve.test.ts`

**Interfaces:**
- Consumes: `Sighting`, `Business`, `FieldValue` from `../sources/types`; `findSharedContacts`; `nameSimilarity`, `metresBetween`; `normaliseName`, `normalisePhone`; `verticalFromOsmTags`
- Produces: `MERGE_THRESHOLD`, `AMBIGUITY_FLOOR`, `PROXIMITY_METRES` constants; `MergeCandidate` interface; `resolve(sightings: Sighting[]): { businesses: Business[]; candidates: MergeCandidate[] }`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { resolve } from './resolve';
import type { Sighting, SourceId } from '../sources/types';

function s(
  id: string, name: string,
  opts: { phones?: string[]; emails?: string[]; lat?: number; lon?: number;
          address?: string; source?: SourceId } = {},
): Sighting {
  return {
    id, source: opts.source ?? 'openstreetmap', sourceId: id,
    fetchedAt: '2026-09-02T00:00:00.000Z', raw: {},
    extracted: {
      name, phones: opts.phones ?? [], emails: opts.emails ?? [],
      lat: opts.lat, lon: opts.lon, address: opts.address,
    },
  };
}

describe('resolve — merges only on corroboration', () => {
  it('merges the same name and phone seen by two sources', () => {
    const { businesses } = resolve([
      s('a', 'Salon Yasmine', { phones: ['+212611111111'] }),
      s('b', 'Salon Yasmine', { phones: ['+212611111111'], source: 'telecontact' }),
    ]);
    expect(businesses).toHaveLength(1);
    expect(businesses[0].sightingIds).toEqual(['a', 'b']);
  });

  it('merges a similar name within the proximity radius', () => {
    const { businesses } = resolve([
      s('a', 'Cafe Atlas', { lat: 34.0200, lon: -6.8400 }),
      s('b', 'Café Atlas SARL', { lat: 34.0201, lon: -6.8400, source: 'telecontact' }),
    ]);
    expect(businesses).toHaveLength(1);
  });
});

describe('resolve — refuses the red lines', () => {
  it('does not merge different names sharing a phone', () => {
    const { businesses } = resolve([
      s('a', 'Salon Yasmine', { phones: ['+212611111111'] }),
      s('b', 'Cafe Atlas', { phones: ['+212611111111'] }),
    ]);
    expect(businesses).toHaveLength(2);
  });

  it('does not merge different names sharing an email domain', () => {
    const { businesses } = resolve([
      s('a', 'Salon Yasmine', { emails: ['a@shared.ma'] }),
      s('b', 'Cafe Atlas', { emails: ['b@shared.ma'] }),
    ]);
    expect(businesses).toHaveLength(2);
  });

  it('does not merge different businesses at the same address', () => {
    const { businesses } = resolve([
      s('a', 'Salon Yasmine', { address: 'Mega Mall', lat: 34.02, lon: -6.84 }),
      s('b', 'Cafe Atlas', { address: 'Mega Mall', lat: 34.02, lon: -6.84 }),
    ]);
    expect(businesses).toHaveLength(2);
  });

  it('ignores a quarantined shared phone even when names are similar', () => {
    const shared = '+212500000000';
    const { businesses } = resolve([
      s('a', 'Pizza Napoli Agdal', { phones: [shared] }),
      s('b', 'Pizza Napoli Hassan', { phones: [shared] }),
      s('c', 'Cafe Atlas', { phones: [shared] }),
      s('d', 'Salon Yasmine', { phones: [shared] }),
      s('e', 'Fitness Plus', { phones: [shared] }),
    ]);
    expect(businesses).toHaveLength(5);
  });
});

describe('resolve — ambiguity and provenance', () => {
  it('queues an ambiguous pair instead of merging it', () => {
    const { businesses, candidates } = resolve([
      s('a', 'Salon Yasmine Agdal', { lat: 34.0200, lon: -6.8400 }),
      s('b', 'Salon Yasmine Hassan', { lat: 34.0201, lon: -6.8400 }),
    ]);
    expect(businesses).toHaveLength(2);
    expect(candidates).toHaveLength(1);
    expect(candidates[0]).toMatchObject({ aSightingId: 'a', bSightingId: 'b' });
  });

  it('records the source of every merged field', () => {
    const { businesses } = resolve([
      s('a', 'Salon Yasmine', { phones: ['+212611111111'] }),
      s('b', 'Salon Yasmine', { phones: ['+212611111111'], source: 'telecontact' }),
    ]);
    const sources = businesses[0].phones.map((p) => p.source);
    expect(sources).toContain('openstreetmap');
    expect(businesses[0].name.sightingId).toBe('a');
  });

  it('keeps a lone sighting as its own business', () => {
    const { businesses } = resolve([s('a', 'Salon Yasmine')]);
    expect(businesses).toHaveLength(1);
    expect(businesses[0].sightingIds).toEqual(['a']);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run leads:test`
Expected: FAIL — cannot resolve `./resolve`.

- [ ] **Step 3: Write minimal implementation**

```ts
import type { Business, FieldValue, Sighting } from '../sources/types';
import { findSharedContacts } from './shared';
import { metresBetween, nameSimilarity } from './similarity';

/** All three are provisional and get retuned against real ingested data. */
export const MERGE_THRESHOLD = 0.85;
export const AMBIGUITY_FLOOR = 0.55;
export const PROXIMITY_METRES = 150;

export interface MergeCandidate {
  aSightingId: string;
  bSightingId: string;
  score: number;
  reason: string;
}

type Decision = 'merge' | 'ambiguous' | 'apart';

function decide(a: Sighting, b: Sighting, shared: Set<string>): { d: Decision; score: number; reason: string } {
  const score = nameSimilarity(a.extracted.name, b.extracted.name);

  const phones = new Set(a.extracted.phones.filter((p) => !shared.has(p)));
  const phoneMatch = b.extracted.phones.some((p) => !shared.has(p) && phones.has(p));
  if (phoneMatch && score >= MERGE_THRESHOLD) {
    return { d: 'merge', score, reason: 'exact phone and similar name' };
  }

  const near =
    a.extracted.lat !== undefined && a.extracted.lon !== undefined &&
    b.extracted.lat !== undefined && b.extracted.lon !== undefined &&
    metresBetween(
      { lat: a.extracted.lat, lon: a.extracted.lon },
      { lat: b.extracted.lat, lon: b.extracted.lon },
    ) <= PROXIMITY_METRES;

  if (near && score >= MERGE_THRESHOLD) {
    return { d: 'merge', score, reason: 'similar name within proximity radius' };
  }
  if ((near || phoneMatch) && score >= AMBIGUITY_FLOOR) {
    return { d: 'ambiguous', score, reason: 'similar name, insufficient corroboration' };
  }
  return { d: 'apart', score, reason: 'no corroboration' };
}

function field<T>(value: T, s: Sighting): FieldValue<T> {
  return { value, source: s.source, sightingId: s.id, firstSeen: s.fetchedAt, lastSeen: s.fetchedAt };
}

function assemble(group: Sighting[]): Business {
  const primary = group[0];
  const phones: FieldValue<string>[] = [];
  const emails: FieldValue<string>[] = [];
  for (const s of group) {
    for (const p of s.extracted.phones) {
      if (!phones.some((x) => x.value === p)) phones.push(field(p, s));
    }
    for (const e of s.extracted.emails) {
      if (!emails.some((x) => x.value === e)) emails.push(field(e, s));
    }
  }
  const located = group.find((s) => s.extracted.lat !== undefined && s.extracted.lon !== undefined);
  return {
    id: primary.id,
    name: field(primary.extracted.name, primary),
    phones,
    emails,
    website: group.find((s) => s.extracted.website)
      ? field(group.find((s) => s.extracted.website)!.extracted.website!, group.find((s) => s.extracted.website)!)
      : undefined,
    address: group.find((s) => s.extracted.address)
      ? field(group.find((s) => s.extracted.address)!.extracted.address!, group.find((s) => s.extracted.address)!)
      : undefined,
    location: located
      ? field({ lat: located.extracted.lat!, lon: located.extracted.lon! }, located)
      : undefined,
    verticalMatch: null,
    sightingIds: group.map((s) => s.id),
  };
}

export function resolve(sightings: Sighting[]): { businesses: Business[]; candidates: MergeCandidate[] } {
  const shared = findSharedContacts(sightings);
  const parent = new Map<string, string>();
  sightings.forEach((s) => parent.set(s.id, s.id));
  const find = (id: string): string => {
    let cur = id;
    while (parent.get(cur) !== cur) cur = parent.get(cur)!;
    return cur;
  };
  const union = (a: string, b: string) => { parent.set(find(a), find(b)); };

  const candidates: MergeCandidate[] = [];
  for (let i = 0; i < sightings.length; i += 1) {
    for (let j = i + 1; j < sightings.length; j += 1) {
      const { d, score, reason } = decide(sightings[i], sightings[j], shared);
      if (d === 'merge') union(sightings[i].id, sightings[j].id);
      else if (d === 'ambiguous') {
        candidates.push({ aSightingId: sightings[i].id, bSightingId: sightings[j].id, score, reason });
      }
    }
  }

  const groups = new Map<string, Sighting[]>();
  for (const s of sightings) {
    const root = find(s.id);
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root)!.push(s);
  }
  return { businesses: [...groups.values()].map(assemble), candidates };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run leads:test`
Expected: PASS, 9 tests.

- [ ] **Step 5: Commit**

```bash
git add lead-engine/src/resolve/resolve.ts lead-engine/src/resolve/resolve.test.ts
git commit -m "feat(leads): resolve sightings into businesses, refusing uncorroborated merges"
```

---

### Task 11: Opt-out store and cross-source suppression

**Files:**
- Create: `lead-engine/src/optout/optout.ts`
- Test: `lead-engine/src/optout/optout.test.ts`

**Interfaces:**
- Consumes: `Sighting` from `../sources/types`; `normaliseName`
- Produces: `OptOut` interface; `optOutKeys(o: OptOut): Set<string>`; `isSuppressed(s: Sighting, optOuts: OptOut[]): boolean`; `suppress(sightings: Sighting[], optOuts: OptOut[]): Sighting[]`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { isSuppressed, suppress, type OptOut } from './optout';
import type { Sighting, SourceId } from '../sources/types';

function s(id: string, name: string, phones: string[] = [], source: SourceId = 'openstreetmap'): Sighting {
  return { id, source, sourceId: id, fetchedAt: '2026-09-02T00:00:00.000Z', raw: {},
    extracted: { name, phones, emails: [] } };
}

const optOut: OptOut = {
  id: 'o1', phones: ['+212611111111'], emails: [],
  nameKey: 'salon yasmine', createdAt: '2026-09-01T00:00:00.000Z',
};

describe('opt-out suppression', () => {
  it('suppresses a matching phone', () => {
    expect(isSuppressed(s('a', 'Salon Yasmine', ['+212611111111']), [optOut])).toBe(true);
  });

  it('suppresses the same business arriving from a different source', () => {
    const fromDirectory = s('b', 'Salon Yasmine', ['+212611111111'], 'telecontact');
    expect(isSuppressed(fromDirectory, [optOut])).toBe(true);
  });

  it('suppresses on normalised name even when the phone is absent', () => {
    expect(isSuppressed(s('c', 'SALON YASMINE SARL', []), [optOut])).toBe(true);
  });

  it('leaves unrelated businesses alone', () => {
    expect(isSuppressed(s('d', 'Cafe Atlas', ['+212622222222']), [optOut])).toBe(false);
  });

  it('filters a list', () => {
    const list = [s('a', 'Salon Yasmine', ['+212611111111']), s('d', 'Cafe Atlas')];
    expect(suppress(list, [optOut]).map((x) => x.id)).toEqual(['d']);
  });

  it('is a no-op with no opt-outs', () => {
    const list = [s('a', 'Salon Yasmine', ['+212611111111'])];
    expect(suppress(list, [])).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run leads:test`
Expected: FAIL — cannot resolve `./optout`.

- [ ] **Step 3: Write minimal implementation**

```ts
import type { Sighting } from '../sources/types';
import { normaliseName } from '../normalise/name';

export interface OptOut {
  id: string;
  phones: string[];
  emails: string[];
  nameKey?: string;
  createdAt: string;
}

export function optOutKeys(o: OptOut): Set<string> {
  const keys = new Set<string>([...o.phones, ...o.emails]);
  if (o.nameKey) keys.add(`name:${o.nameKey}`);
  return keys;
}

export function isSuppressed(s: Sighting, optOuts: OptOut[]): boolean {
  const mine = new Set<string>([
    ...s.extracted.phones,
    ...s.extracted.emails,
    `name:${normaliseName(s.extracted.name)}`,
  ]);
  return optOuts.some((o) => {
    for (const key of optOutKeys(o)) if (mine.has(key)) return true;
    return false;
  });
}

export function suppress(sightings: Sighting[], optOuts: OptOut[]): Sighting[] {
  if (optOuts.length === 0) return sightings;
  return sightings.filter((s) => !isSuppressed(s, optOuts));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run leads:test`
Expected: PASS, 6 tests.

- [ ] **Step 5: Commit**

```bash
git add lead-engine/src/optout/
git commit -m "feat(leads): suppress opted-out businesses across every source"
```

---

### Task 12: The ingest command

**Files:**
- Create: `lead-engine/src/cli/ingest.ts`
- Test: `lead-engine/src/cli/ingest.test.ts`

**Interfaces:**
- Consumes: everything above
- Produces: `ingest(opts: { file: string; dataDir: string; key: Buffer; now?: string }): Promise<{ sightings: number; businesses: number; candidates: number; suppressed: number }>`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import { ingest } from './ingest';
import { readRecords } from '../store/jsonl';
import type { Business } from '../sources/types';

let dataDir: string;
const key = randomBytes(32);
const fixture = path.join(__dirname, '../../fixtures/osm-sample.json');

beforeEach(() => { dataDir = mkdtempSync(path.join(tmpdir(), 'leads-cli-')); });

describe('ingest', () => {
  it('reports what it ingested', async () => {
    const r = await ingest({ file: fixture, dataDir, key });
    expect(r.sightings).toBe(2);
    expect(r.businesses).toBe(2);
    expect(r.suppressed).toBe(0);
  });

  it('writes businesses that carry provenance', async () => {
    await ingest({ file: fixture, dataDir, key });
    const businesses = await readRecords<Business>(path.join(dataDir, 'businesses.jsonl'), key);
    expect(businesses).toHaveLength(2);
    expect(businesses[0].name.source).toBe('openstreetmap');
    expect(businesses[0].name.sightingId).toBeTruthy();
  });

  it('is idempotent for a repeated run at the same timestamp', async () => {
    const now = '2026-09-02T10:00:00.000Z';
    await ingest({ file: fixture, dataDir, key, now });
    const second = await ingest({ file: fixture, dataDir, key, now });
    expect(second.businesses).toBe(2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run leads:test`
Expected: FAIL — cannot resolve `./ingest`.

- [ ] **Step 3: Write minimal implementation**

```ts
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { openStreetMapAdapter } from '../sources/openstreetmap';
import { resolve as resolveSightings } from '../resolve/resolve';
import { suppress, type OptOut } from '../optout/optout';
import { appendRecords, readRecords } from '../store/jsonl';
import { resolveDataDir } from '../store/paths';
import { loadKey } from '../store/crypto';
import type { Sighting } from '../sources/types';

export async function ingest(opts: {
  file: string; dataDir: string; key: Buffer; now?: string;
}): Promise<{ sightings: number; businesses: number; candidates: number; suppressed: number }> {
  const fetchedAt = opts.now ?? new Date().toISOString();
  const contents = await readFile(opts.file, 'utf8');
  const parsed = openStreetMapAdapter.parse(contents, fetchedAt);

  const optOuts = await readRecords<OptOut>(path.join(opts.dataDir, 'optouts.jsonl'), opts.key);
  const kept = suppress(parsed, optOuts);

  const priorSightings = await readRecords<Sighting>(path.join(opts.dataDir, 'sightings.jsonl'), opts.key);
  const seen = new Set(priorSightings.map((s) => s.id));
  const fresh = kept.filter((s) => !seen.has(s.id));
  await appendRecords(path.join(opts.dataDir, 'sightings.jsonl'), fresh, opts.key);

  const all = [...priorSightings, ...fresh];
  const { businesses, candidates } = resolveSightings(all);

  await appendRecords(path.join(opts.dataDir, 'businesses.jsonl'), businesses, opts.key);
  await appendRecords(path.join(opts.dataDir, 'merge-candidates.jsonl'), candidates, opts.key);

  return {
    sightings: kept.length,
    businesses: businesses.length,
    candidates: candidates.length,
    suppressed: parsed.length - kept.length,
  };
}

if (process.argv[1]?.endsWith('ingest.ts')) {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: npm run leads:ingest -- <path-to-osm-export.json>');
    process.exit(1);
  }
  const dataDir = resolveDataDir();
  const key = loadKey();
  ingest({ file, dataDir, key })
    .then((r) => console.log(`sightings ${r.sightings} · businesses ${r.businesses} · to review ${r.candidates} · suppressed ${r.suppressed}`))
    .catch((e) => { console.error(e.message); process.exit(1); });
}
```

Note: `businesses.jsonl` is append-only, so the latest resolution run is the tail of the file. Compaction is deliberately out of scope until the review queue exists.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run leads:test`
Expected: PASS, 3 tests.

- [ ] **Step 5: Run the whole suite**

Run: `npm run leads:test`
Expected: PASS, all tasks' tests green.

- [ ] **Step 6: Commit**

```bash
git add lead-engine/src/cli/
git commit -m "feat(leads): add ingest command wiring the offline pipeline"
```

---

### Task 13: The no-send invariant

The brief's original promise, made executable before any outreach code could ever be written.

**Files:**
- Create: `lead-engine/src/invariants.test.ts`
- Test: same file

**Interfaces:**
- Consumes: `SOURCE_REGISTRY` from `./sources/registry`
- Produces: nothing consumed by later tasks

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { SOURCE_REGISTRY } from './sources/registry';

const SRC = __dirname;

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) return sourceFiles(full);
    return full.endsWith('.ts') && !full.endsWith('.test.ts') ? [full] : [];
  });
}

describe('build-time invariants', () => {
  it('contains no code capable of sending a message', () => {
    const banned = /\b(sendMessage|sendMail|sendSms|nodemailer|twilio|whatsapp\.send)\b/i;
    const offenders = sourceFiles(SRC).filter((f) => banned.test(readFileSync(f, 'utf8')));
    expect(offenders).toEqual([]);
  });

  it('makes no network calls', () => {
    const network = /\b(fetch\(|axios|node-fetch|https?\.request|XMLHttpRequest)\b/;
    const offenders = sourceFiles(SRC).filter((f) => network.test(readFileSync(f, 'utf8')));
    expect(offenders).toEqual([]);
  });

  it('gives every registered source an explicit role', () => {
    for (const entry of Object.values(SOURCE_REGISTRY)) {
      expect(['citable', 'signal']).toContain(entry.role);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it passes immediately**

Run: `npm run leads:test`
Expected: PASS. This test guards a property the code already has — it fails the day someone breaks it, which is its whole purpose.

- [ ] **Step 3: Prove the guard actually bites**

Temporarily add `export function sendMessage() {}` to `lead-engine/src/cli/ingest.ts`, run `npm run leads:test`, and confirm the first invariant FAILS. Then remove the line and confirm the suite is green again. A guard never seen failing is not a guard.

- [ ] **Step 4: Ignore the data directory and Playwright output**

Append to `.gitignore`:

```
# Lead engine — prospect data never enters the repo
/lead-engine/data/
test-results/
```

- [ ] **Step 5: Commit**

```bash
git add lead-engine/src/invariants.test.ts .gitignore
git commit -m "test(leads): enforce no-send and no-network invariants"
```

---

## Self-Review

**Spec coverage.** Sightings model → Task 2. Field-level provenance → Tasks 2 and 10. Terms register and the citable/signal split → Task 2. Normalisation including E.164 and Arabic forms → Tasks 3–5. Encrypted store outside the repo → Tasks 1 and 6. First adapter → Task 7. Shared-contact guard → Task 8. Merge rules, red lines and the ambiguity band → Tasks 9–10. Opt-out across every source → Task 11. Pipeline wiring → Task 12. Invariants → Tasks 1, 2, 11, 13.

**Known gaps, deferred by the Scope Boundary above, not overlooked:** the Places check and its no-payload invariant; `softwareFit` and `mapFit`; the review queue and its merge-evidence split action; retention enforcement (O4); store compaction. Each needs the next plan.

**Deliberately provisional:** `SHARED_CONTACT_THRESHOLD`, `MERGE_THRESHOLD`, `AMBIGUITY_FLOOR` and `PROXIMITY_METRES` are named constants with comments saying so. The spec lists all four as wanting real Moroccan data before being fixed. Tuning them is the first task of the next plan, against output from a real ingest.

**Type consistency:** `Sighting.id` is `source:sourceId:fetchedAt` throughout; `SourceId` is the union from Task 2 everywhere; `FieldValue<T>` keeps `{value, source, sightingId, firstSeen, lastSeen}` in Tasks 2, 10 and 12; `resolve()` returns `{businesses, candidates}` in Tasks 10 and 12; `normalisePhone` returns `string | null` in Tasks 3 and 7.
