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
