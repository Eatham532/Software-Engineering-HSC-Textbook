#!/usr/bin/env python3
"""
Clean up empty Section folders after moving index.md files to new structure.
This script handles Windows access issues by just reporting the status rather than forcing removal.
"""

import os
import subprocess
from pathlib import Path

def cleanup_section_folders():
    """Check Section folders and report their status. Optionally remove empty ones using PowerShell."""
    
    base_path = Path("docs")
    section_folders = []
    
    # Find all Section folders
    for root, dirs, files in os.walk(base_path):
        for dir_name in dirs:
            if dir_name.startswith("Section-"):
                section_folders.append(Path(root) / dir_name)
    
    print(f"Found {len(section_folders)} Section folders to check")
    
    empty_folders = []
    quiz_only_folders = []
    other_folders = []
    
    for section_folder in section_folders:
        try:
            # List all files in the folder
            files = list(section_folder.glob("*"))
            
            if len(files) == 0:
                # Completely empty folder
                print(f"Empty folder: {section_folder}")
                empty_folders.append(section_folder)
            elif len(files) == 1 and files[0].name == "quiz.md":
                # Only contains quiz.md - this is expected, keep it
                print(f"Quiz-only folder: {section_folder}")
                quiz_only_folders.append(section_folder)
            else:
                # Contains other files - investigate
                file_names = [f.name for f in files]
                print(f"Folder {section_folder} contains: {file_names}")
                other_folders.append(section_folder)
                
        except OSError as e:
            print(f"Error accessing {section_folder}: {e}")
            other_folders.append(section_folder)
    
    print("\nSummary:")
    print(f"  Empty folders: {len(empty_folders)}")
    print(f"  Quiz-only folders: {len(quiz_only_folders)} (expected)")
    print(f"  Other folders: {len(other_folders)}")
    
    # Optionally try to remove empty folders using PowerShell (more forceful)
    if empty_folders:
        print(f"\nAttempting to remove {len(empty_folders)} empty folders using PowerShell...")
        removed_count = 0
        for folder in empty_folders:
            try:
                # Use PowerShell Remove-Item with -Force
                result = subprocess.run([
                    "powershell", "-Command", 
                    f"Remove-Item -Path '{folder}' -Force -ErrorAction Stop"
                ], capture_output=True, text=True, timeout=5)
                
                if result.returncode == 0:
                    print(f"  Removed: {folder}")
                    removed_count += 1
                else:
                    print(f"  Failed to remove: {folder} - {result.stderr.strip()}")
            except (subprocess.TimeoutExpired, subprocess.SubprocessError) as e:
                print(f"  Error removing {folder}: {e}")
        
        print(f"Successfully removed {removed_count} of {len(empty_folders)} empty folders")
    
    return len(empty_folders), len(quiz_only_folders), len(other_folders)

if __name__ == "__main__":
    print("=== Cleaning up Section folders ===")
    
    # Change to the correct directory
    script_dir = Path(__file__).parent.parent
    os.chdir(script_dir)
    print(f"Working directory: {os.getcwd()}")
    
    empty, quiz_only, other = cleanup_section_folders()
    
    print(f"\nCleanup complete!")
    print(f"Empty folders found: {empty}")
    print(f"Quiz-only folders (kept): {quiz_only}")
    print(f"Other folders (kept): {other}")