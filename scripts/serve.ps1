# Serve the MkDocs site with local extensions installed as editable package.
# Restart this script after editing python extension files so changes are picked up.

.venv/Scripts/Activate.ps1
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path

# Comment out heavy plugins and extra section in mkdocs.yml to speed up development builds
$mkdocsPath = Join-Path $repoRoot "mkdocs.yml"
$lines = Get-Content $mkdocsPath

$result = @()
$inKrokiBlock = $false

for ($i = 0; $i -lt $lines.Count; $i++) {
    $line = $lines[$i]
    
    # Check if we're starting the kroki block (and it's not already commented)
    if ($line -match '^\s*- kroki:\s*$' -and $line -notmatch '^\s*#') {
        $result += "  # - kroki:"
        $inKrokiBlock = $true
        continue
    }
    
    # If in kroki block, comment nested config lines (4+ spaces indentation)
    if ($inKrokiBlock) {
        # Check if still in kroki block (indented with 4+ spaces or comment)
        if ($line -match '^\s{4,}\S' -or ($line -match '^\s*#' -and $line -match '^\s{4,}')) {
            if ($line -notmatch '^\s*#') {
                $result += "  #$line"
            } else {
                $result += $line
            }
            continue
        } else {
            # Exited kroki block
            $inKrokiBlock = $false
        }
    }
    
    # Comment out git-revision-date-localized if not already commented
    if ($line -match '^\s*- git-revision-date-localized\s*$' -and $line -notmatch '^\s*#') {
        $result += "  # - git-revision-date-localized"
        continue
    }
    
    # Keep all other lines unchanged
    $result += $line
}

# Now handle the extra section
$finalResult = @()
$inExtraSection = $false

foreach ($line in $result) {
    # Detect start of extra section (commented or uncommented)
    if ($line -match '^\s*#?\s*extra:\s*$') {
        $inExtraSection = $true
        # Ensure it's commented
        if ($line -notmatch '^\s*#') {
            $finalResult += "# extra:"
        } else {
            $finalResult += $line
        }
        continue
    }
    
    # If in extra section, comment all non-empty indented lines
    if ($inExtraSection) {
        # Check if we've exited (hit a top-level key that's not indented and not a comment)
        if ($line -match '^\S' -and $line -notmatch '^\s*#' -and $line.Trim() -ne '') {
            $inExtraSection = $false
            $finalResult += $line
            continue
        }
        
        # Keep empty lines as-is
        if ($line.Trim() -eq '') {
            $finalResult += $line
            continue
        }
        
        # Comment indented lines if not already commented
        if ($line -match '^\s+\S' -and $line -notmatch '^\s*#') {
            $finalResult += "#$line"
        } else {
            $finalResult += $line
        }
    } else {
        $finalResult += $line
    }
}

$finalResult | Set-Content $mkdocsPath
Write-Host "Ensured git-revision-date-localized, kroki, and extras section are commented out in mkdocs.yml"

mkdocs serve

