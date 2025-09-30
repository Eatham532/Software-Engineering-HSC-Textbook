#!/usr/bin/env python3
"""
Script to fix duplicate headings in files.
Removes duplicate top-level headings and keeps only the first one.
"""

import glob
from pathlib import Path

def fix_duplicate_headings_in_file(file_path):
    """Fix duplicate headings in a single file"""
    print(f"Checking: {file_path}")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"  Error reading file: {e}")
        return False
    
    lines = content.split('\n')
    
    # Find all top-level headings (lines starting with #)
    heading_indices = []
    for i, line in enumerate(lines):
        if line.strip().startswith('# '):
            heading_indices.append(i)
    
    if len(heading_indices) <= 1:
        print("  No duplicate headings found")
        return False
    
    print(f"  Found {len(heading_indices)} top-level headings:")
    for i in heading_indices:
        print(f"    Line {i+1}: {lines[i]}")
    
    # Keep only the first heading, remove the rest
    new_lines = []
    kept_first = False
    
    for i, line in enumerate(lines):
        if i in heading_indices:
            if not kept_first:
                new_lines.append(line)
                kept_first = True
                print(f"  Keeping: {line}")
            else:
                print(f"  Removing: {line}")
                # Skip this heading line
                continue
        else:
            new_lines.append(line)
    
    # Write the fixed content back
    new_content = '\n'.join(new_lines)
    
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("  Fixed duplicate headings")
        return True
    except Exception as e:
        print(f"  Error writing file: {e}")
        return False

def main():
    """Main function to fix duplicate headings in all markdown files"""
    script_dir = Path(__file__).parent
    root_path = script_dir.parent
    
    # Find all markdown files
    patterns = [
        str(root_path / "docs" / "**" / "*.md"),
    ]
    
    all_files = []
    for pattern in patterns:
        all_files.extend(glob.glob(pattern, recursive=True))
    
    print(f"Found {len(all_files)} markdown files to check")
    print()
    
    fixed_count = 0
    for file_path in all_files:
        try:
            if fix_duplicate_headings_in_file(file_path):
                fixed_count += 1
                print()
        except Exception as e:
            print(f"Error processing {file_path}: {e}")
            print()
    
    print("=== Summary ===")
    print(f"Fixed duplicate headings in {fixed_count} files")
    print(f"Checked {len(all_files)} files total")

if __name__ == "__main__":
    main()