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

// Findings from the final whole-branch review (2026-09-02): both were demonstrated
// by execution against real Moroccan OSM-shaped data, not hypothesised.
describe('resolve — post-review fixes for demonstrated bad merges', () => {
  it('C-1: does not merge two low-information same-name sightings on proximity alone', () => {
    // Two unrelated cafés both literally named "Cafe", 55m apart in Casablanca.
    const { businesses, candidates } = resolve([
      s('a', 'Café', { lat: 33.5731, lon: -7.5898 }),
      s('b', 'Cafe', { lat: 33.5736, lon: -7.5898 }),
    ]);
    expect(businesses).toHaveLength(2);
    expect(candidates).toHaveLength(1);
  });

  it('C-2: does not merge a shared-phone match across distant, known locations', () => {
    // Same name, same phone, but 90km apart (Rabat vs Casablanca) — a franchise
    // switchboard, not one business. Distance is known on both sides, so it must
    // be checked rather than merging on phone+name alone.
    const { businesses, candidates } = resolve([
      s('a', 'Cafe Atlas', { phones: ['+212537000000'], lat: 34.0200, lon: -6.8400 }),
      s('b', 'Cafe Atlas', { phones: ['+212537000000'], lat: 33.5731, lon: -7.5898 }),
    ]);
    expect(businesses).toHaveLength(2);
    expect(candidates).toHaveLength(1);
  });

  it('C-2 chain: a distant phone match does not transitively drag in a nearby third sighting', () => {
    // a-b share a phone but are 90km apart (must not merge, per the case above).
    // b-c are close and share a name (must merge). a and c share no key and sit
    // 90km apart. Before the fix, union-find chained a-b-c into one cluster.
    const { businesses } = resolve([
      s('a', 'Cafe Atlas', { phones: ['+212537000000'], lat: 34.0200, lon: -6.8400 }),
      s('b', 'Cafe Atlas', { phones: ['+212537000000'], lat: 33.5731, lon: -7.5898 }),
      s('c', 'Cafe Atlas', { lat: 33.5736, lon: -7.5898 }),
    ]);
    expect(businesses).toHaveLength(2);
    const groupSizes = businesses.map((biz) => biz.sightingIds.length).sort();
    expect(groupSizes).toEqual([1, 2]);
    const aBusiness = businesses.find((biz) => biz.sightingIds.includes('a'))!;
    expect(aBusiness.sightingIds).toEqual(['a']);
  });
});
