import { describe, it, expect } from 'vitest';
import { normaliseName, nameTokens } from './name';

describe('normaliseName', () => {
  it('lowercases and strips French diacritics', () => {
    expect(normaliseName('Café Été')).toBe('cafe ete');
  });

  it('drops legal-form suffixes', () => {
    expect(normaliseName('Fitness Plus SARL')).toBe('fitness plus');
    expect(normaliseName('Atlas Immobilier S.A.R.L.')).toBe('atlas immobilier');
  });

  it('collapses punctuation and repeated whitespace', () => {
    expect(normaliseName('  Salon   "Yasmine" -- Rabat ')).toBe('salon yasmine rabat');
  });

  it('strips Arabic diacritics and unifies letter forms', () => {
    // hamza-below alef unifies to a bare alef; ta marbuta becomes ha
    expect(normaliseName('إجازة')).toBe('اجازه');
  });

  it('removes the Arabic definite article prefix', () => {
    expect(normaliseName('المنزل')).toBe('منزل');
  });

  it('returns an empty string for empty input', () => {
    expect(normaliseName('   ')).toBe('');
  });
});

describe('nameTokens', () => {
  it('splits a normalised name into tokens', () => {
    expect(nameTokens('Salon Yasmine SARL')).toEqual(['salon', 'yasmine']);
  });

  it('returns no tokens for empty input', () => {
    expect(nameTokens('')).toEqual([]);
  });
});
