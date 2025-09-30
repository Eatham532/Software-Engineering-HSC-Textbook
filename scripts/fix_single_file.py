#!/usr/bin/env python3
"""
Fix markdown code block issues in a SINGLE specific file.
This is a safe version that only processes one file at a time.
"""

import os
import re
from pathlib import Path

def fix_code_blocks(content):
    """Fix various code block formatting issues"""
    
    # Fix 1: ``python -> ```python (malformed fence starts)
    content = re.sub(r'^``([a-zA-Z]+)$', r'```\1', content, flags=re.MULTILINE)
    
    # Fix 2: Ensure code blocks are properly closed
    lines = content.split('\n')
    fixed_lines = []
    in_code_block = False
    
    for line in lines:
        # Check for code block start
        if line.strip().startswith('```'):
            if not in_code_block:
                # Starting a code block
                in_code_block = True
                fixed_lines.append(line)
            else:
                # Ending a code block
                in_code_block = False
                fixed_lines.append('```')  # Ensure clean closing
        else:
            fixed_lines.append(line)
    
    # If we ended with an open code block, close it
    if in_code_block:
        fixed_lines.append('```')
    
    content = '\n'.join(fixed_lines)
    
    # Fix 3: Remove duplicate consecutive code fences
    content = re.sub(r'^```\s*\n```\s*$', '```', content, flags=re.MULTILINE)
    
    # Fix 4: Fix ``` at end of files (should just be ```)
    content = re.sub(r'^```\s*$(?=\s*$)', '```', content, flags=re.MULTILINE)
    
    return content

def fix_single_file(file_path):
    """Fix a single markdown file"""
    try:
        print(f"Processing: {file_path}")
        
        with open(file_path, 'r', encoding='utf-8') as f:
            original_content = f.read()
        
        fixed_content = fix_code_blocks(original_content)
        
        # Only write if content changed
        if fixed_content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(fixed_content)
            print(f"✅ Fixed code block issues in: {file_path}")
            return True
        else:
            print(f"ℹ️  No issues found in: {file_path}")
            return False
    
    except Exception as e:
        print(f"❌ Error processing {file_path}: {e}")
        return False

def main():
    """Main function to fix code blocks in a single specified file"""
    
    # Specify the exact file to fix
    target_file = "docs/Year12/SecureSoftwareArchitecture/Chapter-17-System-Security-and-APIs/17-02-Secure-Execution-and-Resource-Management/index.md"
    
    print("=== Single File Code Block Fix ===")
    print(f"Target file: {target_file}")
    
    # Check if file exists
    if not os.path.exists(target_file):
        print(f"❌ File not found: {target_file}")
        return
    
    # Process the single file
    success = fix_single_file(target_file)
    
    print(f"\n=== Summary ===")
    if success:
        print("✅ File was fixed successfully!")
        print("The ``python issue should now be resolved.")
    else:
        print("ℹ️  No changes were needed.")

if __name__ == "__main__":
    # Change to the project root directory
    script_dir = Path(__file__).parent.parent
    os.chdir(script_dir)
    print(f"Working directory: {os.getcwd()}")
    
    main()