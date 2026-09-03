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
