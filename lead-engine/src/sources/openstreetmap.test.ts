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
