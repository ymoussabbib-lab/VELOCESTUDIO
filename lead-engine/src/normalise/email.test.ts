import { describe, it, expect } from 'vitest';
import { normaliseEmail } from './email';

describe('normaliseEmail', () => {
  it('lowercases', () => {
    expect(normaliseEmail('Contact@Example.MA')).toBe('contact@example.ma');
  });

  it('trims surrounding whitespace', () => {
    expect(normaliseEmail('  contact@example.ma  ')).toBe('contact@example.ma');
  });

  it('treats case variants as equal', () => {
    expect(normaliseEmail('CONTACT@example.ma')).toBe(normaliseEmail('contact@Example.MA'));
  });
});
