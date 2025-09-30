#!/usr/bin/env python3
"""
Script to fix duplicate headings in quiz files.
Removes old-style headings when a new proper heading exists.
"""

import glob
from pathlib import Path

def fix_duplicate_headings(file_path):
    """Fix duplicate headings in quiz file"""
    print(f"Processing: {file_path}")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"  Error reading file: {e}")
        return False
    
    lines = content.split('\n')
    
    # Look for duplicate headings pattern:
    # # Section X.Y Quiz: Topic Name
    # 
    # # X.Y Topic - Quiz  (or similar old format)
    
    if len(lines) < 4:
        print("  File too short, skipping")
        return False
    
    # Check if first line is proper heading and third line is old heading
    if (lines[0].startswith('# Section ') and 
        lines[1].strip() == '' and 
        lines[2].startswith('#') and 
        not lines[2].startswith('# Section ')):
        
        print(f"  Found duplicate heading, removing old format: {lines[2]}")
        
        # Remove the old heading and any empty line after it
        new_lines = [lines[0]]  # Keep the proper heading
        
        # Skip the empty line and old heading
        i = 3
        # Also skip empty line after old heading if it exists
        if i < len(lines) and lines[i].strip() == '':
            i += 1
        
        # Add remaining content
        new_lines.extend(lines[i:])
        
        new_content = '\n'.join(new_lines)
        
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print("  Fixed duplicate heading")
            return True
        except Exception as e:
            print(f"  Error writing file: {e}")
            return False
    else:
        print("  No duplicate heading found")
        return False

def main():
    """Main function to process all quiz files"""
    script_dir = Path(__file__).parent
    textbook_root = script_dir.parent
    
    # Find all quiz files
    quiz_pattern = str(textbook_root / "docs" / "**" / "quiz.md")
    quiz_files = glob.glob(quiz_pattern, recursive=True)
    
    print(f"Found {len(quiz_files)} quiz files to check")
    
    if not quiz_files:
        print("No quiz files found. Check the directory structure.")
        return
    
    success_count = 0
    for quiz_file in quiz_files:
        try:
            if fix_duplicate_headings(quiz_file):
                success_count += 1
        except Exception as e:
            print(f"Error processing {quiz_file}: {e}")
    
    print("\nProcessing complete!")
    print(f"Fixed {success_count} files with duplicate headings")
    print(f"Checked {len(quiz_files)} files total")

if __name__ == "__main__":
    main()