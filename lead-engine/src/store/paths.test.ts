import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { resolveDataDir } from './paths';

const REPO = path.resolve('/home/x/VELOCESTUDIO');

describe('resolveDataDir', () => {
  it('returns an explicit directory outside the repo', () => {
    expect(resolveDataDir({ VELOCE_DATA_DIR: '/home/x/veloce-data' }, REPO))
      .toBe(path.resolve('/home/x/veloce-data'));
  });

  it('refuses a directory inside the repo', () => {
    expect(() => resolveDataDir({ VELOCE_DATA_DIR: '/home/x/VELOCESTUDIO/data' }, REPO))
      .toThrow(/inside the repository/);
  });

  it('refuses the repo root itself', () => {
    expect(() => resolveDataDir({ VELOCE_DATA_DIR: REPO }, REPO))
      .toThrow(/inside the repository/);
  });

  it('refuses a traversal that lands back inside the repo', () => {
    expect(() => resolveDataDir({ VELOCE_DATA_DIR: '/home/x/veloce-data/../VELOCESTUDIO/d' }, REPO))
      .toThrow(/inside the repository/);
  });

  it('falls back to a home-directory default when unset', () => {
    const dir = resolveDataDir({ HOME: '/home/x' }, REPO);
    expect(dir).toBe(path.resolve(path.join('/home/x', '.veloce-lead-engine')));
  });
});
