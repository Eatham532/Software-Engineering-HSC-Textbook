"""
IndexNow Notification Script for GitHub Actions
Detects changed markdown files and submits corresponding URLs to IndexNow API.

This script is called as the final step in the GitHub Actions deployment workflow.
It only notifies IndexNow about pages that were actually changed in the push,
rather than submitting all pages on every build.

How it works:
1. Receives the base commit SHA from GitHub Actions (via GITHUB_BASE_SHA env var)
2. Compares base SHA with current HEAD to detect ALL .md files changed in the push
3. This captures multiple commits pushed together, not just the last single commit
4. Converts changed markdown file paths to their deployed URLs
5. Submits only those URLs to the IndexNow API
6. Uses the existing API key file from docs/

The script always exits with code 0 to prevent deployment failures if IndexNow
has issues (network problems, API errors, etc.).
"""

import hashlib
import subprocess
import sys
from pathlib import Path
from typing import List, Set
import requests


class IndexNowNotifier:
    """Handles IndexNow API submissions for changed pages only."""
    
    INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow"
    
    def __init__(self, site_url: str, key_location: str = "docs"):
        """
        Initialize the IndexNow notifier.
        
        Args:
            site_url: The base URL of your site
            key_location: Directory where the API key file is stored
        """
        self.site_url = site_url.rstrip('/')
        self.key_location = Path(key_location)
        self.api_key = self._load_api_key()
        
    def _load_api_key(self) -> str:
        """Load the existing API key from file."""
        key_file = self.key_location / f"{hashlib.md5(self.site_url.encode()).hexdigest()}.txt"
        
        if not key_file.exists():
            raise FileNotFoundError(
                f"IndexNow API key file not found: {key_file}\n"
                f"Please ensure the key file exists in {self.key_location}"
            )
        
        return key_file.read_text().strip()
    
    def get_changed_files(self, base_sha: str | None = None) -> Set[str]:
        """
        Get list of changed markdown files from git diff.
        Compares base commit with current HEAD to find all changes in this push.
        
        Args:
            base_sha: The base commit SHA to compare against (from GitHub Actions event)
                     If None, falls back to comparing with previous commit
        
        Returns:
            Set of relative paths to changed .md files
        """
        try:
            if base_sha:
                # Compare with the commit before this push (from GitHub event)
                print(f"[IndexNow] Comparing with base commit: {base_sha}")
                result = subprocess.run(
                    ['git', 'diff', '--name-only', f'{base_sha}...HEAD'],
                    capture_output=True,
                    text=True,
                    check=True
                )
            else:
                # Fallback: compare with previous commit
                print("[IndexNow] No base SHA provided, comparing with HEAD~1")
                result = subprocess.run(
                    ['git', 'diff', '--name-only', 'HEAD~1', 'HEAD'],
                    capture_output=True,
                    text=True,
                    check=True
                )
            
            changed_files = set()
            for line in result.stdout.strip().split('\n'):
                if line and line.endswith('.md') and line.startswith('docs/'):
                    changed_files.add(line)
            
            return changed_files
            
        except subprocess.CalledProcessError as e:
            print(f"[IndexNow] ERROR: Failed to get git diff: {e}")
            print(f"[IndexNow] stderr: {e.stderr}")
            return set()
    
    def markdown_to_url(self, md_path: str) -> str:
        """
        Convert a markdown file path to its deployed URL.
        
        Args:
            md_path: Path to markdown file (e.g., 'docs/Year11/Module/Chapter/Section/index.md')
            
        Returns:
            Full URL to the deployed page
        """
        # Remove 'docs/' prefix and '.md' suffix
        path = md_path.replace('docs/', '', 1).replace('.md', '')
        
        # Convert index files to directory URLs
        if path.endswith('/index'):
            path = path.replace('/index', '')
        
        # Handle root index
        if path == 'index' or path == '':
            return f"{self.site_url}/"
        
        # Return full URL with trailing slash
        return f"{self.site_url}/{path}/"
    
    def submit_urls(self, urls: List[str]) -> bool:
        """
        Submit URLs to IndexNow API.
        
        Args:
            urls: List of URLs to submit
            
        Returns:
            True if submission was successful
        """
        if not urls:
            print("[IndexNow] No URLs to submit")
            return True
        
        # Remove duplicates and sort
        urls = sorted(set(urls))
        
        payload = {
            "host": self.site_url.replace('https://', '').replace('http://', ''),
            "key": self.api_key,
            "keyLocation": f"{self.site_url}/{hashlib.md5(self.site_url.encode()).hexdigest()}.txt",
            "urlList": urls
        }
        
        try:
            print(f"[IndexNow] Submitting {len(urls)} URL(s) to IndexNow API...")
            for url in urls:
                print(f"  - {url}")
            
            response = requests.post(
                self.INDEXNOW_ENDPOINT,
                json=payload,
                headers={"Content-Type": "application/json; charset=utf-8"},
                timeout=30
            )
            
            if response.status_code in (200, 202):
                print(f"[IndexNow] ✅ SUCCESS: Submitted {len(urls)} URL(s)")
                return True
            else:
                print(f"[IndexNow] ⚠️  WARNING: Unexpected response {response.status_code}")
                print(f"[IndexNow] Response: {response.text}")
                return False
                
        except requests.RequestException as e:
            print(f"[IndexNow] ❌ ERROR: Submission failed: {e}")
            return False
    
    def notify_changes(self, base_sha: str | None = None) -> bool:
        """
        Main method: detect changed files and notify IndexNow.
        
        Args:
            base_sha: Optional base commit SHA to compare against (from GitHub Actions)
        
        Returns:
            True if successful (or no changes), False if errors occurred
        """
        print("\n" + "="*60)
        print("[IndexNow] Detecting changed pages...")
        print("="*60)
        
        # Get changed markdown files
        changed_files = self.get_changed_files(base_sha)
        
        if not changed_files:
            print("[IndexNow] No markdown files changed in this push")
            print("[IndexNow] Skipping IndexNow notification")
            return True
        
        print(f"[IndexNow] Found {len(changed_files)} changed markdown file(s):")
        for file in sorted(changed_files):
            print(f"  - {file}")
        
        # Convert to URLs
        urls = [self.markdown_to_url(file) for file in changed_files]
        
        # Submit to IndexNow
        success = self.submit_urls(urls)
        
        print("="*60)
        return success


def main():
    """Main entry point for the script."""
    import os
    
    # Configuration
    SITE_URL = "https://eatham532.github.io/Software-Engineering-HSC-Textbook/"
    KEY_LOCATION = "docs"
    
    # Get base SHA from environment variable (set by GitHub Actions)
    base_sha = os.environ.get('GITHUB_BASE_SHA')
    
    try:
        notifier = IndexNowNotifier(site_url=SITE_URL, key_location=KEY_LOCATION)
        success = notifier.notify_changes(base_sha)
        
        # Exit with appropriate code
        # Note: We don't fail the workflow even if IndexNow fails
        # This prevents deployment issues due to external API problems
        if not success:
            print("\n[IndexNow] ⚠️  IndexNow notification had issues, but continuing...")
            print("[IndexNow] This will not affect your deployment")
        
        sys.exit(0)  # Always exit successfully to not block deployments
        
    except FileNotFoundError as e:
        print(f"\n[IndexNow] ❌ ERROR: {e}")
        print("[IndexNow] ⚠️  Continuing without IndexNow notification")
        sys.exit(0)  # Don't fail deployment
        
    except Exception as e:
        print(f"\n[IndexNow] ❌ UNEXPECTED ERROR: {e}")
        print("[IndexNow] ⚠️  Continuing without IndexNow notification")
        sys.exit(0)  # Don't fail deployment


if __name__ == "__main__":
    main()
