import type { Business, FieldValue, Sighting } from '../sources/types';
import { nameTokens } from '../normalise/name';
import { findSharedContacts } from './shared';
import { metresBetween, tokenSimilarity } from './similarity';

/** All three are provisional and get retuned against real ingested data. */
export const MERGE_THRESHOLD = 0.85;
export const AMBIGUITY_FLOOR = 0.55;
export const PROXIMITY_METRES = 150;

/**
 * Bare category words used as OSM placeholder names for Moroccan businesses
 * (a hair salon literally named "Salon de Coiffure", a bakery named
 * "Boulangerie Patisserie"). A name match built only from these tokens
 * carries no real corroborating information. Provisional — retune against
 * real ingested data, same as the thresholds above.
 */
export const GENERIC_NAME_TOKENS = new Set([
  'cafe', 'snack', 'restaurant', 'salon', 'coiffure', 'pharmacie', 'gym',
  'pizzeria', 'patisserie', 'boulangerie', 'hotel', 'riad', 'epicerie',
  'superette', 'taxi', 'service', 'garde', 'ecole', 'auto', 'centre',
  'de', 'du', 'des', 'la', 'le', 'les', 'et',
]);

export interface MergeCandidate {
  aSightingId: string;
  bSightingId: string;
  score: number;
  reason: string;
}

type Decision = 'merge' | 'ambiguous' | 'apart';

function decide(a: Sighting, b: Sighting, shared: Set<string>): { d: Decision; score: number; reason: string } {
  const tokensA = new Set(nameTokens(a.extracted.name));
  const tokensB = new Set(nameTokens(b.extracted.name));
  const score = tokenSimilarity(tokensA, tokensB);

  const phones = new Set(a.extracted.phones.filter((p) => !shared.has(p)));
  const phoneMatch = b.extracted.phones.some((p) => !shared.has(p) && phones.has(p));

  const aLocated = a.extracted.lat !== undefined && a.extracted.lon !== undefined;
  const bLocated = b.extracted.lat !== undefined && b.extracted.lon !== undefined;
  const bothLocated = aLocated && bLocated;
  const eitherLocated = aLocated || bLocated;
  const near =
    bothLocated &&
    metresBetween(
      { lat: a.extracted.lat!, lon: a.extracted.lon! },
      { lat: b.extracted.lat!, lon: b.extracted.lon! },
    ) <= PROXIMITY_METRES;

  // Franchise branches share a name and a switchboard number. A phone match
  // must not bridge two locations we know are far apart, or bridge a located
  // sighting to one whose location we simply don't have — either lets
  // union-find chain unrelated branches into one business. Only when NEITHER
  // side carries coordinates does a bare phone+name match still merge; that
  // coordinate-free case is the plan's original behaviour and is unchanged.
  if (phoneMatch && score >= MERGE_THRESHOLD) {
    if (!eitherLocated || (bothLocated && near)) {
      return { d: 'merge', score, reason: 'exact phone and similar name' };
    }
    return { d: 'ambiguous', score, reason: 'phone and name match, but locations are not confirmed close' };
  }

  // A name shared only by generic, low-information tokens (e.g. two
  // businesses both named "Cafe", or both named "Salon de Coiffure") carries
  // no real corroborating value however identical it scores — require at
  // least two tokens on each side, AND at least one shared token that isn't a
  // bare category word, before proximity alone can merge.
  const distinctTokenFloor = Math.min(tokensA.size, tokensB.size) >= 2;
  const sharedDistinctiveToken =
    [...tokensA].some((t) => tokensB.has(t) && !GENERIC_NAME_TOKENS.has(t));
  const distinctive = distinctTokenFloor && sharedDistinctiveToken;

  if (near && score >= MERGE_THRESHOLD && distinctive) {
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
