import { describe, it, expect } from 'vitest';
import { verticalFromOsmTags } from './category';

describe('verticalFromOsmTags', () => {
  it.each([
    [{ leisure: 'fitness_centre' }, 'gym'],
    [{ leisure: 'sports_centre', sport: 'fitness' }, 'gym'],
    [{ shop: 'hairdresser' }, 'salon'],
    [{ shop: 'beauty' }, 'salon'],
    [{ amenity: 'restaurant' }, 'restaurant'],
    [{ amenity: 'cafe' }, 'restaurant'],
    [{ office: 'estate_agent' }, 'agency'],
  ])('maps %o', (tags, expected) => {
    expect(verticalFromOsmTags(tags)).toBe(expected);
  });

  it.each([
    [{ amenity: 'pharmacy' }],
    [{ shop: 'bakery' }],
    [{}],
  ])('returns null for out-of-scope %o', (tags) => {
    expect(verticalFromOsmTags(tags)).toBeNull();
  });
});
