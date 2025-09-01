"""Simple, dependency-free markdown checks:
- multiple H1 headings
- headings not surrounded by blank lines
- lists not preceded by a blank line

Writes a short report to stdout.
"""
import sys
from pathlib import Path

def check_file(p: Path):
    lines = p.read_text(encoding='utf-8').splitlines()
    h1_count = 0
    issues = []
    for i, line in enumerate(lines):
        stripped = line.lstrip()
        # H1 count
        if stripped.startswith('# '):
            h1_count += 1
        # heading spacing (requires blank line above and below)
        if stripped.startswith('#'):
            above_empty = (i == 0) or (lines[i-1].strip() == '')
            below_empty = (i == len(lines)-1) or (lines[i+1].strip() == '')
            if not above_empty:
                issues.append(f"Line {i+1}: heading '{stripped[:60]}' not preceded by a blank line")
            if not below_empty:
                issues.append(f"Line {i+1}: heading '{stripped[:60]}' not followed by a blank line")
        # list spacing: detect list item starts
        if stripped.startswith(('- ', '* ', '+ ')) or (stripped[:2].isdigit() and stripped[2:4] == '. '):
            above_empty = (i == 0) or (lines[i-1].strip() == '')
            if not above_empty:
                issues.append(f"Line {i+1}: list item may need a blank line before it ('{stripped[:60]}')")
    return h1_count, issues


def main():
    repo = Path(__file__).resolve().parents[1]
    md_files = list(repo.glob('**/*.md'))
    if not md_files:
        print('No markdown files found.')
        return 0
    total_errors = 0
    for f in sorted(md_files):
        h1_count, issues = check_file(f)
        if h1_count > 1 or issues:
            print(f"\nFILE: {f.relative_to(repo)}")
            if h1_count > 1:
                print(f"  H1 count: {h1_count} (should be 1)")
            for it in issues:
                print(f"  - {it}")
            total_errors += len(issues) + (1 if h1_count>1 else 0)
    if total_errors == 0:
        print('No common issues found by simple linter.')
    else:
        print(f'Found {total_errors} issue(s) across files.')
    return 0

if __name__ == '__main__':
    sys.exit(main())
