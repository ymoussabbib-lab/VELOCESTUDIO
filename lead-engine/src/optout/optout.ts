import type { Sighting } from '../sources/types';
import { normaliseName } from '../normalise/name';

export interface OptOut {
  id: string;
  phones: string[];
  emails: string[];
  nameKey?: string;
  createdAt: string;
}

export function optOutKeys(o: OptOut): Set<string> {
  const keys = new Set<string>([...o.phones, ...o.emails]);
  if (o.nameKey) keys.add(`name:${o.nameKey}`);
  return keys;
}

export function isSuppressed(s: Sighting, optOuts: OptOut[]): boolean {
  const mine = new Set<string>([
    ...s.extracted.phones,
    ...s.extracted.emails,
    `name:${normaliseName(s.extracted.name)}`,
  ]);
  return optOuts.some((o) => {
    for (const key of optOutKeys(o)) if (mine.has(key)) return true;
    return false;
  });
}

export function suppress(sightings: Sighting[], optOuts: OptOut[]): Sighting[] {
  if (optOuts.length === 0) return sightings;
  return sightings.filter((s) => !isSuppressed(s, optOuts));
}
