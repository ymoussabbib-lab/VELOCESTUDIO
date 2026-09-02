import path from 'node:path';

export function resolveDataDir(
  env: NodeJS.ProcessEnv = process.env,
  repoRoot: string = process.cwd(),
): string {
  const home = env.HOME ?? env.USERPROFILE ?? '';
  const raw = env.VELOCE_DATA_DIR ?? path.join(home, '.veloce-lead-engine');
  const dir = path.resolve(raw);
  const repo = path.resolve(repoRoot);
  const rel = path.relative(repo, dir);
  const inside = rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
  if (inside) {
    throw new Error(
      `Refusing to use ${dir}: it is inside the repository. Prospect data must live outside it.`,
    );
  }
  return dir;
}
