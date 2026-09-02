import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { openStreetMapAdapter } from '../sources/openstreetmap';
import { resolve as resolveSightings } from '../resolve/resolve';
import { suppress, type OptOut } from '../optout/optout';
import { appendRecords, readRecords } from '../store/jsonl';
import { resolveDataDir } from '../store/paths';
import { loadKey } from '../store/crypto';
import type { Sighting } from '../sources/types';

export async function ingest(opts: {
  file: string; dataDir: string; key: Buffer; now?: string;
}): Promise<{ sightings: number; businesses: number; candidates: number; suppressed: number }> {
  const fetchedAt = opts.now ?? new Date().toISOString();
  const contents = await readFile(opts.file, 'utf8');
  const parsed = openStreetMapAdapter.parse(contents, fetchedAt);

  const optOuts = await readRecords<OptOut>(path.join(opts.dataDir, 'optouts.jsonl'), opts.key);
  const kept = suppress(parsed, optOuts);

  const priorSightings = await readRecords<Sighting>(path.join(opts.dataDir, 'sightings.jsonl'), opts.key);
  const seen = new Set(priorSightings.map((s) => s.id));
  const fresh = kept.filter((s) => !seen.has(s.id));
  await appendRecords(path.join(opts.dataDir, 'sightings.jsonl'), fresh, opts.key);

  const all = [...priorSightings, ...fresh];
  const { businesses, candidates } = resolveSightings(all);

  await appendRecords(path.join(opts.dataDir, 'businesses.jsonl'), businesses, opts.key);
  await appendRecords(path.join(opts.dataDir, 'merge-candidates.jsonl'), candidates, opts.key);

  return {
    sightings: kept.length,
    businesses: businesses.length,
    candidates: candidates.length,
    suppressed: parsed.length - kept.length,
  };
}

if (process.argv[1]?.endsWith('ingest.ts')) {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: npm run leads:ingest -- <path-to-osm-export.json>');
    process.exit(1);
  }
  const dataDir = resolveDataDir();
  const key = loadKey();
  ingest({ file, dataDir, key })
    .then((r) => console.log(`sightings ${r.sightings} · businesses ${r.businesses} · to review ${r.candidates} · suppressed ${r.suppressed}`))
    .catch((e) => { console.error(e.message); process.exit(1); });
}
