import time
import requests

PYTHON_API_URL = "https://finease-suggestion-api.onrender.com/"
NODE_API_URL = "https://finease-0dj7.onrender.com/"


def ping_url(url):
    try:
        response = requests.get(url, timeout=15)
        print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Ping {url} - Status: {response.status_code}")
    except Exception as e:
        print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Ping {url} - Error: {e}")


def main():
    while True:
        ping_url(PYTHON_API_URL)
        ping_url(NODE_API_URL)
        time.sleep(60)


if __name__ == "__main__":
    main()
