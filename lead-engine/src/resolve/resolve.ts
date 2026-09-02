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
