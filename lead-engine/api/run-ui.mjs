import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const outdir = path.join(process.cwd(), 'lead-engine', '.tmp');
const outfile = path.join(outdir, 'control-api.mjs');

await mkdir(outdir, { recursive: true });
await build({
  entryPoints: ['lead-engine/api/main.ts'],
  outfile,
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  logLevel: 'silent',
});

const api = await import(`${pathToFileURL(outfile).href}?t=${Date.now()}`);
const server = api.startControlApi();
const vite = process.platform === 'win32'
  ? spawn('cmd.exe', ['/d', '/s', '/c', 'npm.cmd --prefix lead-engine/ui run dev'], { stdio: 'inherit' })
  : spawn('npm', ['--prefix', 'lead-engine/ui', 'run', 'dev'], { stdio: 'inherit' });

function shutdown() {
  vite.kill();
  server.close(() => process.exit(0));
}

vite.on('exit', (code) => {
  server.close(() => process.exit(code ?? 0));
});

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
