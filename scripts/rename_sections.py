#!/usr/bin/env python3
"""
Script to rename section folders from "Section-XX-Name" to "Chapter-XX-Name" format
and update the navigation file accordingly.
"""

import re
import glob
import shutil
from pathlib import Path

def find_section_folders(root_path):
    """Find all Section-XX-... folders"""
    pattern = str(root_path / "docs" / "**" / "Section-*")
    section_folders = glob.glob(pattern, recursive=True)
    return [Path(folder) for folder in section_folders if Path(folder).is_dir()]

def get_new_folder_name(section_path):
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
            return f"{chapter_num}-{section_part}"
        else:
            # Fallback: just remove "Section-" if no chapter found
            return folder_name[8:]
    return folder_name

def rename_section_folders(root_path):
    """Rename all section folders and return mapping of old to new paths"""
    section_folders = find_section_folders(root_path)
    renames = []
    
    print(f"Found {len(section_folders)} section folders to rename")
    
    for old_path in section_folders:
        new_name = get_new_folder_name(old_path)
        new_path = old_path.parent / new_name
        
        if old_path.name != new_name:  # Only rename if different
            print(f"Renaming: {old_path.name} -> {new_name}")
            
            try:
                # Use shutil.move for cross-platform compatibility
                shutil.move(str(old_path), str(new_path))
                renames.append((str(old_path), str(new_path)))
                print("  ✓ Successfully renamed")
            except Exception as e:
                print(f"  ✗ Error renaming {old_path}: {e}")
        else:
            print(f"Skipping: {old_path.name} (already correct format)")
    
    return renames

def update_nav_file(nav_path, renames):
    """Update .nav.yml file to reflect renamed folders"""
    print(f"\nUpdating navigation file: {nav_path}")
    
    try:
        with open(nav_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading nav file: {e}")
        return False
    
    changes_made = 0
    
    # Create mapping for replacements
    for old_path, new_path in renames:
        # Convert absolute paths to relative paths for nav.yml
        old_rel = Path(old_path).relative_to(Path(old_path).parts[0])  # Remove drive letter
        new_rel = Path(new_path).relative_to(Path(new_path).parts[0])  # Remove drive letter
        
        # Find the part that changed (should be the Section-XX- part)
        old_parts = old_rel.parts
        new_parts = new_rel.parts
        
        # Look for the section folder part and create replacement pattern
        for i, (old_part, new_part) in enumerate(zip(old_parts, new_parts)):
            if old_part != new_part and old_part.startswith('Section-'):
                # Replace in nav file
                old_pattern = old_part
                new_pattern = new_part
                
                # Count occurrences before replacement
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
            print(f"  ✓ Navigation file updated ({changes_made} changes)")
            return True
        except Exception as e:
            print(f"  ✗ Error writing nav file: {e}")
            return False
    else:
        print("  No changes needed in navigation file")
        return True

def main():
    """Main function to rename folders and update navigation"""
    script_dir = Path(__file__).parent
    root_path = script_dir.parent
    nav_path = root_path / "docs" / ".nav.yml"
    
    print("=== Renaming Section Folders ===")
    print(f"Working directory: {root_path}")
    print(f"Navigation file: {nav_path}")
    print()
    
    # Check if nav file exists
    if not nav_path.exists():
        print(f"Error: Navigation file not found at {nav_path}")
        return
    
    # Find and rename section folders
    renames = rename_section_folders(root_path)
    
    if not renames:
        print("No folders were renamed.")
        return
    
    # Update navigation file
    success = update_nav_file(nav_path, renames)
    
    print(f"\n=== Summary ===")
    print(f"Renamed {len(renames)} folders")
    print(f"Navigation file {'updated successfully' if success else 'update failed'}")
    
    if renames:
        print(f"\nRenamed folders:")
        for old_path, new_path in renames:
            old_name = Path(old_path).name
            new_name = Path(new_path).name
            print(f"  {old_name} -> {new_name}")
    
    print(f"\nAll section folders now use format: XX-Topic-Name")
    print(f"Navigation file updated to match new folder structure")

if __name__ == "__main__":
    main()