import { describe, it, expect } from 'vitest';
import { normalisePhone } from './phone';

describe('normalisePhone', () => {
  it.each([
    ['0612345678', '+212612345678'],
    ['06 12 34 56 78', '+212612345678'],
    ['06-12-34-56-78', '+212612345678'],
    ['+212612345678', '+212612345678'],
    ['212612345678', '+212612345678'],
    ['00212612345678', '+212612345678'],
    ['+212 (0)6 12 34 56 78', '+212612345678'],
    ['0522123456', '+212522123456'],
    ['0712345678', '+212712345678'],
  ])('normalises %s', (input, expected) => {
    expect(normalisePhone(input)).toBe(expected);
  });

  it.each([
    ['', 'empty'],
    ['12345', 'too short'],
    ['0912345678', 'invalid prefix'],
    ['+33612345678', 'not Moroccan'],
    ['not a phone', 'garbage'],
  ])('rejects %s (%s)', (input) => {
    expect(normalisePhone(input)).toBeNull();
  });
});
