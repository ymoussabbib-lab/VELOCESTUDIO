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
