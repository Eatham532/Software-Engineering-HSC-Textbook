import certifi
import os
import traceback
import requests

def main():
    print('certifi.where():', certifi.where())
    print('REQUESTS_CA_BUNDLE=', os.environ.get('REQUESTS_CA_BUNDLE'))
    print('SSL_CERT_FILE=', os.environ.get('SSL_CERT_FILE'))
    try:
        r = requests.get('https://kroki.io', timeout=10)
        print('kroki status', r.status_code)
    except Exception:
        traceback.print_exc()

if __name__ == '__main__':
    main()
