# Serve the MkDocs site with the project root on PYTHONPATH so local extensions are importable.
# Restart this script after editing python extension files so changes are picked up.

.venv/Scripts/Activate.ps1
# Ensure PYTHONPATH points to repo root regardless of current directory
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$env:PYTHONPATH = $repoRoot
Write-Host "PYTHONPATH set to: $env:PYTHONPATH"
mkdocs serve

