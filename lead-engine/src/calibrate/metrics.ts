import type { Sighting } from '../sources/types';
import type { ResolutionConfig } from '../config/schema';
import { resolve } from '../resolve/resolve';
import { pairKey, type Verdict } from '../resolve/verdicts';

export interface LabelledPair { aSightingId: string; bSightingId: string }

export interface CalibrationMetrics {
  falseMerges: LabelledPair[];
  missedMerges: LabelledPair[];
  stillAmbiguous: LabelledPair[];
  clusterCount: number;
  largestCluster: number;
  labelledPairs: number;
}

export function scoreConfig(
  sightings: Sighting[],
  verdicts: Verdict[],
  config: ResolutionConfig,
): CalibrationMetrics {
  const falseMerges: LabelledPair[] = [];
  const missedMerges: LabelledPair[] = [];
  const stillAmbiguous: LabelledPair[] = [];

  for (const verdict of verdicts) {
    const others = verdicts.filter((x) => x.id !== verdict.id);
    const { businesses, candidates } = resolve(sightings, { config, verdicts: others });
    const cluster = businesses.find((bz) => bz.sightingIds.includes(verdict.aSightingId));
    const together = cluster?.sightingIds.includes(verdict.bSightingId) ?? false;
    const pair = { aSightingId: verdict.aSightingId, bSightingId: verdict.bSightingId };
    const key = pairKey(verdict.aSightingId, verdict.bSightingId);
    const ambiguous = candidates.some((c) => pairKey(c.aSightingId, c.bSightingId) === key);

    if (verdict.decision === 'different' && together) falseMerges.push(pair);
    if (verdict.decision === 'same' && !together) missedMerges.push(pair);
    if (ambiguous) stillAmbiguous.push(pair);
  }

  const { businesses } = resolve(sightings, { config, verdicts });
  return {
    falseMerges,
    missedMerges,
    stillAmbiguous,
    clusterCount: businesses.length,
    largestCluster: businesses.reduce((max, bz) => Math.max(max, bz.sightingIds.length), 0),
    labelledPairs: verdicts.length,
  };
}
