import path from 'node:path';
import { createServer } from './server';
import { loadTuning, writeTuning } from '../src/config/load';
import { loadKey } from '../src/store/crypto';
import { readRecords } from '../src/store/jsonl';
import { resolveDataDir } from '../src/store/paths';
import type { Sighting } from '../src/sources/types';
import type { Verdict } from '../src/resolve/verdicts';

const HOST = '127.0.0.1';
const PORT = 4317;
const repoRoot = process.cwd();
const configFile = path.join(repoRoot, 'lead-engine', 'config', 'tuning.json');

let warnedAboutMissingStore = false;

async function loadStoreRecords<T>(fileName: string): Promise<T[]> {
  try {
    const dataDir = resolveDataDir(process.env, repoRoot);
    const key = loadKey();
    return await readRecords<T>(path.join(dataDir, fileName), key);
  } catch (err) {
    if (!warnedAboutMissingStore) {
      warnedAboutMissingStore = true;
      console.warn(`Lead engine store unavailable: ${(err as Error).message}`);
      console.warn('Starting control UI with an empty local snapshot.');
    }
    return [];
  }
}

export function createControlServer() {
  return createServer({
    loadConfig: () => loadTuning(configFile),
    saveConfig: (config) => writeTuning(configFile, config),
    loadSightings: () => loadStoreRecords<Sighting>('sightings.jsonl'),
    loadVerdicts: () => loadStoreRecords<Verdict>('verdicts.jsonl'),
  });
}

export function startControlApi() {
  const server = createControlServer();
  server.listen(PORT, HOST, () => {
    console.log(`Lead engine API listening on http://${HOST}:${PORT}`);
  });
  return server;
}

if (process.argv[1]?.endsWith('main.ts')) {
  startControlApi();
}
