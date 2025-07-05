import time
from playwright.sync_api import sync_playwright

PYTHON_API_URL = "https://finease-suggestion-api.onrender.com/"
NODE_API_URL = "https://finease-0dj7.onrender.com/"


def ping_url(playwright, url):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    try:
        response = page.goto(url, wait_until="domcontentloaded", timeout=15000)
        status = response.status if response else 'No response'
        print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Ping {url} - Status: {status}")
    except Exception as e:
        print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Ping {url} - Error: {e}")
    browser.close()


def main():
    with sync_playwright() as playwright:
        while True:
            ping_url(playwright, PYTHON_API_URL)
            ping_url(playwright, NODE_API_URL)
            time.sleep(60)

if __name__ == "__main__":
    main()
