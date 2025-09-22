#!/usr/bin/env python3

import re
import sys
from pathlib import Path

def convert_file(file_path):
    """Convert tabbed sections in a single file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all tabbed sections and convert them
    lines = content.split('\n')
    result_lines = []
    i = 0
    
    while i < len(lines):
        line = lines[i]
        
        # Check for === "Title" pattern
        match = re.match(r'^(\s*)===\s*"([^"]+)"\s*$', line)
        if match:
            # Found start of tabbed section
            base_indent = len(match.group(1))
            tabs = []
            
            # Collect all consecutive tabs
            while i < len(lines):
                current_line = lines[i]
                tab_match = re.match(r'^(\s*)===\s*"([^"]+)"\s*$', current_line)
                
                if tab_match:
                    title = tab_match.group(2)
                    content_lines = []
                    i += 1
                    
                    # Collect content until next tab or end of section
                    while i < len(lines):
                        next_line = lines[i]
                        
                        # Check if this is another tab
                        if re.match(r'^(\s*)===\s*"([^"]+)"\s*$', next_line):
                            break
                        
                        # Check if we've left the tabbed section
                        if next_line.strip() and len(next_line) - len(next_line.lstrip()) <= base_indent:
                            break
                            
                        content_lines.append(next_line)
                        i += 1
                    
                    # Process content to remove indentation
                    if content_lines:
                        # Find minimum indentation
                        min_indent = float('inf')
                        for content_line in content_lines:
                            if content_line.strip():
                                indent = len(content_line) - len(content_line.lstrip())
                                min_indent = min(min_indent, indent)
                        
                        if min_indent == float('inf'):
                            min_indent = 0
                        
                        # Remove common indentation
                        processed_lines = []
                        for content_line in content_lines:
                            if content_line.strip():
                                if len(content_line) >= min_indent:
                                    processed_lines.append(content_line[min_indent:])
                                else:
                                    processed_lines.append(content_line)
                            else:
                                processed_lines.append('')
                        
                        # Remove trailing empty lines
                        while processed_lines and not processed_lines[-1].strip():
                            processed_lines.pop()
                        
                        tabs.append((title, '\n'.join(processed_lines)))
                    else:
                        tabs.append((title, ''))
                else:
                    break
            
            # Convert to /// tab format
            for title, tab_content in tabs:
                result_lines.append(f'/// tab | {title}')
                if tab_content:
                    result_lines.append(tab_content)
                result_lines.append('///')
                result_lines.append('')
            
            # Remove last empty line
            if result_lines and result_lines[-1] == '':
                result_lines.pop()
        else:
            result_lines.append(line)
            i += 1
    
    new_content = '\n'.join(result_lines)
    
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated: {file_path}")
        return True
    else:
        print(f"No changes: {file_path}")
        return False

# Process all markdown files in docs directory or single file if specified
if len(sys.argv) > 1:
    file_path = Path(sys.argv[1])
    if file_path.exists():
        convert_file(file_path)
    else:
        print(f"File not found: {file_path}")
else:
    # Process all markdown files in docs directory
    docs_path = Path('docs')
    if docs_path.exists():
        md_files = list(docs_path.rglob('*.md'))
        print(f"Found {len(md_files)} markdown files in docs directory")
        
        updated_count = 0
        for md_file in md_files:
            print(f"Processing: {md_file}")
            if convert_file(md_file):
                updated_count += 1
        
        print(f"\nSummary: Updated {updated_count} out of {len(md_files)} files")
    else:
        print("docs directory not found")