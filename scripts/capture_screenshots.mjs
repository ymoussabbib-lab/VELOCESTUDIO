import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_APPS = [
  { name: 'fitpulse', url: 'https://appfit-plus.netlify.app' },
  { name: 'estatepulse', url: 'https://appreal-estate.netlify.app' },
  { name: 'salonflow', url: 'https://salonbeautyapp.netlify.app' },
  { name: 'restaurant-kds', url: 'https://appmanagerestaurant.netlify.app' },
  { name: 'restaurant-menu', url: 'https://rastaurant-app.netlify.app' }
];

async function captureAllScreenshots() {
  const outputDir = path.join(process.cwd(), 'public', 'screenshots');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Launching browser for screenshot capture...');
  const browser = await chromium.launch({ headless: true });

  for (const app of TARGET_APPS) {
    // Desktop Capture (1440x900)
    console.log(`Capturing Desktop: ${app.name}...`);
    try {
      const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const desktopPage = await desktopContext.newPage();
      await desktopPage.goto(app.url, { waitUntil: 'networkidle', timeout: 30000 });
      await desktopPage.screenshot({ path: path.join(outputDir, `${app.name}-desktop.png`) });
      await desktopContext.close();
    } catch (e) {
      console.error(`Error capturing desktop ${app.name}:`, e.message);
    }

    // Mobile Capture (390x844 - iPhone 13)
    console.log(`Capturing Mobile: ${app.name}...`);
    try {
      const mobileContext = await browser.newContext({
        viewport: { width: 390, height: 844 },
        isMobile: true,
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
      });
      const mobilePage = await mobileContext.newPage();
      await mobilePage.goto(app.url, { waitUntil: 'networkidle', timeout: 30000 });
      await mobilePage.screenshot({ path: path.join(outputDir, `${app.name}-mobile.png`) });
      await mobileContext.close();
    } catch (e) {
      console.error(`Error capturing mobile ${app.name}:`, e.message);
    }
  }

  await browser.close();
  console.log('✅ Screenshots successfully saved to public/screenshots/');
}

captureAllScreenshots().catch(console.error);
