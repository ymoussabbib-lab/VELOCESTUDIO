const NATIONAL = /^0([5-7]\d{8})$/;
const E164 = /^\+212([5-7]\d{8})$/;

export function normalisePhone(raw: string): string | null {
  if (!raw) return null;
  let s = raw.replace(/[()\s.\- ]/g, '');
  if (s.startsWith('00')) s = `+${s.slice(2)}`;
  if (/^212/.test(s)) s = `+${s}`;
  if (s.startsWith('+212')) {
    const rest = s.slice(4).replace(/^0/, '');
    s = `+212${rest}`;
    return E164.test(s) ? s : null;
  }
  const m = NATIONAL.exec(s);
  return m ? `+212${m[1]}` : null;
}
