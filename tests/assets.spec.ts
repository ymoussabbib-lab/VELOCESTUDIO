import { test, expect } from '@playwright/test';
import { ALL_MARKETING_ASSETS } from '@/data/assetManifest';

test('marketing asset manifest is complete', () => {
  for (const asset of ALL_MARKETING_ASSETS) {
    expect(asset.src).toMatch(/^\/assets\/better-quality\//);
    expect(asset.width).toBeGreaterThan(0);
    expect(asset.height).toBeGreaterThan(0);
    expect(asset.alt.length).toBeGreaterThan(0);
    expect(asset.caption.length).toBeGreaterThan(0);
  }
});
