# IndexNow Migration Summary

## What Changed

IndexNow has been migrated from a **MkDocs build hook** to a **separate GitHub Actions job** that runs after deployment.

## Why This Is Better

### Before (Build Hook Approach)

- ❌ Ran on **every** build (including local development)

- ❌ Submitted **all pages** every time, even if unchanged

- ❌ Could block or slow down builds if IndexNow API had issues

- ❌ Ran multiple times for multiple commits in one push

### After (GitHub Actions Job Approach)

- ✅ Only runs on **successful deployments**

- ✅ Only submits **changed pages** by comparing git commits

- ✅ Handles **multiple commits** in a single push correctly

- ✅ Never blocks deployment if IndexNow has issues

- ✅ Runs as separate job for better visibility and isolation

- ✅ No impact on local development

## Technical Details

### How It Works

1. **Deployment completes** successfully on GitHub Pages

2. **Separate job starts** (`notify-indexnow`)

3. **Fetches gh-pages branch** to get deployment history

4. **Extracts source SHAs** from last 2 gh-pages commits (format: "Deployed abc123 with MkDocs...")

5. **Git comparison**: Compares those two source commits on main branch

6. **Detects changes**: Finds all `.md` files in `docs/` that changed

7. **URL conversion**: Maps markdown files to deployed URLs

8. **API submission**: Sends only changed URLs to IndexNow

### Example Scenarios

#### Single Commit Push

```
Before: abc123
After:  def456
Changed: docs/Year11/Module/index.md
Result:  Submits https://site.com/Year11/Module/

```

#### Multiple Commits Push

```
Before: abc123
After:  ghi789
Commits: def456, ghi789
Changed: docs/Year11/Module/index.md, docs/Year12/Module/index.md
Result:  Submits both URLs

```

#### No Markdown Changes

```
Before: abc123
After:  def456
Changed: scripts/fix_something.py
Result:  No IndexNow submission (no markdown files changed)

```

## Files Changed

### New Files

- `scripts/indexnow_notify.py` - Standalone script for IndexNow notifications

### Modified Files

- `.github/workflows/deploy.yml` - Added separate `notify-indexnow` job

- `mkdocs.yml` - Disabled IndexNow hook (commented out)

- `pyproject.toml` - Removed `indexnow_hook` from py-modules

### Deprecated (Not Deleted)

- `indexnow_hook.py` - Old hook implementation (kept for reference)

- API key file in `docs/` - Still used by new script

## Rollback Instructions

If you need to rollback to the old approach:

1. Uncomment in `mkdocs.yml`:

   ```yaml
   hooks:
     - indexnow_hook.py

   ```

2. Add back to `pyproject.toml`:

   ```toml
   py-modules = ["kroki_wrapper", "indexnow_hook"]

   ```

3. Remove from `.github/workflows/deploy.yml`:

   ```yaml
   # Delete the entire notify-indexnow job

   ```

## Environment Variables

The GitHub Actions job uses:

- `GITHUB_BASE_SHA` - Set to `${{ github.event.before }}` (SHA before the push)

- Used by script to determine which commit to compare against

## Error Handling

The script is designed to **never fail the deployment**:

- Always exits with code 0

- Uses `continue-on-error: true` in workflow

- Logs warnings instead of throwing errors

- Gracefully handles missing API key files

- Handles network/API errors without crashing

## Testing

To test locally (simulates what GitHub Actions does):

```powershell
# Set environment variable
$env:GITHUB_BASE_SHA = "HEAD~3"  # Compare with 3 commits ago

# Run the script
python scripts/indexnow_notify.py

```

## Monitoring

In GitHub Actions:

1. Go to **Actions** tab

2. Click on latest workflow run

3. Look for **🔔 Notify Search Engines** job

4. Check logs for submitted URLs

The job shows:

- Which files changed

- Which URLs were submitted

- Success/failure status

- Any errors (without failing the workflow)
