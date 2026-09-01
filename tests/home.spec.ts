import { test, expect } from '@playwright/test';

test('homepage presents the proof-system sales flow', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toContainText(/your business runs on software/i);
  await expect(page.getByRole('link', { name: /see what we build/i }).first()).toBeVisible();
  await expect(page.getByText(/gyms .* salons .* restaurants .* real estate/i)).toBeVisible();

  for (const label of ['Gym', 'Salon / Spa', 'Restaurant / Cafe', 'Real Estate', 'Custom Business']) {
    await page.getByRole('button', { name: label }).click();
  }

  await expect(page.locator('a[href^="/work/"]')).toHaveCount(4);
  await expect(page.locator('a[href^="https://wa.me/212659592823"]').first()).toBeVisible();
});

for (const width of [320, 360, 390, 414, 768, 1024, 1280]) {
  test(`homepage has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
}
