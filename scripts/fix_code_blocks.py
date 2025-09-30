#!/usr/bin/env python3
"""
Fix markdown code block issues throughout the documentation.
This script addresses MD046 violations and other code block formatting problems.
"""

import os
import re
from pathlib import Path

def fix_code_blocks(content):
    """Fix various code block formatting issues"""
    
    # Fix 1: ``python -> ```python (malformed fence starts)
    content = re.sub(r'^``([a-zA-Z]+)$', r'```\1', content, flags=re.MULTILINE)
    
    # Fix 2: ```text -> ``` (close fence after ```text blocks)
    # Look for ```text followed by content, then fix missing closing fence
    content = re.sub(r'^```text\s*$\n(.*?)^```text\s*$', r'```\n\1```', content, flags=re.MULTILINE | re.DOTALL)
    
    # Fix 3: Ensure code blocks are properly closed
    # Find opening ``` that don't have matching closing ```
    lines = content.split('\n')
    fixed_lines = []
    in_code_block = False
    code_block_lang = None
    
    for i, line in enumerate(lines):
        # Check for code block start
        if line.strip().startswith('```'):
            if not in_code_block:
                # Starting a code block
                in_code_block = True
                code_block_lang = line.strip()[3:].strip() if len(line.strip()) > 3 else ''
                fixed_lines.append(line)
            else:
                # Ending a code block
                in_code_block = False
                code_block_lang = None
                fixed_lines.append('```')  # Ensure clean closing
        else:
            fixed_lines.append(line)
    
    # If we ended with an open code block, close it
    if in_code_block:
        fixed_lines.append('```')
    
    content = '\n'.join(fixed_lines)
    
    # Fix 4: Remove duplicate consecutive code fences
    content = re.sub(r'^```\s*\n```\s*$', '```', content, flags=re.MULTILINE)
    
    # Fix 5: Fix ```text at end of files (should just be ```)
    content = re.sub(r'^```text\s*$(?=\s*$)', '```', content, flags=re.MULTILINE)
    
    return content

def fix_markdown_file(file_path):
    """Fix a single markdown file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            original_content = f.read()
        
        fixed_content = fix_code_blocks(original_content)
        
        # Only write if content changed
        if fixed_content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(fixed_content)
            return True
        
        return False
    
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def find_markdown_files(root_dir):
    """Find all markdown files in the directory tree"""
    markdown_files = []
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith('.md'):
                markdown_files.append(os.path.join(root, file))
    return markdown_files

def main():
    """Main function to fix code blocks across all markdown files"""
    
    # Start from docs directory
    docs_dir = Path("docs")
    if not docs_dir.exists():
        print("Error: docs directory not found")
        return
    
    print("=== Fixing Code Block Issues ===")
    print(f"Scanning directory: {docs_dir.absolute()}")
    
    # Find all markdown files
    markdown_files = find_markdown_files(docs_dir)
    print(f"Found {len(markdown_files)} markdown files")
    
    # Process each file
    fixed_count = 0
    for file_path in markdown_files:
        if fix_markdown_file(file_path):
            print(f"Fixed: {file_path}")
            fixed_count += 1
    
    print(f"\n=== Summary ===")
    print(f"Total files scanned: {len(markdown_files)}")
    print(f"Files fixed: {fixed_count}")
    print(f"Files unchanged: {len(markdown_files) - fixed_count}")
    
    if fixed_count > 0:
        print("\nCode block issues have been fixed!")
        print("You may want to run a markdown linter to verify the fixes.")
    else:
        print("\nNo code block issues found.")

if __name__ == "__main__":
    # Change to the project root directory
    script_dir = Path(__file__).parent.parent
    os.chdir(script_dir)
    print(f"Working directory: {os.getcwd()}")
    
    main()