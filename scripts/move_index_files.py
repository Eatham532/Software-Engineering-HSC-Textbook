#!/usr/bin/env python3
"""
Script to move index.md files from Section-XX-Name folders to new XX-XX-Name structure.
This preserves the quiz.md files that are already correctly formatted.
"""

import os
import re
import glob
import shutil
from pathlib import Path

def find_section_folders_with_index(root_path):
    """Find all Section-XX-... folders that contain index.md files"""
    pattern = str(root_path / "docs" / "**" / "Section-*")
    section_folders = glob.glob(pattern, recursive=True)
    
    folders_with_index = []
    for folder in section_folders:
        folder_path = Path(folder)
        if folder_path.is_dir():
            index_file = folder_path / "index.md"
            if index_file.exists():
                folders_with_index.append(folder_path)
    
    return folders_with_index

def get_new_folder_structure(section_path):
    """Convert Section-XX-Name to Chapter-XX-Name format"""
    folder_name = section_path.name
    if folder_name.startswith('Section-'):
        # Extract chapter number from parent folder
        parent_folder = section_path.parent.name
        chapter_match = re.search(r'Chapter-(\d+)', parent_folder)
        
        if chapter_match:
            chapter_num = chapter_match.group(1)
            # Remove "Section-" prefix and add chapter prefix
            section_part = folder_name[8:]  # Remove "Section-"
            new_folder_name = f"{chapter_num}-{section_part}"
            return section_path.parent / new_folder_name
        else:
            # Fallback: just remove "Section-" if no chapter found
            new_folder_name = folder_name[8:]
            return section_path.parent / new_folder_name
    return section_path

def move_index_files(root_path):
    """Move index.md files to new folder structure"""
    section_folders = find_section_folders_with_index(root_path)
    
    print(f"Found {len(section_folders)} Section folders with index.md files")
    
    moves_made = 0
    
    for old_section_path in section_folders:
        new_section_path = get_new_folder_structure(old_section_path)
        
        if old_section_path == new_section_path:
            print(f"Skipping: {old_section_path.name} (already correct format)")
            continue
        
        print(f"Processing: {old_section_path.name} -> {new_section_path.name}")
        
        # Create new folder if it doesn't exist
        try:
            new_section_path.mkdir(exist_ok=True)
            print(f"  Created folder: {new_section_path.name}")
        except Exception as e:
            print(f"  Error creating folder {new_section_path}: {e}")
            continue
        
        # Move index.md file
        old_index = old_section_path / "index.md"
        new_index = new_section_path / "index.md"
        
        try:
            if new_index.exists():
                print(f"  Warning: {new_index} already exists, overwriting with Section content")
                new_index.unlink()  # Remove existing file
                
            shutil.move(str(old_index), str(new_index))
            print(f"  Moved: index.md")
            moves_made += 1
            
            # Check if old folder is now empty (except for quiz.md which should stay)
            remaining_files = list(old_section_path.glob("*"))
            if len(remaining_files) == 1 and remaining_files[0].name == "quiz.md":
                print(f"  Old folder now only contains quiz.md (as expected)")
            elif len(remaining_files) == 0:
                # Remove empty folder
                old_section_path.rmdir()
                print(f"  Removed empty folder: {old_section_path.name}")
            else:
                print(f"  Old folder contains other files: {[f.name for f in remaining_files]}")
                
        except Exception as e:
            print(f"  Error moving index.md: {e}")
    
    return moves_made

def update_nav_file(nav_path, root_path):
    """Update .nav.yml file to reflect new folder structure"""
    print(f"\nUpdating navigation file: {nav_path}")
    
    try:
        with open(nav_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading nav file: {e}")
        return False
    
    # Find all current Section- references in nav file
    section_pattern = r'Section-(\d+)-([^/\s]+)'
    matches = re.findall(section_pattern, content)
    
    changes_made = 0
    
    for section_num, section_name in matches:
        # Need to find the chapter number for this section
        # Look for Chapter- pattern before this section
        lines = content.split('\n')
        chapter_num = None
        
        for i, line in enumerate(lines):
            if f'Section-{section_num}-{section_name}' in line:
                # Look backwards for Chapter pattern
                for j in range(i-1, -1, -1):
                    chapter_match = re.search(r'Chapter-(\d+)', lines[j])
                    if chapter_match:
                        chapter_num = chapter_match.group(1)
                        break
                break
        
        if chapter_num:
            old_pattern = f'Section-{section_num}-{section_name}'
            new_pattern = f'{chapter_num}-{section_num}-{section_name}'
            
            count_before = content.count(old_pattern)
            content = content.replace(old_pattern, new_pattern)
            count_after = content.count(old_pattern)
            
            replacements_made = count_before - count_after
            if replacements_made > 0:
                changes_made += replacements_made
                print(f"  Replaced '{old_pattern}' with '{new_pattern}' ({replacements_made} times)")
    
    if changes_made > 0:
        try:
            with open(nav_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  Navigation file updated ({changes_made} changes)")
            return True
        except Exception as e:
            print(f"  Error writing nav file: {e}")
            return False
    else:
        print("  No changes needed in navigation file")
        return True

def main():
    """Main function"""
    script_dir = Path(__file__).parent
    root_path = script_dir.parent
    nav_path = root_path / "docs" / ".nav.yml"
    
    print("=== Moving Index Files to New Structure ===")
    print(f"Working directory: {root_path}")
    print(f"Navigation file: {nav_path}")
    print()
    
    # Check if nav file exists
    if not nav_path.exists():
        print(f"Error: Navigation file not found at {nav_path}")
        return
    
    # Move index.md files
    moves_made = move_index_files(root_path)
    
    if moves_made == 0:
        print("No index.md files were moved.")
        return
    
    # Update navigation file
    nav_success = update_nav_file(nav_path, root_path)
    
    print(f"\n=== Summary ===")
    print(f"Moved {moves_made} index.md files to new structure")
    print(f"Navigation file {'updated successfully' if nav_success else 'update failed'}")
    print(f"\nNew structure: Chapter-XX-Section-YY-Name/index.md")
    print(f"Quiz files remain in their current locations")

if __name__ == "__main__":
    main()