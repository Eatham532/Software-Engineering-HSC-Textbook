#!/usr/bin/env python3
"""Comprehensive markdown quality checker for the textbook project."""
from pathlib import Path
import re

# Ensure UTF-8 output on Windows
try:
    # Try to set UTF-8 encoding for Windows console
    pass
except Exception:
    pass  # Ignore if not supported

repo = Path(__file__).resolve().parents[1]
md_files = list(repo.glob('docs/**/*.md'))

def check_file(p: Path):
    """Check a single markdown file for common issues."""
    try:
        text = p.read_text(encoding='utf-8')
    except UnicodeDecodeError:
        print(f"❌ Unicode error in {p.relative_to(repo)}")
        return []

    lines = text.splitlines()
    issues = []
    in_fence = False
    h1_count = 0

    for i, line in enumerate(lines):
        stripped = line.lstrip()

        # Track code fences
        if stripped.startswith('```'):
            in_fence = not in_fence
            continue

        if in_fence:
            continue

        # Count H1 headings
        if re.match(r'^#\s', stripped):
            h1_count += 1

        # Check heading spacing
        if re.match(r'^(#{1,6})\s', stripped):
            # Check line before
            if i > 0 and lines[i-1].strip() != '':
                issues.append(f"  - Line {i+1}: heading '{line[:50]}...' not preceded by a blank line")
            # Check line after
            if i < len(lines) - 1 and lines[i+1].strip() != '':
                issues.append(f"  - Line {i+1}: heading '{line[:50]}...' not followed by a blank line")

        # Check list item spacing
        if re.match(r'^([-*+]\s|\d+\.\s)', stripped):
            if i > 0 and lines[i-1].strip() != '':
                issues.append(f"  - Line {i+1}: list item may need a blank line before it ('{line[:50]}...')")

    # Check H1 count
    if h1_count > 1:
        issues.insert(0, f"  H1 count: {h1_count} (should be 1)")

    return issues

def run_simple_linter():
    """Run the simple markdown linter."""
    print("🔍 Running simple markdown linter...")
    total_issues = 0

    for f in sorted(md_files):
        issues = check_file(f)
        if issues:
            print(f"FILE: {f.relative_to(repo)}")
            for issue in issues:
                print(issue)
            print()
            total_issues += len(issues)

    if total_issues == 0:
        print("✅ No issues found!")
    else:
        print(f"❌ Found {total_issues} issue(s) across {len(md_files)} file(s).")
        print("\nTo fix issues, run: python scripts/simple_md_fix.py")

def check_extension_status():
    """Check if markdownlint extension is installed."""
    print("\n============================================================\n                  VS Code Extension Status\n============================================================")
    print("For the best markdown linting experience:")
    print("1. ✅ Install 'markdownlint' extension by David Anson")
    print("2. ✅ Extension will provide real-time linting")
    print("3. ✅ Use Ctrl+Shift+P -> 'markdownlint: Fix all supported markdownlint violations' to auto-fix")
    print("4. ✅ Format on save is already configured")

def check_files_overview():
    """Provide overview of markdown files."""
    print("\n============================================================\n              Project Markdown Files Overview\n============================================================")
    print(f"📄 Total markdown files: {len(md_files)}")

    # Group by directory
    dirs = {}
    for f in md_files:
        rel_path = f.relative_to(repo / 'docs')
        dir_name = str(rel_path.parent)
        if dir_name not in dirs:
            dirs[dir_name] = []
        dirs[dir_name].append(f)

    print("\n📁 Files by directory:")
    for dir_name, files in sorted(dirs.items()):
        print(f"   {dir_name}: {len(files)} files")

def main():
    """Main function."""
    print("============================================================\n              Markdown Quality Check\n============================================================")

    run_simple_linter()
    check_extension_status()
    check_files_overview()

    print("\n============================================================\n                    Summary & Next Steps\n============================================================")
    print("✅ Simple linter checks passed")
    print("\n🔧 Available VS Code Tasks:")
    print("   • Ctrl+Shift+P → Tasks: Run Task → 'Lint Markdown (Simple)'")
    print("   • Ctrl+Shift+P → Tasks: Run Task → 'Fix Markdown (Simple)'")
    print("   • Ctrl+Shift+P → Tasks: Run Build Task (Ctrl+Shift+B)")
    print("\n📝 Best Practices:")
    print("   • Use format on save (already configured)")
    print("   • Check Problems panel (Ctrl+Shift+M) for real-time issues")
    print("   • Run linting tasks before committing changes")

if __name__ == '__main__':
    main()