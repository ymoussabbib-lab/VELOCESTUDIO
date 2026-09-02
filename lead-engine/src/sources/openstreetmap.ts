import type { Sighting, SourceAdapter } from './types';
import { verticalFromOsmTags } from '../normalise/category';
import { normalisePhone } from '../normalise/phone';

interface OsmElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  tags?: Record<string, string>;
}

export const openStreetMapAdapter: SourceAdapter = {
  id: 'openstreetmap',
  parse(contents: string, fetchedAt: string): Sighting[] {
    const parsed = JSON.parse(contents) as { elements?: OsmElement[] };
    const out: Sighting[] = [];
    for (const el of parsed.elements ?? []) {
      const tags = el.tags ?? {};
      const name = tags.name?.trim();
      if (!name) continue;
      if (!verticalFromOsmTags(tags)) continue;
      const sourceId = `${el.type}/${el.id}`;
      const phones = [tags.phone, tags['contact:phone']]
        .map((p) => (p ? normalisePhone(p) : null))
        .filter((p): p is string => p !== null);
      const emails = [tags.email, tags['contact:email']].filter((e): e is string => Boolean(e));
      out.push({
        id: `openstreetmap:${sourceId}:${fetchedAt}`,
        source: 'openstreetmap',
        sourceId,
        fetchedAt,
        sourceUrl: `https://www.openstreetmap.org/${el.type}/${el.id}`,
        raw: el,
        extracted: {
          name,
          phones,
          emails,
          website: tags.website ?? tags['contact:website'],
          address: tags['addr:street'],
          locality: tags['addr:city'],
          lat: el.lat,
          lon: el.lon,
          category: JSON.stringify(tags),
        },
      });
    }
    return out;
  },
};
