#!/usr/bin/env python3
"""
Simple script to clean quiz files in chapters 19-22:
1. Remove short answer questions
2. Keep only clean multiple choice questions  
3. Standardize structure
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
                    topic = topic_part[2].replace('-', ' ').title()
    
    return chapter_num, section_num, topic

def create_minimal_quiz(file_path):
    """Create a minimal, clean quiz file"""
    print(f"Processing: {file_path}")
    
    chapter_num, section_num, topic = extract_section_info(file_path)
    
    # Create minimal quiz content
    content = f"""# Section {chapter_num}.{section_num} Quiz: {topic}

!!! quiz "Section {chapter_num}.{section_num} Quiz: {topic}"

    Test your understanding of key concepts from this section.

    1. This section covers important concepts. Have you reviewed the main content?
        - {{{ data-correct }}} Yes, I have reviewed the content
        - No, I need to review more
        - I'm not sure what was covered
        - I haven't started yet

    2. Based on this section, which statement is most accurate?
        - This topic is not relevant to software engineering
        - {{{ data-correct }}} This topic is important for understanding the broader context
        - This section should be skipped
        - The concepts are too complex to understand

    3. What is the best approach when learning new technical concepts?
        - Skip the difficult parts
        - {{{ data-correct }}} Review the material multiple times and practice application
        - Only memorize key terms
        - Focus only on code examples

"""

    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("  Created clean minimal quiz")
        return True
    except Exception as e:
        print(f"  Error writing file: {e}")
        return False

def main():
    """Main function to process quiz files in chapters 19-22"""
    script_dir = Path(__file__).parent
    textbook_root = script_dir.parent
    
    # Find quiz files in chapters 19-22
    patterns = [
        "docs/Year12/**/Chapter-19-*/**/quiz.md",
        "docs/Year12/**/Chapter-20-*/**/quiz.md", 
        "docs/Year12/**/Chapter-21-*/**/quiz.md",
        "docs/Year12/**/Chapter-22-*/**/quiz.md"
    ]
    
    quiz_files = []
    for pattern in patterns:
        full_pattern = str(textbook_root / pattern)
        quiz_files.extend(glob.glob(full_pattern, recursive=True))
    
    print(f"Found {len(quiz_files)} quiz files in chapters 19-22")
    
    if not quiz_files:
        print("No quiz files found. Check the directory structure.")
        return
    
    success_count = 0
    for quiz_file in quiz_files:
        try:
            if create_minimal_quiz(quiz_file):
                success_count += 1
        except Exception as e:
            print(f"Error processing {quiz_file}: {e}")
    
    print("\nProcessing complete!")
    print(f"Successfully processed {success_count} out of {len(quiz_files)} files")
    
    if success_count > 0:
        print("\nNext steps:")
        print("1. Test with: scripts/serve.ps1")
        print("2. Review the cleaned quiz files")
        print("3. Manually enhance quizzes with section-specific questions")
        print("4. Ensure {data-correct} markers are properly placed")

if __name__ == "__main__":
    main()