import { describe, it, expect, beforeEach } from 'vitest';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { loadTuning, writeTuning } from './load';
import { DEFAULT_TUNING } from './schema';

let dir: string;
beforeEach(() => { dir = mkdtempSync(path.join(tmpdir(), 'leads-cfg-')); });

describe('tuning config file', () => {
  it('loads and validates a good file', async () => {
    const f = path.join(dir, 'tuning.json');
    writeFileSync(f, JSON.stringify(DEFAULT_TUNING));
    expect(await loadTuning(f)).toEqual(DEFAULT_TUNING);
  });

  it('reports the file path when validation fails', async () => {
    const f = path.join(dir, 'tuning.json');
    const bad = JSON.parse(JSON.stringify(DEFAULT_TUNING));
    bad.resolution.ambiguityFloor = 0.99;
    writeFileSync(f, JSON.stringify(bad));
    await expect(loadTuning(f)).rejects.toThrow(/tuning\.json/);
  });

  it('fails loudly on malformed JSON', async () => {
    const f = path.join(dir, 'tuning.json');
    writeFileSync(f, '{ not json');
    await expect(loadTuning(f)).rejects.toThrow();
  });

  it('round-trips a written config', async () => {
    const f = path.join(dir, 'tuning.json');
    const next = JSON.parse(JSON.stringify(DEFAULT_TUNING));
    next.resolution.mergeThreshold = 0.9;
    await writeTuning(f, next);
    expect(await loadTuning(f)).toEqual(next);
  });

  it('refuses to write an invalid config', async () => {
    const f = path.join(dir, 'tuning.json');
    const bad = JSON.parse(JSON.stringify(DEFAULT_TUNING));
    bad.resolution.proximityMetres = -1;
    await expect(writeTuning(f, bad)).rejects.toThrow(/proximityMetres must be positive/);
  });

  it('writes readable, diff-friendly JSON', async () => {
    const f = path.join(dir, 'tuning.json');
    await writeTuning(f, DEFAULT_TUNING);
    expect(readFileSync(f, 'utf8')).toContain('\n  "resolution"');
  });
});
