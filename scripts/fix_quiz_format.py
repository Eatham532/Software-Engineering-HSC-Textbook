#!/usr/bin/env python3
"""
Script to fix quiz formats from old a), b), c), d) format to new dash format
Also adds missing section titles and removes bold formatting from questions
"""

import os
import re
import glob
from pathlib import Path

def fix_quiz_file(file_path):
    """Fix a single quiz file"""
    print(f"Processing: {file_path}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if this file needs fixing (has a), b), c), d) format)
    if not re.search(r'\s+[a-d]\)', content):
        print(f"  Skipping {file_path} - already in correct format")
        return False
    
    # Extract section info from path for title
    path_parts = Path(file_path).parts
    
    # Find Chapter and Section info
    chapter_match = None
    section_match = None
    
    for part in path_parts:
        if part.startswith('Chapter-'):
            chapter_match = re.search(r'Chapter-(\d+)', part)
        elif part.startswith('Section-'):
            section_match = re.search(r'Section-(\d+)', part)
    
    chapter_num = chapter_match.group(1) if chapter_match else "X"
    section_num = section_match.group(1) if section_match else "X"
    
    # Extract topic from directory name
    topic = "Quiz"
    for part in reversed(path_parts):
        if part.startswith('Section-') and len(part) > 10:
            # Extract topic from section folder name
            topic_part = part.split('-', 2)
            if len(topic_part) > 2:
                topic = topic_part[2].replace('-', ' ').title()
            break
    
    # Add title if missing
    if not content.strip().startswith('#'):
        title = f"# Section {chapter_num}.{section_num} Quiz: {topic}\n\n"
        content = title + content
    
    # Fix the quiz format
    lines = content.split('\n')
    fixed_lines = []
    in_quiz_block = False
    
    for line in lines:
        # Detect quiz block start
        if '!!! quiz' in line:
            in_quiz_block = True
            fixed_lines.append(line)
            continue
        
        # If we're in a quiz block, process the line
        if in_quiz_block:
            # Check if we've left the quiz block (no more indentation)
            if line and not line.startswith('    ') and not line.startswith('\t'):
                in_quiz_block = False
                fixed_lines.append(line)
                continue
            
            # Remove bold formatting from questions
            if re.match(r'\s+\d+\.\s+\*\*.*\*\*', line):
                # Remove ** from question
                line = re.sub(r'\*\*(.*?)\*\*', r'\1', line)
            
            # Convert a), b), c), d) format to dash format
            if re.match(r'\s+[a-d]\)', line):
                # Extract the option letter and text
                match = re.match(r'(\s+)([a-d])\)\s*(.*)', line)
                if match:
                    indent, letter, text = match.groups()
                    # Convert to dash format
                    line = f"{indent}- {text}"
            
            # Fix indentation issues - ensure proper 8-space indentation for quiz items
            if re.match(r'\s+\d+\.', line):  # Question numbers
                line = re.sub(r'^\s+', '    ', line)  # 4 spaces for questions
            elif re.match(r'\s+-', line):  # Answer options
                line = re.sub(r'^\s+', '        ', line)  # 8 spaces for options
        
        fixed_lines.append(line)
    
    # Join lines back
    fixed_content = '\n'.join(fixed_lines)
    
    # Ensure file ends with single newline
    fixed_content = fixed_content.rstrip() + '\n'
    
    # Write back to file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(fixed_content)
    
    print(f"  Fixed {file_path}")
    return True

def main():
    """Main function to process all quiz files"""
    script_dir = Path(__file__).parent
    textbook_root = script_dir.parent
    
    # Find all quiz.md files in Year12 directories
    quiz_pattern = str(textbook_root / "docs" / "Year12" / "**" / "quiz.md")
    quiz_files = glob.glob(quiz_pattern, recursive=True)
    
    print(f"Found {len(quiz_files)} quiz files to check")
    
    fixed_count = 0
    for quiz_file in quiz_files:
        try:
            if fix_quiz_file(quiz_file):
                fixed_count += 1
        except Exception as e:
            print(f"Error processing {quiz_file}: {e}")
    
    print(f"\nProcessing complete!")
    print(f"Fixed {fixed_count} quiz files")
    print(f"Skipped {len(quiz_files) - fixed_count} files (already correct format)")

if __name__ == "__main__":
    main()