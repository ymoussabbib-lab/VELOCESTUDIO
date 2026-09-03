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
