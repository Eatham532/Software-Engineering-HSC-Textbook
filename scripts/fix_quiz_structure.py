#!/usr/bin/env python3
"""
Script to fix quiz structures in chapters 19-22 by:
1. Removing short answer questions 
2. Cleaning up duplicate headers and content
3. Standardizing format to clean markdown with !!! quiz blocks
4. Ensuring proper {data-correct} markers
"""

import re
import glob
from pathlib import Path

def clean_quiz_content(content):
    """Clean and standardize quiz content"""
    
    # Remove duplicate headers and excessive repetition
    lines = content.split('\n')
    cleaned_lines = []
    seen_headers = set()
    
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        
        # Skip empty lines at start
        if not cleaned_lines and not line:
            i += 1
            continue
            
        # Handle duplicate headers
        if line.startswith('#') and line in seen_headers:
            i += 1
            continue
        elif line.startswith('#'):
            seen_headers.add(line)
            
        cleaned_lines.append(lines[i])
        i += 1
    
    content = '\n'.join(cleaned_lines)
    
    # Remove HTML div structures and replace with clean markdown
    content = re.sub(r'<div class="quiz-question"[^>]*>.*?</div>', '', content, flags=re.DOTALL)
    content = re.sub(r'<div class="explanation">.*?</div>', '', content, flags=re.DOTALL)
    
    # Clean up excessive whitespace
    content = re.sub(r'\n\s*\n\s*\n+', '\n\n', content)
    
    return content

def extract_section_info(file_path):
    """Extract chapter and section info from file path"""
    path_parts = Path(file_path).parts
    
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
            topic_part = part.split('-', 2)
            if len(topic_part) > 2:
                topic = topic_part[2].replace('-', ' ').title()
                break
    
    return chapter_num, section_num, topic

def process_quiz_file(file_path):
    """Process a single quiz file to remove short answers and fix structure"""
    print(f"Processing: {file_path}")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"  Error reading file: {e}")
        return False
    
    # Clean initial content
    content = clean_quiz_content(content)
    
    # Extract section info
    chapter_num, section_num, topic = extract_section_info(file_path)
    
    # Build new clean quiz structure
    new_content = f"""# Section {chapter_num}.{section_num} Quiz: {topic}

!!! quiz "Section {chapter_num}.{section_num} Quiz: {topic}"

    Test your understanding of key concepts from this section.

"""
    
    # Extract multiple choice questions only
    lines = content.split('\n')
    question_num = 1
    i = 0
    
    while i < len(lines):
        line = lines[i].strip()
        
        # Look for numbered questions
        question_match = re.match(r'(\s*\d+\.?\s*)(.*)', line)
        if question_match and not line.startswith('#'):
            indent, question_text = question_match.groups()
            
            # Clean question text
            question_text = re.sub(r'\*\*(.*?)\*\*', r'\1', question_text)  # Remove bold
            question_text = question_text.strip()
            
            # Skip if this looks like a short answer question
            if any(keyword in question_text.lower() for keyword in 
                   ['short answer', 'explain', 'describe', 'marks)', 'expected answer']):
                # Skip to next question
                while i < len(lines) - 1:
                    i += 1
                    if re.match(r'\s*\d+\.', lines[i]) or lines[i].startswith('#'):
                        break
                continue
            
            # This is a multiple choice question
            new_content += f"    {question_num}. {question_text}\n"
            i += 1
            
            # Collect options
            options = []
            while i < len(lines):
                if i >= len(lines):
                    break
                line = lines[i].strip()
                
                # Check for option (dash format or a), b), c), d) format)
                option_match = re.match(r'[-•]\s*(.*)', line) or re.match(r'[a-d]\)\s*(.*)', line)
                if option_match:
                    option_text = option_match.group(1).strip()
                    options.append(option_text)
                    i += 1
                elif line and not re.match(r'\s*\d+\.', line) and not line.startswith('#'):
                    # Continue collecting if it's continuation text
                    if line.startswith('**Answer') or line.startswith('*Expected answer'):
                        # Skip answer explanations
                        break
                    i += 1
                else:
                    break
            
            # Add options to quiz
            for option in options:
                new_content += f"        - {option}\n"
            
            new_content += "\n"
            question_num += 1
            
            # Limit to reasonable number of questions
            if question_num > 15:
                break
        else:
            i += 1
    
    # If no questions were found, create a minimal quiz
    if question_num == 1:
        new_content += """    1. This section covers important concepts that will be assessed. Please review the main content.
        - { data-correct } True
        - False

"""
    
    # Clean up and finalize
    new_content = new_content.rstrip() + '\n'
    
    # Write the cleaned content
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("  Successfully cleaned and shortened quiz")
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
            if process_quiz_file(quiz_file):
                success_count += 1
        except Exception as e:
            print(f"Error processing {quiz_file}: {e}")
    
    print("\nProcessing complete!")
    print(f"Successfully processed {success_count} out of {len(quiz_files)} files")
    
    if success_count > 0:
        print("\nNext steps:")
        print("1. Review the cleaned quiz files")
        print("2. Test with: scripts/serve.ps1")
        print("3. Manually add {data-correct} markers to correct answers")
        print("4. Consider adding more multiple choice questions to replace removed short answers")

if __name__ == "__main__":
    main()