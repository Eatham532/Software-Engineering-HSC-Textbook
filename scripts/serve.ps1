# Serve the MkDocs site with the project root on PYTHONPATH so local extensions are importable.
# Restart this script after editing python extension files so changes are picked up.

.venv/Scripts/Activate.ps1
$env:PYTHONPATH = (Resolve-Path "..\" ).Path
# If you created a combined CA bundle at C:\cert\combined_ca.pem, use it for this session
# $combined = 'C:\cert\combined_ca.pem'
# if (Test-Path $combined) {
# 	Write-Host "Using combined CA bundle: $combined"
# 	$env:REQUESTS_CA_BUNDLE = $combined
# 	$env:SSL_CERT_FILE = $combined
# } else {
# 	Write-Host "No combined CA bundle found at $combined; using system/OpenSSL defaults"
# }

mkdocs serve

