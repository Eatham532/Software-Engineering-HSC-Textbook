#!/usr/bin/env python3
"""
Version bumping utility for pyproject.toml
Handles semantic versioning (MAJOR.MINOR.PATCH)
"""

import re
import sys
from pathlib import Path


def read_version(pyproject_path: Path) -> str:
    """Read current version from pyproject.toml"""
    content = pyproject_path.read_text(encoding='utf-8')
    match = re.search(r'^version\s*=\s*["\']([^"\']+)["\']', content, re.MULTILINE)
    if not match:
        raise ValueError("Could not find version in pyproject.toml")
    return match.group(1)


def parse_version(version: str) -> tuple[int, int, int]:
    """Parse version string into (major, minor, patch) tuple"""
    match = re.match(r'^(\d+)\.(\d+)\.(\d+)$', version)
    if not match:
        raise ValueError(f"Invalid version format: {version}")
    major, minor, patch = map(int, match.groups())
    return major, minor, patch


def format_version(major: int, minor: int, patch: int) -> str:
    """Format version tuple as string"""
    return f"{major}.{minor}.{patch}"


def bump_version(version: str, bump_type: str = 'patch') -> str:
    """
    Bump version according to semantic versioning
    
    Args:
        version: Current version string (e.g., "0.1.0")
        bump_type: Type of bump - 'major', 'minor', or 'patch'
    
    Returns:
        New version string
    """
    major, minor, patch = parse_version(version)
    
    if bump_type == 'major':
        major += 1
        minor = 0
        patch = 0
    elif bump_type == 'minor':
        minor += 1
        patch = 0
    elif bump_type == 'patch':
        patch += 1
    else:
        raise ValueError(f"Invalid bump type: {bump_type}. Must be 'major', 'minor', or 'patch'")
    
    return format_version(major, minor, patch)


def write_version(pyproject_path: Path, new_version: str) -> None:
    """Write new version to pyproject.toml"""
    content = pyproject_path.read_text(encoding='utf-8')
    new_content = re.sub(
        r'^version\s*=\s*["\'][^"\']+["\']',
        f'version = "{new_version}"',
        content,
        count=1,
        flags=re.MULTILINE
    )
    pyproject_path.write_text(new_content, encoding='utf-8')


def main():
    """Main entry point"""
    # Determine repo root (script is in scripts/ subdirectory)
    script_dir = Path(__file__).parent
    repo_root = script_dir.parent
    pyproject_path = repo_root / "pyproject.toml"
    
    if not pyproject_path.exists():
        print(f"Error: {pyproject_path} not found", file=sys.stderr)
        sys.exit(1)
    
    # Get bump type from command line (default: patch)
    bump_type = sys.argv[1] if len(sys.argv) > 1 else 'patch'
    
    if bump_type not in ('major', 'minor', 'patch', 'show', 'set'):
        print(f"Error: Invalid bump type '{bump_type}'", file=sys.stderr)
        print("Usage: bump_version.py [major|minor|patch|show|set VERSION]", file=sys.stderr)
        sys.exit(1)
    
    # Read current version
    try:
        current_version = read_version(pyproject_path)
    except Exception as e:
        print(f"Error reading version: {e}", file=sys.stderr)
        sys.exit(1)
    
    # If 'show', just print current version and exit
    if bump_type == 'show':
        print(current_version)
        return
    
    # If 'set', use the provided version
    if bump_type == 'set':
        if len(sys.argv) < 3:
            print("Error: 'set' requires a version argument", file=sys.stderr)
            print("Usage: bump_version.py set VERSION", file=sys.stderr)
            sys.exit(1)
        new_version = sys.argv[2]
        print(f"{current_version} -> {new_version}")
    else:
        # Bump version
        try:
            new_version = bump_version(current_version, bump_type)
        except Exception as e:
            print(f"Error bumping version: {e}", file=sys.stderr)
            sys.exit(1)
        
        print(f"{current_version} -> {new_version}")
    
    # Write new version
    try:
        write_version(pyproject_path, new_version)
    except Exception as e:
        print(f"Error writing version: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
