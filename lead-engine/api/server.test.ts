import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { Server } from 'node:http';
import { createServer } from './server';
import { DEFAULT_TUNING } from '../src/config/schema';

let server: Server;
let base: string;

beforeEach(async () => {
  server = createServer({
    loadConfig: async () => DEFAULT_TUNING,
    saveConfig: async () => {},
    loadSightings: async () => [],
    loadVerdicts: async () => [],
  });
  await new Promise<void>((r) => server.listen(0, '127.0.0.1', r));
  const addr = server.address() as { port: number };
  base = `http://127.0.0.1:${addr.port}`;
});
afterEach(() => new Promise<void>((r) => { server.close(() => r()); }));

describe('control API', () => {
  it('binds loopback only', () => {
    expect((server.address() as { address: string }).address).toBe('127.0.0.1');
  });

  it('serves the live config', async () => {
    const res = await fetch(`${base}/api/config`);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(DEFAULT_TUNING);
  });

  it('serves guarantees with a locked flag', async () => {
    const body = await (await fetch(`${base}/api/guarantees`)).json();
    expect(body.length).toBeGreaterThan(0);
    expect(body.every((g: { locked: boolean }) => g.locked)).toBe(true);
  });

  it('exposes source roles read-only', async () => {
    const body = await (await fetch(`${base}/api/sources`)).json();
    const instagram = body.find((s: { id: string }) => s.id === 'instagram');
    expect(instagram.role).toBe('signal');
    expect(instagram.roleEditable).toBe(false);
  });

  it('rejects an invalid candidate config on calibrate', async () => {
    const bad = JSON.parse(JSON.stringify(DEFAULT_TUNING));
    bad.resolution.ambiguityFloor = 0.99;
    const res = await fetch(`${base}/api/calibrate`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ config: bad }),
    });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/ambiguityFloor/);
  });

  it('returns metrics and a diff on a valid calibrate', async () => {
    const res = await fetch(`${base}/api/calibrate`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ config: DEFAULT_TUNING }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.metrics).toBeDefined();
    expect(body.diff).toBeDefined();
    expect(body.metrics.accuracy).toBeUndefined();
  });

  it('has no route that sends anything to a prospect', async () => {
    for (const path of ['/api/send', '/api/outreach', '/api/message']) {
      expect((await fetch(`${base}${path}`)).status).toBe(404);
    }
  });
});
