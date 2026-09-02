import { appendFile, readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { encrypt, decrypt } from './crypto';

export async function appendRecords<T>(file: string, records: T[], key: Buffer): Promise<void> {
  if (records.length === 0) return;
  await mkdir(path.dirname(file), { recursive: true });
  const lines = records.map((r) => `${encrypt(JSON.stringify(r), key)}\n`).join('');
  await appendFile(file, lines, 'utf8');
}

export async function readRecords<T>(file: string, key: Buffer): Promise<T[]> {
  let raw: string;
  try {
    raw = await readFile(file, 'utf8');
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw err;
  }
  return raw.split('\n').filter(Boolean).map((line) => JSON.parse(decrypt(line, key)) as T);
}
