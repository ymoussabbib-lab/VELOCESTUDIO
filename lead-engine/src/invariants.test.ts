import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { SOURCE_REGISTRY } from './sources/registry';

const SRC = __dirname;

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) return sourceFiles(full);
    return full.endsWith('.ts') && !full.endsWith('.test.ts') ? [full] : [];
  });
}

describe('build-time invariants', () => {
  it('contains no code capable of sending a message', () => {
    const banned = /\b(sendMessage|sendMail|sendSms|nodemailer|twilio|whatsapp\.send)\b/i;
    const offenders = sourceFiles(SRC).filter((f) => banned.test(readFileSync(f, 'utf8')));
    expect(offenders).toEqual([]);
  });

  it('makes no network calls', () => {
    const network = /\b(fetch\(|axios|node-fetch|https?\.request|XMLHttpRequest)\b/;
    const offenders = sourceFiles(SRC).filter((f) => network.test(readFileSync(f, 'utf8')));
    expect(offenders).toEqual([]);
  });

  it('gives every registered source an explicit role', () => {
    for (const entry of Object.values(SOURCE_REGISTRY)) {
      expect(['citable', 'signal']).toContain(entry.role);
    }
  });
});
