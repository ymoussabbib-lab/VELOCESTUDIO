import { SOURCE_REGISTRY } from '../sources/registry';
import type { SourceId } from '../sources/types';

export interface ResolutionConfig {
  mergeThreshold: number;
  ambiguityFloor: number;
  proximityMetres: number;
  sharedContactThreshold: number;
  minDistinctiveTokens: number;
}

export interface TuningConfig {
  schemaVersion: 1;
  resolution: ResolutionConfig;
  sources: Record<SourceId, { enabled: boolean }>;
}

export const DEFAULT_TUNING: TuningConfig = {
  schemaVersion: 1,
  resolution: {
    mergeThreshold: 0.85,
    ambiguityFloor: 0.55,
    proximityMetres: 150,
    sharedContactThreshold: 3,
    minDistinctiveTokens: 2,
  },
  sources: Object.fromEntries(
    Object.keys(SOURCE_REGISTRY).map((id) => [id, { enabled: id === 'openstreetmap' }]),
  ) as Record<SourceId, { enabled: boolean }>,
};

const RESOLUTION_KEYS = ['mergeThreshold', 'ambiguityFloor', 'proximityMetres', 'sharedContactThreshold', 'minDistinctiveTokens'];

function fail(message: string): never {
  throw new Error(`Invalid tuning config — ${message}`);
}

export function validateTuning(input: unknown): TuningConfig {
  const c = input as TuningConfig;
  if (!c || typeof c !== 'object') fail('expected an object');
  if (c.schemaVersion !== 1) fail(`unsupported schemaVersion: ${c.schemaVersion}`);

  const r = c.resolution;
  if (!r || typeof r !== 'object') fail('missing resolution block');
  for (const key of Object.keys(r)) {
    if (!RESOLUTION_KEYS.includes(key)) fail(`unknown key: resolution.${key}`);
  }
  for (const key of ['mergeThreshold', 'ambiguityFloor'] as const) {
    const v = r[key];
    if (typeof v !== 'number' || v < 0 || v > 1) fail(`${key} must be between 0 and 1`);
  }
  if (r.ambiguityFloor >= r.mergeThreshold) fail('ambiguityFloor must be below mergeThreshold');
  if (typeof r.proximityMetres !== 'number' || r.proximityMetres <= 0) fail('proximityMetres must be positive');
  if (typeof r.sharedContactThreshold !== 'number' || r.sharedContactThreshold <= 0) {
    fail('sharedContactThreshold must be positive');
  }
  if (typeof r.minDistinctiveTokens !== 'number' || !Number.isInteger(r.minDistinctiveTokens) || r.minDistinctiveTokens <= 0) {
    fail('minDistinctiveTokens must be a positive integer');
  }

  if (!c.sources || typeof c.sources !== 'object') fail('missing sources block');
  for (const [id, entry] of Object.entries(c.sources)) {
    if (!(id in SOURCE_REGISTRY)) fail(`unknown source: ${id}`);
    for (const key of Object.keys(entry)) {
      if (key === 'role') fail('role is not configurable — it lives in the source registry');
      if (key !== 'enabled') fail(`unknown key: sources.${id}.${key}`);
    }
    if (typeof entry.enabled !== 'boolean') fail(`sources.${id}.enabled must be a boolean`);
  }
  return c;
}
