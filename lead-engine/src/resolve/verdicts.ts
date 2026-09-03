export interface Verdict {
  id: string;
  aSightingId: string;
  bSightingId: string;
  decision: 'same' | 'different';
  decidedAt: string;
  note?: string;
}

export interface ConstraintConflict {
  aSightingId: string;
  bSightingId: string;
  reason: string;
}

export function pairKey(a: string, b: string): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

export function buildConstraints(verdicts: Verdict[]): {
  forcedSame: [string, string][];
  forbidden: Set<string>;
  contradictions: ConstraintConflict[];
} {
  const same = new Map<string, [string, string]>();
  const forbidden = new Set<string>();
  const contradictions: ConstraintConflict[] = [];

  for (const verdict of verdicts) {
    const key = pairKey(verdict.aSightingId, verdict.bSightingId);
    if (verdict.decision === 'same') same.set(key, [verdict.aSightingId, verdict.bSightingId]);
    else forbidden.add(key);
  }
  for (const [key, pair] of same) {
    if (forbidden.has(key)) {
      contradictions.push({
        aSightingId: pair[0],
        bSightingId: pair[1],
        reason: 'contradictory verdicts: marked both same and different',
      });
    }
  }
  return { forcedSame: [...same.values()], forbidden, contradictions };
}
