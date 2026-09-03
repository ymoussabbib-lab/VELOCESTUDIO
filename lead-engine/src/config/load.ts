import { readFile, writeFile } from 'node:fs/promises';
import { validateTuning, type TuningConfig } from './schema';

export async function loadTuning(file: string): Promise<TuningConfig> {
  const raw = await readFile(file, 'utf8');
  const parsed = JSON.parse(raw) as unknown;
  try {
    return validateTuning(parsed);
  } catch (err) {
    throw new Error(`${(err as Error).message} (in ${file})`);
  }
}

export async function writeTuning(file: string, config: TuningConfig): Promise<void> {
  validateTuning(config);
  await writeFile(file, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
}
