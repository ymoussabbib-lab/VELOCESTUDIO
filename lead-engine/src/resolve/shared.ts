import type { Sighting } from '../sources/types';
import { normaliseEmail } from '../normalise/email';
import { normaliseName } from '../normalise/name';

/** Provisional. Retune once real Moroccan data has been ingested. */
export const SHARED_CONTACT_THRESHOLD = 3;

export function findSharedContacts(
  sightings: Sighting[],
  threshold: number = SHARED_CONTACT_THRESHOLD,
): Set<string> {
  const names = new Map<string, Set<string>>();
  for (const s of sightings) {
    const key = normaliseName(s.extracted.name);
    const contacts = [...s.extracted.phones, ...s.extracted.emails.map(normaliseEmail)];
    for (const contact of contacts) {
      if (!names.has(contact)) names.set(contact, new Set());
      names.get(contact)!.add(key);
    }
  }
  const shared = new Set<string>();
  for (const [contact, distinct] of names) {
    if (distinct.size >= threshold) shared.add(contact);
  }
  return shared;
}
