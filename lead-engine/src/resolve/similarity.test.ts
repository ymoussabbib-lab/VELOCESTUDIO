import { describe, it, expect } from 'vitest';
import { nameSimilarity, metresBetween } from './similarity';

describe('nameSimilarity', () => {
  it('scores identical names 1', () => {
    expect(nameSimilarity('Salon Yasmine', 'Salon Yasmine')).toBe(1);
  });

  it('ignores legal form and diacritics', () => {
    expect(nameSimilarity('Café Atlas SARL', 'Cafe Atlas')).toBe(1);
  });

  it('scores partial overlap between 0 and 1', () => {
    const score = nameSimilarity('Salon Yasmine Rabat', 'Salon Yasmine');
    expect(score).toBeGreaterThan(0.5);
    expect(score).toBeLessThan(1);
  });

  it('scores unrelated names near 0', () => {
    expect(nameSimilarity('Salon Yasmine', 'Pharmacie Centrale')).toBe(0);
  });

  it('scores empty input 0', () => {
    expect(nameSimilarity('', 'Salon Yasmine')).toBe(0);
  });
});

describe('metresBetween', () => {
  it('is 0 for the same point', () => {
    expect(metresBetween({ lat: 34.02, lon: -6.84 }, { lat: 34.02, lon: -6.84 })).toBe(0);
  });

  it('measures a short distance in metres', () => {
    const d = metresBetween({ lat: 34.0200, lon: -6.8400 }, { lat: 34.0209, lon: -6.8400 });
    expect(d).toBeGreaterThan(90);
    expect(d).toBeLessThan(110);
  });
});
