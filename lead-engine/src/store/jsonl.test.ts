import { describe, it, expect, beforeEach } from 'vitest';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import { appendRecords, readRecords } from './jsonl';

let dir: string;
const key = randomBytes(32);

beforeEach(() => { dir = mkdtempSync(path.join(tmpdir(), 'leads-')); });

describe('encrypted record store', () => {
  it('round-trips records', async () => {
    const file = path.join(dir, 'sightings.jsonl');
    await appendRecords(file, [{ id: 'a', n: 1 }, { id: 'b', n: 2 }], key);
    expect(await readRecords(file, key)).toEqual([{ id: 'a', n: 1 }, { id: 'b', n: 2 }]);
  });

  it('appends without dropping earlier records', async () => {
    const file = path.join(dir, 'sightings.jsonl');
    await appendRecords(file, [{ id: 'a' }], key);
    await appendRecords(file, [{ id: 'b' }], key);
    expect(await readRecords(file, key)).toEqual([{ id: 'a' }, { id: 'b' }]);
  });

  it('writes nothing readable as plaintext', async () => {
    const file = path.join(dir, 'sightings.jsonl');
    await appendRecords(file, [{ name: 'Salon Yasmine' }], key);
    expect(readFileSync(file, 'utf8')).not.toContain('Yasmine');
  });

  it('fails loudly on the wrong key', async () => {
    const file = path.join(dir, 'sightings.jsonl');
    await appendRecords(file, [{ id: 'a' }], key);
    await expect(readRecords(file, randomBytes(32))).rejects.toThrow();
  });

  it('returns an empty list when the file does not exist', async () => {
    expect(await readRecords(path.join(dir, 'missing.jsonl'), key)).toEqual([]);
  });
});
