import asyncio
from playwright.async_api import async_playwright
import time

PYTHON_API_URL = "https://finease-suggestion-api.onrender.com/"
NODE_API_URL = "https://finease-0dj7.onrender.com/"

async def ping_url(playwright, url):
    browser = await playwright.chromium.launch()
    page = await browser.new_page()
    try:
        response = await page.goto(url, wait_until="domcontentloaded", timeout=15000)
        status = response.status if response else 'No response'
        print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Ping {url} - Status: {status}")
    except Exception as e:
        print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Ping {url} - Error: {e}")
    await browser.close()

async def main():
    async with async_playwright() as playwright:
        while True:
            await ping_url(playwright, PYTHON_API_URL)
            await ping_url(playwright, NODE_API_URL)
            await asyncio.sleep(60)

if __name__ == "__main__":
    asyncio.run(main())
