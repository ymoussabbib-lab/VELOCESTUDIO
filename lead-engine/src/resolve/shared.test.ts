import { describe, it, expect } from 'vitest';
import { findSharedContacts, SHARED_CONTACT_THRESHOLD } from './shared';
import type { Sighting } from '../sources/types';

function s(id: string, name: string, phones: string[], emails: string[] = []): Sighting {
  return { id, source: 'openstreetmap', sourceId: id, fetchedAt: '2026-09-02T00:00:00.000Z',
    raw: {}, extracted: { name, phones, emails } };
}

describe('findSharedContacts', () => {
  it('flags a phone used by more distinct names than the threshold', () => {
    const list = ['A Gym', 'B Salon', 'C Cafe', 'D Agency']
      .map((n, i) => s(String(i), n, ['+212500000000']));
    expect(findSharedContacts(list).has('+212500000000')).toBe(true);
  });

  it('leaves a phone used by one business alone', () => {
    expect(findSharedContacts([s('1', 'A Gym', ['+212611111111'])]).has('+212611111111')).toBe(false);
  });

  it('counts distinct names, not sightings', () => {
    const list = Array.from({ length: 6 }, (_, i) => s(String(i), 'Same Salon', ['+212622222222']));
    expect(findSharedContacts(list).has('+212622222222')).toBe(false);
  });

  it('flags shared email addresses too', () => {
    const list = ['A', 'B', 'C', 'D'].map((n, i) => s(String(i), n, [], ['contact@example.ma']));
    expect(findSharedContacts(list).has('contact@example.ma')).toBe(true);
  });

  it('honours an explicit threshold', () => {
    const list = ['A', 'B'].map((n, i) => s(String(i), n, ['+212633333333']));
    expect(findSharedContacts(list, 2).has('+212633333333')).toBe(true);
  });

  it('flags a shared email regardless of letter case', () => {
    const list = [
      s('0', 'A', [], ['Contact@Example.MA']),
      s('1', 'B', [], ['contact@example.ma']),
      s('2', 'C', [], ['CONTACT@EXAMPLE.MA']),
      s('3', 'D', [], ['contact@Example.ma']),
    ];
    expect(findSharedContacts(list).has('contact@example.ma')).toBe(true);
  });

  it('exports a documented default threshold', () => {
    expect(SHARED_CONTACT_THRESHOLD).toBeGreaterThan(1);
  });
});
