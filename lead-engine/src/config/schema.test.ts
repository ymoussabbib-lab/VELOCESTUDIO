import { describe, it, expect } from 'vitest';
import { validateTuning, DEFAULT_TUNING } from './schema';

const valid = () => JSON.parse(JSON.stringify(DEFAULT_TUNING));

describe('validateTuning', () => {
  it('accepts the shipped defaults', () => {
    expect(validateTuning(valid())).toEqual(DEFAULT_TUNING);
  });

  it('rejects an ambiguity floor at or above the merge threshold', () => {
    const c = valid();
    c.resolution.ambiguityFloor = 0.9;
    c.resolution.mergeThreshold = 0.85;
    expect(() => validateTuning(c)).toThrow(/ambiguityFloor must be below mergeThreshold/);
  });

  it('rejects a threshold outside 0..1', () => {
    const c = valid();
    c.resolution.mergeThreshold = 1.4;
    expect(() => validateTuning(c)).toThrow(/mergeThreshold must be between 0 and 1/);
  });

  it('rejects a non-positive proximity radius', () => {
    const c = valid();
    c.resolution.proximityMetres = 0;
    expect(() => validateTuning(c)).toThrow(/proximityMetres must be positive/);
  });

  it('rejects unknown keys rather than ignoring them', () => {
    const c = valid();
    c.resolution.mergeThreshhold = 0.9;
    expect(() => validateTuning(c)).toThrow(/unknown key: resolution.mergeThreshhold/);
  });

  it('rejects an unknown source id', () => {
    const c = valid();
    c.sources.linkedin = { enabled: true };
    expect(() => validateTuning(c)).toThrow(/unknown source: linkedin/);
  });

  it('rejects a source entry carrying a role', () => {
    const c = valid();
    c.sources.instagram = { enabled: true, role: 'citable' };
    expect(() => validateTuning(c)).toThrow(/role is not configurable/);
  });

  it('rejects an unsupported schemaVersion', () => {
    const c = valid();
    c.schemaVersion = 99;
    expect(() => validateTuning(c)).toThrow(/unsupported schemaVersion/);
  });

  it('rejects a non-positive minDistinctiveTokens', () => {
    const c = valid();
    c.resolution.minDistinctiveTokens = 0;
    expect(() => validateTuning(c)).toThrow(/minDistinctiveTokens must be a positive integer/);
  });

  it('rejects a proximity radius above the safety cap', () => {
    const c = valid();
    c.resolution.proximityMetres = 5000;
    expect(() => validateTuning(c)).toThrow(/proximityMetres must be at most 2000 metres/);
  });
});
