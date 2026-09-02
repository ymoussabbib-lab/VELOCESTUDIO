import type { Vertical } from '../sources/types';

export function verticalFromOsmTags(tags: Record<string, string>): Vertical | null {
  if (tags.leisure === 'fitness_centre') return 'gym';
  if (tags.leisure === 'sports_centre' && tags.sport === 'fitness') return 'gym';
  if (tags.shop === 'hairdresser' || tags.shop === 'beauty') return 'salon';
  if (tags.amenity === 'restaurant' || tags.amenity === 'cafe') return 'restaurant';
  if (tags.office === 'estate_agent') return 'agency';
  return null;
}
