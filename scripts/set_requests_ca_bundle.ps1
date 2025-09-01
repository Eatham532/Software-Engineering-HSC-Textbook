<#
Set the REQUESTS_CA_BUNDLE and SSL_CERT_FILE environment variables for the current PowerShell session.
Usage: .\scripts\set_requests_ca_bundle.ps1 -Path 'C:\certs\company_root_ca.pem'
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$Path
)

if (-Not (Test-Path $Path)) {
    Write-Error "Certificate file not found: $Path"
    exit 1
}

$env:REQUESTS_CA_BUNDLE = $Path
$env:SSL_CERT_FILE = $Path

Write-Host "Set REQUESTS_CA_BUNDLE and SSL_CERT_FILE to: $Path (current session only)"
Write-Host "Run 'mkdocs serve' in this session to pick up the env vars."
