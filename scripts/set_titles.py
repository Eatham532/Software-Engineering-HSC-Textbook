#!/usr/bin/env python3
"""
Title Setter for Markdown Files

Sets the title frontmatter of all .md files in docs/ to match the first header.
If no frontmatter exists, it will be added. If title already exists, it will be updated.

Usage: python scripts/set_titles.py
"""

import re
from pathlib import Path
from typing import Optional


def extract_first_header(content: str) -> Optional[str]:
    """
    Extract the text of the first header (H1) from markdown content.

    Returns the header text without the # prefix, or None if no header found.
    """
    lines = content.split('\n')

    for line in lines:
        line = line.strip()
        # Look for H1 headers: # Header text
        if line.startswith('# ') and len(line) > 2:
            # Remove the # and any trailing whitespace
            header_text = line[2:].strip()
            return header_text

    return None


def has_frontmatter(content: str) -> bool:
    """
    Check if the file already has YAML frontmatter.
    """
    lines = content.split('\n')
    if len(lines) >= 2:
        return lines[0].strip() == '---' and '---' in lines[1:]
    return False


def extract_frontmatter(content: str) -> tuple[str, str]:
    """
    Extract frontmatter and body from content.

    Returns (frontmatter, body) where frontmatter includes the --- delimiters.
    If no frontmatter exists, returns ('', content)
    """
    if not has_frontmatter(content):
        return '', content

    lines = content.split('\n')
    frontmatter_end = -1

    # Find the closing ---
    for i, line in enumerate(lines[1:], 1):
        if line.strip() == '---':
            frontmatter_end = i
            break

    if frontmatter_end == -1:
        # Malformed frontmatter, treat as no frontmatter
        return '', content

    frontmatter = '\n'.join(lines[:frontmatter_end + 1]) + '\n'
    body = '\n'.join(lines[frontmatter_end + 1:])

    return frontmatter, body


def update_frontmatter_title(frontmatter: str, title: str) -> str:
    """
    Update or add title in frontmatter.
    """
    if not frontmatter:
        # Create new frontmatter
        return f'---\ntitle: "{title}"\n---\n\n'

    # Check if title already exists
    title_pattern = re.compile(r'^title:\s*(.+)$', re.MULTILINE)
    match = title_pattern.search(frontmatter)

    if match:
        # Replace existing title
        old_title_line = match.group(0)
        new_title_line = f'title: "{title}"'
        return frontmatter.replace(old_title_line, new_title_line)
    else:
        # Add title before closing ---
        # Find the last line before closing ---
        lines = frontmatter.rstrip().split('\n')
        if lines and lines[-1] == '---':
            # Insert title before the closing ---
            lines.insert(-1, f'title: "{title}"')
            return '\n'.join(lines) + '\n'
        else:
            # Malformed, just append
            return frontmatter.rstrip() + f'\ntitle: "{title}"\n---\n\n'

    return frontmatter


def process_file(file_path: Path) -> bool:
    """
    Process a single markdown file.

    Returns True if changes were made, False otherwise.
    """
    print(f"Processing {file_path}")

    try:
        content = file_path.read_text(encoding='utf-8')
    except Exception as e:
        print(f"  Error reading file: {e}")
        return False

    # Extract first header
    header_text = extract_first_header(content)
    if not header_text:
        print("  No H1 header found, skipping")
        return False

    print(f"  Found header: {header_text}")

    # Extract frontmatter and body
    frontmatter, body = extract_frontmatter(content)

    # Update frontmatter with title
    updated_frontmatter = update_frontmatter_title(frontmatter, header_text)

    # Combine updated frontmatter with body
    updated_content = updated_frontmatter + body

    # Only write if content changed
    if updated_content != content:
        try:
            file_path.write_text(updated_content, encoding='utf-8')
            print("  ✅ Updated title in frontmatter")
            return True
        except Exception as e:
            print(f"  ❌ Error writing file: {e}")
            return False
    else:
        print("  No changes needed")
        return False


def main():
    """Main entry point."""
    # Find script directory and go up to repo root
    script_dir = Path(__file__).parent
    repo_root = script_dir.parent
    docs_dir = repo_root / "docs"

    if not docs_dir.exists():
        print(f"Error: docs directory not found at {docs_dir}")
        return 1

    # Find all .md files in docs/
    md_files = list(docs_dir.rglob("*.md"))

    if not md_files:
        print("No .md files found in docs/")
        return 0

    print(f"Found {len(md_files)} .md files to process")
    print()

    total_changes = 0

    for file_path in sorted(md_files):
        if process_file(file_path):
            total_changes += 1
        print()

    print(f"🎉 Processing complete! Updated titles in {total_changes} files")

    return 0


if __name__ == "__main__":
    exit(main())