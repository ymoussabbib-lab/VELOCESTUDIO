import os
import asyncio
from playwright.async_api import async_playwright

TARGET_APPS = [
    {"name": "fitpulse", "url": "https://gym.velocestudio.tech"},
    {"name": "estatepulse", "url": "https://immobilier.velocestudio.tech"},
    {"name": "salonflow", "url": "https://salon.velocestudio.tech"},
    {"name": "restaurant-kds", "url": "https://resto-manager.velocestudio.tech"},
    {"name": "restaurant-menu", "url": "https://resto.velocestudio.tech"}
]

async def capture_all_screenshots():
    output_dir = os.path.join(os.getcwd(), "public", "screenshots")
    os.makedirs(output_dir, exist_ok=True)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)

        for app in TARGET_APPS:
            # Desktop Capture (1440x900)
            desktop_context = await browser.new_context(viewport={"width": 1440, "height": 900})
            desktop_page = await desktop_context.new_page()
            print(f"Capturing Desktop: {app['name']}...")
            try:
                await desktop_page.goto(app["url"], wait_until="networkidle", timeout=30000)
                await desktop_page.screenshot(path=os.path.join(output_dir, f"{app['name']}-desktop.png"))
            except Exception as e:
                print(f"Error capturing desktop {app['name']}: {e}")
            finally:
                await desktop_context.close()

            # Mobile Capture (390x844 - iPhone 13)
            mobile_context = await browser.new_context(
                viewport={"width": 390, "height": 844},
                is_mobile=True,
                user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15"
            )
            mobile_page = await mobile_context.new_page()
            print(f"Capturing Mobile: {app['name']}...")
            try:
                await mobile_page.goto(app["url"], wait_until="networkidle", timeout=30000)
                await mobile_page.screenshot(path=os.path.join(output_dir, f"{app['name']}-mobile.png"))
            except Exception as e:
                print(f"Error capturing mobile {app['name']}: {e}")
            finally:
                await mobile_context.close()

        await browser.close()
        print("✅ Screenshots successfully saved to public/screenshots/")

if __name__ == "__main__":
    asyncio.run(capture_all_screenshots())
