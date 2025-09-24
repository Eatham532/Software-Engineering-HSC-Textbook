import subprocess
import sys
import os

root = os.path.dirname(os.path.dirname(__file__))
site_index = os.path.join(root, 'site', 'index.html')

print('Running mkdocs build...')
res = subprocess.run([sys.executable, "-m", "mkdocs", "build"], env={**os.environ, 'PYTHONPATH': root}, capture_output=True, text=True)
print(res.stdout)
print(res.stderr, file=sys.stderr)
if res.returncode != 0:
    print('mkdocs build failed', file=sys.stderr)
    sys.exit(2)

if not os.path.exists(site_index):
    print('site/index.html not found', file=sys.stderr)
    sys.exit(3)

with open(site_index, 'r', encoding='utf-8') as f:
    html = f.read()

if "diagram-expand-btn" in html:
    print('SMOKE TEST PASS: diagram-expand-btn found in site/index.html')
    sys.exit(0)
else:
    print('SMOKE TEST FAIL: diagram-expand-btn NOT found in site/index.html', file=sys.stderr)
    sys.exit(1)
