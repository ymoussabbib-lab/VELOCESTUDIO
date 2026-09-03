import { describe, it, expect } from 'vitest';
import { isSuppressed, suppress, type OptOut } from './optout';
import type { Sighting, SourceId } from '../sources/types';

function s(id: string, name: string, phones: string[] = [], source: SourceId = 'openstreetmap'): Sighting {
  return { id, source, sourceId: id, fetchedAt: '2026-09-02T00:00:00.000Z', raw: {},
    extracted: { name, phones, emails: [] } };
}

const optOut: OptOut = {
  id: 'o1', phones: ['+212611111111'], emails: [],
  nameKey: 'salon yasmine', createdAt: '2026-09-01T00:00:00.000Z',
};

describe('opt-out suppression', () => {
  it('suppresses a matching phone', () => {
    expect(isSuppressed(s('a', 'Salon Yasmine', ['+212611111111']), [optOut])).toBe(true);
  });

  it('suppresses the same business arriving from a different source', () => {
    const fromDirectory = s('b', 'Salon Yasmine', ['+212611111111'], 'telecontact');
    expect(isSuppressed(fromDirectory, [optOut])).toBe(true);
  });

  it('suppresses on normalised name even when the phone is absent', () => {
    expect(isSuppressed(s('c', 'SALON YASMINE SARL', []), [optOut])).toBe(true);
  });

  it('leaves unrelated businesses alone', () => {
    expect(isSuppressed(s('d', 'Cafe Atlas', ['+212622222222']), [optOut])).toBe(false);
  });

  it('filters a list', () => {
    const list = [s('a', 'Salon Yasmine', ['+212611111111']), s('d', 'Cafe Atlas')];
    expect(suppress(list, [optOut]).map((x) => x.id)).toEqual(['d']);
  });

  it('is a no-op with no opt-outs', () => {
    const list = [s('a', 'Salon Yasmine', ['+212611111111'])];
    expect(suppress(list, [])).toHaveLength(1);
  });

  it('suppresses a matching email regardless of letter case', () => {
    const emailOptOut: OptOut = {
      id: 'o2', phones: [], emails: ['Contact@Example.MA'],
      createdAt: '2026-09-01T00:00:00.000Z',
    };
    function withEmail(id: string, email: string): Sighting {
      return { id, source: 'openstreetmap', sourceId: id, fetchedAt: '2026-09-02T00:00:00.000Z',
        raw: {}, extracted: { name: 'Anything', phones: [], emails: [email] } };
    }
    expect(isSuppressed(withEmail('e', 'contact@example.ma'), [emailOptOut])).toBe(true);
    expect(isSuppressed(withEmail('f', 'CONTACT@EXAMPLE.MA'), [emailOptOut])).toBe(true);
  });
});
