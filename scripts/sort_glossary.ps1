# Sort Glossary Terms Alphabetically
# 
# This script sorts the terms in docs/glossary.toml alphabetically by name.
# Useful for maintaining consistency when multiple contributors add terms.

$ErrorActionPreference = "Stop"

# Get the directory of this script
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir

# Set PYTHONPATH to project root for imports
$env:PYTHONPATH = $ProjectRoot

# Get Python executable from virtual environment
$PythonExe = Join-Path $ProjectRoot ".venv\Scripts\python.exe"

if (-not (Test-Path $PythonExe)) {
    Write-Host "Error: Python virtual environment not found at $PythonExe" -ForegroundColor Red
    Write-Host "Please run 'uv sync' or activate your virtual environment first." -ForegroundColor Yellow
    exit 1
}

# Run the sorting script
Write-Host "Sorting glossary terms..." -ForegroundColor Cyan
& $PythonExe (Join-Path $ScriptDir "sort_glossary.py")

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nGlossary sorted successfully!" -ForegroundColor Green
} else {
    Write-Host "`nSorting failed with exit code $LASTEXITCODE" -ForegroundColor Red
    exit $LASTEXITCODE
}
