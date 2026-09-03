import type { Business } from '../sources/types';

export interface ResolutionDiff {
  merged: { sightingIds: string[] }[];
  split: { sightingIds: string[] }[];
  unchanged: number;
}

const sig = (b: Business) => [...b.sightingIds].sort().join('|');

export function diffResolutions(before: Business[], after: Business[]): ResolutionDiff {
  const beforeSigs = new Set(before.map(sig));
  const afterSigs = new Set(after.map(sig));
  const merged = after.filter((b) => !beforeSigs.has(sig(b)) && b.sightingIds.length > 1)
    .map((b) => ({ sightingIds: b.sightingIds }));
  const split = before.filter((b) => !afterSigs.has(sig(b)) && b.sightingIds.length > 1)
    .map((b) => ({ sightingIds: b.sightingIds }));
  const unchanged = after.filter((b) => beforeSigs.has(sig(b))).length;
  return { merged, split, unchanged };
}
