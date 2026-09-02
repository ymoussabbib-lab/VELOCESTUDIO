const LEGAL_FORMS = /\b(s\.?a\.?r\.?l\.?|s\.?a\.?|s\.?n\.?c\.?|sarlau|eurl|inc|ltd)\b/g;
const ARABIC_TASHKEEL = /[ً-ٰٟ]/g;

function unifyArabic(s: string): string {
  return s
    .replace(ARABIC_TASHKEEL, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/^ال/, '')
    .replace(/\sال/g, ' ');
}

export function normaliseName(raw: string): string {
  if (!raw) return '';
  let s = raw.normalize('NFD').replace(/[̀-ͯ]/g, '');
  s = s.toLowerCase();
  s = unifyArabic(s);
  s = s.replace(LEGAL_FORMS, ' ');
  s = s.replace(/[^\p{L}\p{N}\s]/gu, ' ');
  return s.replace(/\s+/g, ' ').trim();
}

export function nameTokens(raw: string): string[] {
  const n = normaliseName(raw);
  return n ? n.split(' ') : [];
}
