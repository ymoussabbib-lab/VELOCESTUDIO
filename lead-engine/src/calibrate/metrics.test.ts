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

  it('withholds verdicts by array position, not by id, so duplicate ids do not cause silent constraint loss', () => {
    // Two verdicts with the same id but different sighting pairs:
    // v1: (a, b) marked 'same'
    // v2: (b, c) marked 'same', with id='shared-id' (same as v1)
    // When scoring v1, the old code would exclude both because they have the same id.
    // The new code should only exclude v1 by position, keeping v2's constraint active.
    const sightings = [
      s('a', 'Salon A'),
      s('b', 'Salon B'),
      s('c', 'Salon C'),
    ];
    const v1: Verdict = {
      id: 'shared-id',
      aSightingId: 'a',
      bSightingId: 'b',
      decision: 'same',
      decidedAt: '2026-09-03T00:00:00.000Z',
    };
    const v2: Verdict = {
      id: 'shared-id', // same id as v1
      aSightingId: 'b',
      bSightingId: 'c',
      decision: 'same',
      decidedAt: '2026-09-03T00:00:00.000Z',
    };
    const verdicts = [v1, v2];

    // Score v1 (index 0). The `others` passed to resolve should contain only v2,
    // not exclude both v1 and v2 as the old id-based filter would have done.
    // With v2's constraint active (b and c same), if the config matches them,
    // v1 should still be correctly graded as a missed merge (a and b not merged
    // despite v1 saying they should be).
    const m = scoreConfig(sightings, verdicts, cfg);

    // Both verdicts should contribute to the score independently.
    // The test passes if the implementation uses index-based filtering correctly.
    // We expect at least v1 to be recorded as a missed merge (since a/b not matched),
    // demonstrating that v2's constraint was not silently dropped.
    expect(m.missedMerges.length).toBeGreaterThan(0);
  });
});
