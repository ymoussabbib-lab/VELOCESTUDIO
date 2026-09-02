import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

export function loadKey(env: NodeJS.ProcessEnv = process.env): Buffer {
  const hex = env.VELOCE_DATA_KEY;
  if (!hex || hex.length !== 64) {
    throw new Error('VELOCE_DATA_KEY must be a 64-character hex string (32 bytes).');
  }
  return Buffer.from(hex, 'hex');
}

export function encrypt(plain: string, key: Buffer): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const body = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  return [iv.toString('base64'), cipher.getAuthTag().toString('base64'), body.toString('base64')].join('.');
}

export function decrypt(payload: string, key: Buffer): string {
  const [iv, tag, body] = payload.split('.');
  const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(iv, 'base64'));
  decipher.setAuthTag(Buffer.from(tag, 'base64'));
  return Buffer.concat([decipher.update(Buffer.from(body, 'base64')), decipher.final()]).toString('utf8');
}
