import { test, expect } from '@playwright/test';

const slugs = ['fitpulse-pro', 'estatepulse', 'salonflow', 'restaurant-ecosystem'];

for (const slug of slugs) {
  test(`work route ${slug} renders reusable demo proof page`, async ({ page }) => {
    await page.goto(`/work/${slug}`);
    await expect(page.getByText(/demo system/i).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /manager view/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /client view/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /explore demo/i }).first()).toBeVisible();
    await expect(page.locator('a[href^="https://wa.me/212659592823"]').first()).toBeVisible();
  });
}

test('legacy project URLs redirect to canonical work URLs', async ({ page }) => {
  await page.goto('/projects/fitpulse');
  await expect(page).toHaveURL(/\/work\/fitpulse-pro$/);

  await page.goto('/projects/restaurant');
  await expect(page).toHaveURL(/\/work\/restaurant-ecosystem$/);
});
