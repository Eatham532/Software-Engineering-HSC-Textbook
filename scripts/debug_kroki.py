#!/usr/bin/env python3
"""
Kroki Diagram Debugger for MkDocs

This script finds and debugs all Kroki diagrams in the MkDocs textbook.
It identifies syntax errors, validates diagram types, and suggests fixes.
"""

import os
import re
import sys
import json
import requests
from pathlib import Path
from typing import List, Dict, Tuple, Optional
import argparse

# Supported Kroki diagram types
KROKI_TYPES = {
    'plantuml', 'mermaid', 'graphviz', 'blockdiag', 'seqdiag', 'actdiag', 
    'nwdiag', 'packetdiag', 'rackdiag', 'c4plantuml', 'ditaa', 'erd',
    'excalidraw', 'nomnoml', 'svgbob', 'vega', 'vegalite', 'wavedrom'
}

class KrokiDiagram:
    def __init__(self, file_path: str, diagram_type: str, content: str, 
                 start_line: int, end_line: int):
        self.file_path = file_path
        self.diagram_type = diagram_type
        self.content = content
        self.start_line = start_line
        self.end_line = end_line
        self.issues = []

class KrokiDebugger:
    def __init__(self, docs_dir: str = "docs", kroki_url: str = "http://localhost:8000"):
        self.docs_dir = Path(docs_dir)
        self.kroki_url = kroki_url
        self.diagrams = []
        self.issues_found = 0
        self.fixes_applied = 0

    def find_all_diagrams(self) -> List[KrokiDiagram]:
        """Find all Kroki diagrams in markdown files."""
        print("🔍 Scanning for Kroki diagrams...")
        
        for md_file in self.docs_dir.rglob("*.md"):
            self._scan_file(md_file)
        
        print(f"Found {len(self.diagrams)} Kroki diagrams in {len(set(d.file_path for d in self.diagrams))} files")
        return self.diagrams

    def _scan_file(self, file_path: Path):
        """Scan a single markdown file for Kroki diagrams."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # First, convert any plain ```plantuml or ```mermaid to kroki- versions
            original_content = content
            content = self._convert_to_kroki_format(content)
            
            # If we made changes, write them back to the file
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"✅ Converted diagram formats in {file_path.name}")
            
            # Pattern to match kroki code blocks: ```kroki-<type> or ```<type> (for supported types)
            pattern = r'```(?:kroki-)?(\w+)\s*\n(.*?)\n```'
            
            for match in re.finditer(pattern, content, re.DOTALL):
                diagram_type = match.group(1).lower()
                diagram_content = match.group(2)
                
                # Check if it's a supported Kroki type
                if diagram_type in KROKI_TYPES:
                    # Calculate line numbers
                    start_pos = match.start()
                    start_line = content[:start_pos].count('\n') + 1
                    end_line = start_line + diagram_content.count('\n') + 2  # +2 for ``` lines
                    
                    diagram = KrokiDiagram(
                        file_path=str(file_path),
                        diagram_type=diagram_type,
                        content=diagram_content,
                        start_line=start_line,
                        end_line=end_line
                    )
                    self.diagrams.append(diagram)
                    
        except Exception as e:
            print(f"❌ Error scanning {file_path}: {e}")
    
    def _convert_to_kroki_format(self, content: str) -> str:
        """Convert plain ```plantuml and ```mermaid to kroki- format."""
        # Convert ```plantuml to ```kroki-plantuml (but not if already kroki-)
        content = re.sub(r'```plantuml\b(?!\w)', '```kroki-plantuml', content)
        
        # Convert ```mermaid to ```kroki-mermaid (but not if already kroki-)
        content = re.sub(r'```mermaid\b(?!\w)', '```kroki-mermaid', content)
        
        return content

    def validate_diagrams(self) -> List[KrokiDiagram]:
        """Validate all found diagrams and identify issues."""
        print("\n🔍 Validating diagrams...")
        broken_diagrams = []
        
        for i, diagram in enumerate(self.diagrams, 1):
            print(f"Validating {i}/{len(self.diagrams)}: {Path(diagram.file_path).name}")
            
            if self._validate_diagram(diagram):
                broken_diagrams.append(diagram)
        
        print(f"\n📊 Validation complete: {len(broken_diagrams)} issues found")
        return broken_diagrams

    def _validate_diagram(self, diagram: KrokiDiagram) -> bool:
        """Validate a single diagram and populate its issues."""
        has_issues = False
        
        # Check 1: Empty content
        if not diagram.content.strip():
            diagram.issues.append("Empty diagram content")
            has_issues = True
        
        # Check 2: Basic syntax validation
        if diagram.diagram_type == 'plantuml':
            has_issues |= self._validate_plantuml(diagram)
        elif diagram.diagram_type == 'mermaid':
            has_issues |= self._validate_mermaid(diagram)
        elif diagram.diagram_type == 'blockdiag':
            has_issues |= self._validate_blockdiag(diagram)
        
        # Check 3: Try to render with Kroki service (if available)
        if self._is_kroki_available():
            has_issues |= self._validate_with_kroki(diagram)
        
        return has_issues

    def _validate_plantuml(self, diagram: KrokiDiagram) -> bool:
        """Validate PlantUML syntax."""
        content = diagram.content.strip()
        has_issues = False
        
        # Check for @startuml/@enduml tags
        if not content.startswith('@start'):
            diagram.issues.append("PlantUML diagram should start with @startuml")
            has_issues = True
        
        if not content.endswith('@enduml'):
            diagram.issues.append("PlantUML diagram should end with @enduml")
            has_issues = True
        
        # Check for common syntax issues
        lines = content.split('\n')
        for i, line in enumerate(lines, 1):
            line = line.strip()
            if not line or line.startswith("'"):  # Skip empty lines and comments
                continue
                
            # Check for unmatched parentheses in activity diagrams
            if '(' in line and line.count('(') != line.count(')'):
                diagram.issues.append(f"Line {i}: Unmatched parentheses: {line}")
                has_issues = True
        
        return has_issues

    def _validate_mermaid(self, diagram: KrokiDiagram) -> bool:
        """Validate Mermaid syntax."""
        content = diagram.content.strip()
        has_issues = False
        
        # Check for diagram type declaration
        first_line = content.split('\n')[0].strip()
        valid_starts = ['graph', 'flowchart', 'sequenceDiagram', 'classDiagram', 
                       'stateDiagram', 'erDiagram', 'journey', 'gantt', 'pie']
        
        if not any(first_line.startswith(start) for start in valid_starts):
            diagram.issues.append(f"Mermaid diagram should start with a valid type. Found: {first_line}")
            has_issues = True
        
        return has_issues

    def _validate_blockdiag(self, diagram: KrokiDiagram) -> bool:
        """Validate BlockDiag syntax."""
        content = diagram.content.strip()
        has_issues = False
        
        # Check for blockdiag declaration
        if not content.startswith('blockdiag'):
            diagram.issues.append("BlockDiag should start with 'blockdiag'")
            has_issues = True
        
        # Check for balanced braces
        if content.count('{') != content.count('}'):
            diagram.issues.append("Unmatched braces in BlockDiag")
            has_issues = True
        
        return has_issues

    def _validate_with_kroki(self, diagram: KrokiDiagram) -> bool:
        """Validate diagram by attempting to render it with Kroki service."""
        try:
            import base64
            import zlib
            
            # Encode content for Kroki
            encoded = base64.urlsafe_b64encode(
                zlib.compress(diagram.content.encode('utf-8'))
            ).decode('ascii')
            
            # Make request to Kroki
            url = f"{self.kroki_url}/{diagram.diagram_type}/svg/{encoded}"
            response = requests.get(url, timeout=10)
            
            if response.status_code != 200:
                error_msg = f"Kroki rendering failed (HTTP {response.status_code})"
                if response.text:
                    error_msg += f": {response.text[:200]}"
                diagram.issues.append(error_msg)
                return True
                
        except Exception as e:
            diagram.issues.append(f"Failed to validate with Kroki: {str(e)}")
            return True
        
        return False

    def _is_kroki_available(self) -> bool:
        """Check if Kroki service is available."""
        try:
            response = requests.get(f"{self.kroki_url}/health", timeout=5)
            return response.status_code == 200
        except:
            return False

    def present_issues(self, broken_diagrams: List[KrokiDiagram], interactive: bool = True):
        """Present issues to the user and offer fixes."""
        if not broken_diagrams:
            print("🎉 No issues found! All diagrams are valid.")
            return
        
        print(f"\n🚨 Found {len(broken_diagrams)} diagrams with issues:\n")
        
        for i, diagram in enumerate(broken_diagrams, 1):
            self._present_single_issue(diagram, i, len(broken_diagrams), interactive)

    def _present_single_issue(self, diagram: KrokiDiagram, index: int, total: int, interactive: bool):
        """Present a single diagram issue to the user."""
        rel_path = os.path.relpath(diagram.file_path, self.docs_dir)
        
        print(f"{'='*60}")
        print(f"Issue {index}/{total}")
        print(f"📁 File: {rel_path}")
        print(f"📍 Lines: {diagram.start_line}-{diagram.end_line}")
        print(f"🔧 Type: {diagram.diagram_type}")
        print(f"{'='*60}")
        
        print("❌ Issues found:")
        for issue in diagram.issues:
            print(f"   • {issue}")
        
        print(f"\n📝 Current content (lines {diagram.start_line}-{diagram.end_line}):")
        print("```" + diagram.diagram_type)
        print(diagram.content)
        print("```")
        
        # Suggest fixes
        fix = self._suggest_fix(diagram)
        if fix:
            print(f"\n💡 Suggested fix:")
            print("```" + diagram.diagram_type)
            print(fix)
            print("```")
            
            if interactive:
                response = input("\n🔧 Apply this fix? [y/N/s(kip)/q(uit)]: ").lower()
                if response == 'y':
                    if self._apply_fix(diagram, fix):
                        print("✅ Fix applied successfully!")
                        self.fixes_applied += 1
                    else:
                        print("❌ Failed to apply fix")
                elif response == 'q':
                    print("Exiting...")
                    sys.exit(0)
                elif response == 's':
                    print("Skipping...")
                else:
                    print("No fix applied")
        else:
            print("\n❓ No automatic fix available. Manual intervention required.")
            if interactive:
                input("Press Enter to continue...")
        
        print()

    def _clean_mermaid_content(self, content: str) -> str:
        """Clean mermaid content that has markdown mixed in."""
        lines = content.split('\n')
        clean_lines = []
        in_diagram = True
        
        for line in lines:
            stripped = line.strip()
            
            # Stop when we hit markdown content
            if (stripped.startswith('```') and not stripped.startswith('```mermaid') and not stripped.startswith('```kroki-mermaid')) or \
               stripped.startswith('///') or \
               stripped.startswith('===') or \
               stripped.startswith('#'):
                in_diagram = False
                break
                
            if in_diagram and stripped:
                clean_lines.append(line)
        
        return '\n'.join(clean_lines)

    def _escape_diagram_content(self, content: str, diagram_type: str) -> str:
        """Escape problematic characters in diagram content."""
        if diagram_type == 'plantuml':
            # Escape special characters that interfere with markdown
            content = content.replace('→', '\\u2192')  # Right arrow
            content = content.replace('←', '\\u2190')  # Left arrow
            content = content.replace('↑', '\\u2191')  # Up arrow
            content = content.replace('↓', '\\u2193')  # Down arrow
            content = content.replace('≥', '\\u2265')  # Greater than or equal
            content = content.replace('≤', '\\u2264')  # Less than or equal
            content = content.replace('≠', '\\u2260')  # Not equal
            
        elif diagram_type == 'mermaid':
            # For Mermaid, ensure special characters in labels are quoted
            content = content.replace('≥', '>=')  # Use standard comparison
            content = content.replace('≤', '<=')  # Use standard comparison
            content = content.replace(''', "'")   # Replace smart quotes
            content = content.replace(''', "'")   # Replace smart quotes
            content = content.replace('"', '"')   # Replace smart quotes
            content = content.replace('"', '"')   # Replace smart quotes
            
        return content

    def _suggest_fix(self, diagram: KrokiDiagram) -> Optional[str]:
        """Suggest a fix for the diagram."""
        content = diagram.content.strip()
        
        # First check for malformed code blocks (like ```kroki-plantuml inside content)
        if content.startswith('```'):
            # Extract the actual diagram content after the malformed fence
            lines = content.split('\n')
            # Find where the actual diagram starts (after @startuml or diagram type)
            actual_start = 0
            for i, line in enumerate(lines):
                if line.strip().startswith('@start') or any(line.strip().startswith(t) for t in ['flowchart', 'graph', 'sequenceDiagram']):
                    actual_start = i
                    break
            if actual_start > 0:
                content = '\n'.join(lines[actual_start:])
        
        # Clean mermaid content that has markdown mixed in
        if diagram.diagram_type == 'mermaid':
            content = self._clean_mermaid_content(content)
        
        # Apply escaping for problematic characters
        content = self._escape_diagram_content(content, diagram.diagram_type)
        
        # Fix PlantUML issues
        if diagram.diagram_type == 'plantuml':
            if not content.startswith('@start'):
                content = f"@startuml\n{content}"
            if not content.endswith('@enduml'):
                content = f"{content}\n@enduml"
            return content
        
        # Fix Mermaid issues
        elif diagram.diagram_type == 'mermaid':
            lines = content.split('\n')
            if lines:
                first_line = lines[0].strip()
                
                # Try to detect diagram type and add it
                if not any(first_line.startswith(start) for start in 
                          ['graph', 'flowchart', 'sequenceDiagram', 'classDiagram']):
                    # Simple heuristic: if it has arrows, it's probably a flowchart
                    if '-->' in content or '->' in content:
                        return f"flowchart TD\n{content}"
                    # If it has sequence-like syntax, it's probably a sequence diagram
                    elif '->' in content and any(word in content.lower() for word in ['participant', 'activate']):
                        return f"sequenceDiagram\n{content}"
            return content
        
        # Fix BlockDiag issues
        elif diagram.diagram_type == 'blockdiag':
            if not content.startswith('blockdiag'):
                # Wrap content in blockdiag structure
                return f"blockdiag {{\n{content}\n}}"
        
        return content if content != diagram.content.strip() else None

    def _apply_fix(self, diagram: KrokiDiagram, fixed_content: str) -> bool:
        """Apply the suggested fix to the file."""
        try:
            with open(diagram.file_path, 'r', encoding='utf-8') as f:
                file_content = f.read()
            
            original_content = file_content
            lines = file_content.split('\n')
            
            # Replace the content between start_line and end_line
            new_lines = lines[:diagram.start_line]  # Before diagram
            new_lines.append(f"```kroki-{diagram.diagram_type}")
            new_lines.append(fixed_content)
            new_lines.append("```")
            new_lines.extend(lines[diagram.end_line:])  # After diagram
            
            new_content = '\n'.join(new_lines)
            
            # Only write if content actually changed
            if new_content != original_content:
                with open(diagram.file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"✅ Applied fix to {diagram.file_path}")
                return True
            else:
                print(f"⚠️  No changes needed for {diagram.file_path}")
                return False
            
        except Exception as e:
            print(f"❌ Error applying fix: {e}")
            return False

    def _validate_fix(self, diagram: KrokiDiagram, fixed_content: str) -> bool:
        """Validate that the fix actually works by testing the fixed content."""
        # Create a temporary diagram object with the fixed content
        temp_diagram = KrokiDiagram(
            file_path=diagram.file_path,
            diagram_type=diagram.diagram_type,
            content=fixed_content,
            start_line=diagram.start_line,
            end_line=diagram.end_line
        )
        
        # Re-validate the fixed diagram
        has_issues = self._validate_diagram(temp_diagram)
        
        if not has_issues:
            print(f"✅ Fix validation successful - diagram now renders correctly")
            return True
        else:
            print(f"❌ Fix validation failed - diagram still has issues:")
            for issue in temp_diagram.issues:
                print(f"   • {issue}")
            return False

    def generate_report(self, broken_diagrams: List[KrokiDiagram]):
        """Generate a summary report."""
        print(f"\n{'='*60}")
        print("📊 KROKI DEBUGGING SUMMARY")
        print(f"{'='*60}")
        print(f"Total diagrams found: {len(self.diagrams)}")
        print(f"Diagrams with issues: {len(broken_diagrams)}")
        print(f"Fixes applied: {self.fixes_applied}")
        print(f"Success rate: {((len(self.diagrams) - len(broken_diagrams) + self.fixes_applied) / len(self.diagrams) * 100):.1f}%")
        
        if broken_diagrams:
            print(f"\n🔍 Issue breakdown:")
            issue_types = {}
            for diagram in broken_diagrams:
                for issue in diagram.issues:
                    issue_type = issue.split(':')[0] if ':' in issue else issue
                    issue_types[issue_type] = issue_types.get(issue_type, 0) + 1
            
            for issue_type, count in sorted(issue_types.items(), key=lambda x: x[1], reverse=True):
                print(f"   • {issue_type}: {count}")

def main():
    parser = argparse.ArgumentParser(description="Debug Kroki diagrams in MkDocs")
    parser.add_argument("--docs-dir", default="docs", help="Documentation directory")
    parser.add_argument("--kroki-url", default="http://localhost:8000", help="Kroki service URL")
    parser.add_argument("--non-interactive", action="store_true", help="Run without user interaction")
    parser.add_argument("--auto-fix", action="store_true", help="Automatically apply all fixes")
    parser.add_argument("--max-issues", type=int, default=5, help="Maximum number of issues to show per run (default: 5)")
    
    args = parser.parse_args()
    
    print("🚀 Kroki Diagram Debugger")
    print("=" * 30)
    
    debugger = KrokiDebugger(args.docs_dir, args.kroki_url)
    
    # Find all diagrams
    all_diagrams = debugger.find_all_diagrams()
    if not all_diagrams:
        print("No Kroki diagrams found.")
        return
    
    # Validate diagrams
    broken_diagrams = debugger.validate_diagrams()
    
    # Limit the number of issues to process
    if len(broken_diagrams) > args.max_issues:
        print(f"\n📊 Found {len(broken_diagrams)} issues total, showing first {args.max_issues}")
        broken_diagrams = broken_diagrams[:args.max_issues]
    
    # Present issues
    interactive = not args.non_interactive and not args.auto_fix
    if args.auto_fix:
        print("\n🔧 Auto-fixing mode enabled...")
        fixes_actually_applied = 0
        fixes_validated = 0
        for i, diagram in enumerate(broken_diagrams, 1):
            print(f"\n📝 Processing issue {i}/{len(broken_diagrams)}")
            rel_path = os.path.relpath(diagram.file_path, debugger.docs_dir)
            print(f"📁 File: {rel_path}")
            print(f"🔧 Type: {diagram.diagram_type}")
            print("❌ Issues:")
            for issue in diagram.issues:
                print(f"   • {issue}")
            
            fix = debugger._suggest_fix(diagram)
            if fix:
                # First validate the fix before applying
                print(f"🔍 Validating proposed fix...")
                if debugger._validate_fix(diagram, fix):
                    if debugger._apply_fix(diagram, fix):
                        fixes_actually_applied += 1
                        fixes_validated += 1
                        debugger.fixes_applied += 1
                    else:
                        print(f"⚠️  Fix validated but application failed")
                else:
                    print(f"❌ Fix validation failed - not applying")
            else:
                print(f"❓ No automatic fix available")
        
        print(f"\n🎯 Successfully applied and validated {fixes_validated} fixes out of {len(broken_diagrams)} issues")
        print(f"📊 Total fixes applied: {fixes_actually_applied}")
    else:
        debugger.present_issues(broken_diagrams, interactive)
    
    # Generate final report
    debugger.generate_report(broken_diagrams)

if __name__ == "__main__":
    main()