#!/usr/bin/env python3
"""
Script to add proper headings to quiz files that are missing them.
Ensures all quiz files follow the pattern:
# X.Y Topic Name - Quiz
"""

import re
import glob
from pathlib import Path

def extract_section_info(file_path):
    """Extract chapter and section info from file path"""
    path_parts = Path(file_path).parts
    
    chapter_num = "X"
    section_num = "X" 
    topic = "Quiz"
    
    for part in path_parts:
        if part.startswith('Chapter-'):
            match = re.search(r'Chapter-(\d+)', part)
            if match:
                chapter_num = match.group(1)
        elif part.startswith('Section-'):
            match = re.search(r'Section-(\d+)', part)
            if match:
                section_num = match.group(1)
            # Extract topic from section folder name
            if len(part) > 10:
                topic_part = part.split('-', 2)
                if len(topic_part) > 2:
                    # Clean up topic: replace dashes with spaces and title case
                    topic = topic_part[2].replace('-', ' ').title()
    
    return chapter_num, section_num, topic

def add_heading_to_quiz(file_path):
    """Add proper heading to quiz file if missing"""
    print(f"Processing: {file_path}")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"  Error reading file: {e}")
        return False
    
    # Check if file already has proper heading in the new format
    first_line = content.split('\n')[0] if content.strip() else ""
    if first_line.startswith('# ') and ' - Quiz' in first_line and not first_line.startswith('# Section'):
        print("  Already has proper heading, skipping")
        return False
    
    chapter_num, section_num, topic = extract_section_info(file_path)
    
    # Create the proper heading in format: # 20.1 What is AI vs ML - Quiz
    heading = f"# {chapter_num}.{section_num} {topic} - Quiz\n\n"
    
    lines = content.split('\n')
    start_index = 0
    
    # Remove ALL old headings (any line starting with #)
    while start_index < len(lines):
        line = lines[start_index].strip()
        if line.startswith('#'):
            print(f"  Removing old heading: {line}")
            start_index += 1
        else:
            break
    
    # Skip any empty lines after old headings
    while start_index < len(lines) and lines[start_index].strip() == '':
        start_index += 1
    
    # Add new heading to remaining content
    if start_index < len(lines):
        remaining_content = '\n'.join(lines[start_index:])
        new_content = heading + remaining_content
    else:
        new_content = heading + "!!! quiz \"Quiz\"\n\n    Content needed.\n"
    
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"  Added heading: {chapter_num}.{section_num} {topic} - Quiz")
        return True
    except Exception as e:
        print(f"  Error writing file: {e}")
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
            if add_heading_to_quiz(quiz_file):
                success_count += 1
        except Exception as e:
            print(f"Error processing {quiz_file}: {e}")
    
    print("\nProcessing complete!")
    print(f"Updated headings in {success_count} quiz files")
    print(f"Skipped {len(quiz_files) - success_count} files (already had correct format)")
    
    if success_count > 0:
        print("\nAll quiz files now use the format: # X.Y Topic Name - Quiz")

if __name__ == "__main__":
    main()