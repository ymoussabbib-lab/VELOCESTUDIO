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
