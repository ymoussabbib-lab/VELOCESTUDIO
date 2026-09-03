import http from 'node:http';
import { SOURCE_REGISTRY } from '../src/sources/registry';
import { validateTuning, type TuningConfig } from '../src/config/schema';
import { scoreConfig } from '../src/calibrate/metrics';
import { diffResolutions } from '../src/calibrate/diff';
import { resolve } from '../src/resolve/resolve';
import { GUARANTEES } from './guarantees';
import type { Sighting } from '../src/sources/types';
import type { Verdict } from '../src/resolve/verdicts';

export interface ServerDeps {
  loadConfig(): Promise<TuningConfig>;
  saveConfig(config: TuningConfig): Promise<void>;
  loadSightings(): Promise<Sighting[]>;
  loadVerdicts(): Promise<Verdict[]>;
}

function send(res: http.ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body);
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(payload);
}

async function readJson(req: http.IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

export function createServer(deps: ServerDeps): http.Server {
  return http.createServer(async (req, res) => {
    try {
      const url = req.url ?? '';
      if (req.method === 'GET' && url === '/api/guarantees') return send(res, 200, GUARANTEES);
      if (req.method === 'GET' && url === '/api/config') return send(res, 200, await deps.loadConfig());
      if (req.method === 'GET' && url === '/api/sources') {
        const config = await deps.loadConfig();
        const sightings = await deps.loadSightings();
        return send(res, 200, Object.values(SOURCE_REGISTRY).map((entry) => ({
          id: entry.id, label: entry.label, role: entry.role, terms: entry.terms,
          roleEditable: false, enabled: config.sources[entry.id]?.enabled ?? false,
          sightingCount: sightings.filter((sighting) => sighting.source === entry.id).length,
          lastIngestAt: sightings
            .filter((sighting) => sighting.source === entry.id)
            .map((sighting) => sighting.fetchedAt)
            .sort()
            .at(-1) ?? null,
        })));
      }
      if (req.method === 'POST' && (url === '/api/calibrate' || url === '/api/config/promote')) {
        const body = await readJson(req) as { config: unknown };
        let candidate: TuningConfig;
        try {
          candidate = validateTuning(body.config);
        } catch (err) {
          return send(res, 400, { error: (err as Error).message });
        }
        const [live, sightings, verdicts] = await Promise.all([
          deps.loadConfig(), deps.loadSightings(), deps.loadVerdicts(),
        ]);
        const before = resolve(sightings, { config: live.resolution, verdicts }).businesses;
        const after = resolve(sightings, { config: candidate.resolution, verdicts }).businesses;
        const payload = {
          metrics: scoreConfig(sightings, verdicts, candidate.resolution),
          diff: diffResolutions(before, after),
        };
        if (url === '/api/config/promote') await deps.saveConfig(candidate);
        return send(res, 200, payload);
      }
      return send(res, 404, { error: 'not found' });
    } catch (err) {
      return send(res, 500, { error: (err as Error).message });
    }
  });
}
