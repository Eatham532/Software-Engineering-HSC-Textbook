"""
IndexNow Notification Script for GitHub Actions
Detects changed and deleted HTML pages and submits corresponding URLs to IndexNow API.

This script is called as the final step in the GitHub Actions deployment workflow.
It only notifies IndexNow about pages that were actually changed or deleted between deployments,
rather than submitting all pages on every build.

How it works:
1. Fetches the gh-pages branch which contains deployment history
2. Compares the last 2 commits on gh-pages directly using git diff
3. Detects changed, added, and deleted HTML files (the actual deployed pages)
4. Converts all affected HTML file paths to their deployed URLs
5. Submits all URLs to the IndexNow API (search engines will verify and handle dead links)
6. Uses the existing API key file from docs/

This approach correctly handles:
- Single commits or multiple commits pushed together
- First deployment (gracefully skips if only 1 gh-pages commit exists)
- Deleted pages (notifies search engines to remove from index)
- Any changes to the built site regardless of source changes

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
    
    def get_changed_files(self) -> tuple[Set[str], Set[str]]:
        """
        Get list of changed and deleted HTML files from gh-pages branch.
        Compares the last two commits on gh-pages branch directly.
        
        Returns:
            Tuple of (changed_files, deleted_files) - both are sets of relative paths to .html files
        """
        try:
            # Fetch gh-pages to get latest deployment info
            print("[IndexNow] Fetching gh-pages branch...")
            subprocess.run(
                ['git', 'fetch', 'origin', 'gh-pages'],
                capture_output=True,
                text=True,
                check=True
            )
            
            # Get last 2 commit SHAs from gh-pages
            result = subprocess.run(
                ['git', 'log', 'origin/gh-pages', '--oneline', '-2', '--format=%H'],
                capture_output=True,
                text=True,
                check=True
            )
            
            commit_shas = result.stdout.strip().split('\n')
            
            if len(commit_shas) < 2:
                print("[IndexNow] Not enough gh-pages commits for comparison")
                print("[IndexNow] This might be the first deployment")
                return set(), set()
            
            current_sha = commit_shas[0]
            previous_sha = commit_shas[1]
            
            print("[IndexNow] Comparing gh-pages commits:")
            print(f"  Previous: {previous_sha[:8]}")
            print(f"  Current:  {current_sha[:8]}")
            
            # Compare the two gh-pages commits with --name-status to detect changes and deletions
            result = subprocess.run(
                ['git', 'diff', '--name-status', f'{previous_sha}...{current_sha}'],
                capture_output=True,
                text=True,
                check=True
            )
            
            changed_files = set()
            deleted_files = set()
            
            for line in result.stdout.strip().split('\n'):
                if not line:
                    continue
                    
                parts = line.split('\t', 1)
                if len(parts) != 2:
                    continue
                    
                status, filepath = parts
                
                # Only process HTML files (skip assets, CSS, JS, etc.)
                if not filepath.endswith('.html'):
                    continue
                
                # Skip search index and other non-content HTML
                if any(skip in filepath for skip in ['search/', '404.html', 'sitemap.xml']):
                    continue
                
                # D = deleted, A = added, M = modified, R = renamed
                if status.startswith('D'):
                    deleted_files.add(filepath)
                elif status.startswith(('A', 'M', 'R')):
                    changed_files.add(filepath)
            
            return changed_files, deleted_files
            
        except subprocess.CalledProcessError as e:
            print(f"[IndexNow] ERROR: Failed to get git diff: {e}")
            print(f"[IndexNow] stderr: {e.stderr}")
            return set(), set()
    
    def html_to_url(self, html_path: str) -> str:
        """
        Convert an HTML file path from gh-pages to its deployed URL.
        
        Args:
            html_path: Path to HTML file in gh-pages (e.g., 'Year11/Module/Chapter/Section/index.html')
            
        Returns:
            Full URL to the deployed page
        """
        # Remove '.html' suffix
        path = html_path.replace('.html', '')
        
        # Convert index files to directory URLs
        if path.endswith('/index'):
            path = path.replace('/index', '')
        
        # Handle root index
        if path == 'index' or path == '':
            return f"{self.site_url}/"
        
        # Return full URL with trailing slash
        return f"{self.site_url}/{path}/"
    
    def submit_urls(self, urls: List[str], dry_run: bool = False) -> bool:
        """
        Submit URLs to IndexNow API.
        
        Args:
            urls: List of URLs to submit
            dry_run: If True, only print what would be submitted without actually sending
            
        Returns:
            True if submission was successful
        """
        if not urls:
            print("[IndexNow] No URLs to submit")
            return True
        
        # Remove duplicates and sort
        urls = sorted(set(urls))
        
        if dry_run:
            print(f"[IndexNow] 🧪 DRY RUN MODE - Would submit {len(urls)} URL(s):")
            for url in urls:
                print(f"  - {url}")
            print("[IndexNow] 🧪 DRY RUN - Skipping actual API submission")
            return True
        
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
    
    def notify_changes(self, dry_run: bool = False) -> bool:
        """
        Main method: detect changed files and notify IndexNow.
        
        Args:
            dry_run: If True, only show what would be submitted without actually sending
        
        Returns:
            True if successful (or no changes), False if errors occurred
        """
        print("\n" + "="*60)
        print("[IndexNow] Detecting changed and deleted pages...")
        if dry_run:
            print("[IndexNow] 🧪 DRY RUN MODE - No actual API calls will be made")
        print("="*60)
        
        # Get changed and deleted HTML files by comparing last 2 gh-pages commits
        changed_files, deleted_files = self.get_changed_files()
        
        if not changed_files and not deleted_files:
            print("[IndexNow] No HTML pages changed or deleted in this deployment")
            print("[IndexNow] Skipping IndexNow notification")
            return True
        
        # Report changes
        if changed_files:
            print(f"[IndexNow] Found {len(changed_files)} changed/added HTML page(s):")
            for file in sorted(changed_files):
                print(f"  ✏️  {file}")
        
        if deleted_files:
            print(f"[IndexNow] Found {len(deleted_files)} deleted HTML page(s):")
            for file in sorted(deleted_files):
                print(f"  🗑️  {file}")
        
        # Convert to URLs (both changed and deleted files need to be reported)
        all_urls = []
        
        if changed_files:
            all_urls.extend([self.html_to_url(file) for file in changed_files])
        
        if deleted_files:
            all_urls.extend([self.html_to_url(file) for file in deleted_files])
        
        # Submit to IndexNow (search engines will check and remove dead links)
        success = self.submit_urls(all_urls, dry_run=dry_run)
        
        print("="*60)
        return success


def main():
    """Main entry point for the script."""
    import os
    
    # Configuration
    SITE_URL = "https://eatham532.github.io/Software-Engineering-HSC-Textbook/"
    KEY_LOCATION = "docs"
    
    # Check for dry-run mode (for testing)
    dry_run = os.environ.get('INDEXNOW_DRY_RUN', '').lower() in ('true', '1', 'yes')
    
    try:
        notifier = IndexNowNotifier(site_url=SITE_URL, key_location=KEY_LOCATION)
        success = notifier.notify_changes(dry_run=dry_run)
        
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
