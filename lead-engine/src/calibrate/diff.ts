import type { Business } from '../sources/types';

export interface ResolutionDiff {
  merged: { sightingIds: string[] }[];
  split: { sightingIds: string[] }[];
  unchanged: number;
}

const sig = (b: Business) => [...b.sightingIds].sort().join('|');

export function diffResolutions(before: Business[], after: Business[]): ResolutionDiff {
  const beforeOwner = new Map<string, number>();
  before.forEach((b, i) => b.sightingIds.forEach((sid) => beforeOwner.set(sid, i)));
  const afterOwner = new Map<string, number>();
  after.forEach((b, i) => b.sightingIds.forEach((sid) => afterOwner.set(sid, i)));

  const merged = after
    .filter((b) => b.sightingIds.length > 1
      && new Set(b.sightingIds.map((sid) => beforeOwner.get(sid))).size > 1)
    .map((b) => ({ sightingIds: b.sightingIds }));

  const split = before
    .filter((b) => b.sightingIds.length > 1
      && new Set(b.sightingIds.map((sid) => afterOwner.get(sid))).size > 1)
    .map((b) => ({ sightingIds: b.sightingIds }));

  const beforeSigs = new Set(before.map(sig));
  const unchanged = after.filter((b) => beforeSigs.has(sig(b))).length;

  return { merged, split, unchanged };
}
