import { describe, it, expect } from 'vitest';
import { SOURCE_REGISTRY, assertCitable, isCitable } from './registry';

describe('source terms register', () => {
  it('marks OpenStreetMap and the directories citable', () => {
    expect(isCitable('openstreetmap')).toBe(true);
    expect(isCitable('telecontact')).toBe(true);
  });

  it('marks delivery and social sources signal-only', () => {
    expect(isCitable('glovo')).toBe(false);
    expect(isCitable('instagram')).toBe(false);
  });

  it('throws when a signal-only source would be cited', () => {
    expect(() => assertCitable('instagram'))
      .toThrow(/instagram is signal-only and may not be cited/);
  });

  it('does not throw for a citable source', () => {
    expect(() => assertCitable('openstreetmap')).not.toThrow();
  });

  it('records the terms position for every registered source', () => {
    for (const entry of Object.values(SOURCE_REGISTRY)) {
      expect(entry.terms.length).toBeGreaterThan(0);
    }
  });
});
