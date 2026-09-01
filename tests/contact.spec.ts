import { test, expect } from '@playwright/test';
import { createWhatsAppHref } from '@/lib/contact';

test('whatsapp href encodes message and phone number', () => {
  const href = createWhatsAppHref('Bonjour, test');
  const url = new URL(href);

  expect(url.origin).toBe('https://wa.me');
  expect(url.pathname).toBe('/212659592823');
  expect(url.searchParams.get('text')).toBe('Bonjour, test');
});
