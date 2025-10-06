"""
IndexNow Hook for MkDocs
Automatically submits URLs to IndexNow API when the site is built.
"""

import hashlib
import secrets
from pathlib import Path
from typing import List
import requests


class IndexNowSubmitter:
    """Handles IndexNow API submissions for search engine indexing."""
    
    # IndexNow API endpoint (can be Bing, Yandex, etc.)
    INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow"
    
    def __init__(self, site_url: str, key_location: str = "docs"):
        """
        Initialize the IndexNow submitter.
        
        Args:
            site_url: The base URL of your site
            key_location: Directory where the API key file should be stored
        """
        self.site_url = site_url.rstrip('/')
        self.key_location = Path(key_location)
        self.api_key = self._get_or_create_key()
        
    def _get_or_create_key(self) -> str:
        """Get existing API key or create a new one."""
        key_file = self.key_location / f"{hashlib.md5(self.site_url.encode()).hexdigest()}.txt"
        
        if key_file.exists():
            return key_file.read_text().strip()
        
        # Generate a new API key (hex string)
        api_key = secrets.token_hex(16)
        
        # Create the key file
        key_file.parent.mkdir(parents=True, exist_ok=True)
        key_file.write_text(api_key)
        
        print(f"[IndexNow] API key created: {key_file}")
        print(f"[IndexNow] Place this file in your site root: {key_file.name}")
        
        return api_key
    
    def submit_urls(self, urls: List[str], batch_size: int = 10000) -> bool:
        """
        Submit URLs to IndexNow API.
        
        Args:
            urls: List of URLs to submit
            batch_size: Maximum URLs per request (IndexNow limit is 10,000)
            
        Returns:
            True if submission was successful
        """
        if not urls:
            print("[IndexNow] WARNING: No URLs to submit to IndexNow")
            return False
        
        # Filter to only include URLs from this site
        urls = [url for url in urls if url.startswith(self.site_url)]
        
        if not urls:
            print("[IndexNow] WARNING: No valid URLs to submit to IndexNow")
            return False
        
        # Submit in batches
        success = True
        for i in range(0, len(urls), batch_size):
            batch = urls[i:i + batch_size]
            success = success and self._submit_batch(batch)
        
        return success
    
    def _submit_batch(self, urls: List[str]) -> bool:
        """Submit a batch of URLs to IndexNow."""
        payload = {
            "host": self.site_url.replace('https://', '').replace('http://', ''),
            "key": self.api_key,
            "keyLocation": f"{self.site_url}/{hashlib.md5(self.site_url.encode()).hexdigest()}.txt",
            "urlList": urls
        }
        
        try:
            response = requests.post(
                self.INDEXNOW_ENDPOINT,
                json=payload,
                headers={"Content-Type": "application/json; charset=utf-8"},
                timeout=30
            )
            
            if response.status_code == 200:
                print(f"[IndexNow] SUCCESS: Submitted {len(urls)} URL(s)")
                return True
            elif response.status_code == 202:
                print(f"[IndexNow] SUCCESS: {len(urls)} URL(s) accepted for processing")
                return True
            else:
                print(f"[IndexNow] WARNING: Unexpected response {response.status_code}")
                print(f"[IndexNow] Response: {response.text}")
                return False
                
        except requests.RequestException as e:
            print(f"[IndexNow] ERROR: Submission failed: {e}")
            return False


def on_post_build(config, **kwargs):
    """
    MkDocs hook that runs after the site is built.
    Collects all URLs and submits them to IndexNow.
    """
    # Check if IndexNow is enabled
    indexnow_config = config.get('extra', {}).get('indexnow', {})
    
    if not indexnow_config.get('enabled', False):
        return
    
    site_url = config.get('site_url')
    if not site_url:
        print("[IndexNow] WARNING: No site_url configured in mkdocs.yml")
        return
    
    # Initialize submitter
    submitter = IndexNowSubmitter(
        site_url=site_url,
        key_location=config.get('docs_dir', 'docs')
    )
    
    # Collect all URLs from the built site
    site_dir = Path(config.get('site_dir', 'site'))
    urls = []
    
    # Normalize site_url to not end with slash
    base_url = site_url.rstrip('/')
    
    for html_file in site_dir.rglob('*.html'):
        # Convert file path to URL
        relative_path = html_file.relative_to(site_dir)
        
        # Convert index.html to directory URLs
        if relative_path.name == 'index.html':
            if relative_path.parent == Path('.'):
                url = base_url + '/'
            else:
                url = f"{base_url}/{relative_path.parent}/"
        else:
            # Regular HTML files
            url = f"{base_url}/{relative_path.with_suffix('')}/"
        
        urls.append(url)
    
    # Submit to IndexNow
    if urls:
        print(f"\n[IndexNow] Submitting {len(urls)} URLs to IndexNow API...")
        submitter.submit_urls(urls)
    else:
        print("[IndexNow] WARNING: No HTML files found to submit")


def on_config(config, **kwargs):
    """
    MkDocs hook that runs when config is loaded.
    Ensures the API key file exists.
    """
    indexnow_config = config.get('extra', {}).get('indexnow', {})
    
    if not indexnow_config.get('enabled', False):
        return config
    
    site_url = config.get('site_url')
    if site_url:
        # Initialize to ensure API key exists
        _ = IndexNowSubmitter(
            site_url=site_url,
            key_location=config.get('docs_dir', 'docs')
        )
        print(f"[IndexNow] Configured for: {site_url}")
    
    return config
