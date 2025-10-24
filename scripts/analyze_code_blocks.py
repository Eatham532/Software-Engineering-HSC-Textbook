#!/usr/bin/env python3
"""
Code Block Analyzer for MkDocs

Analyzes Python code blocks in index.md files and updates their fence types:
- ```python-exec if code runs successfully AND (produces output OR contains asserts)
- ```python-template if execution fails AND (there are class definitions OR there are class references) AND the failure is not due to a missing library
- ```python otherwise (plain Python)

This script now processes ALL Python code blocks (python, python-exec, python-template)
and re-evaluates their classification. Blocks with input() calls are skipped to avoid blocking.

Usage: python scripts/analyze_code_blocks.py
"""

import ast
import io
from contextlib import redirect_stdout
from multiprocessing import Process, Queue
from typing import List, Tuple, Optional
import sys
from pathlib import Path


def find_python_code_blocks(content: str) -> List[Tuple[int, int, str, str]]:
    """
    Find all Python code blocks in markdown content.

    Returns list of (start_line, end_line, code, current_fence_type) tuples.
    Now processes ALL Python blocks (python, python-exec, python-template).
    """
    blocks = []
    lines = content.split('\n')

    i = 0
    while i < len(lines):
        line = lines[i].strip()

        # Look for opening ```python (any variant)
        if line.startswith('```python'):
            fence_type = line[3:]  # Extract full fence type (e.g., "python-exec")
            start_line = i
            code_lines = []
            i += 1

            # Collect code until closing ```
            while i < len(lines) and not lines[i].strip().startswith('```'):
                code_lines.append(lines[i])
                i += 1

            if i < len(lines) and lines[i].strip() == '```':
                code = '\n'.join(code_lines)
                blocks.append((start_line, i, code, fence_type))

        i += 1

    return blocks


def contains_class_definitions(code: str) -> bool:
    """Check if code contains class definitions."""
    try:
        tree = ast.parse(code)
        for node in ast.walk(tree):
            if isinstance(node, ast.ClassDef):
                return True
        return False
    except SyntaxError:
        return False


def has_asserts_or_tests(code: str) -> bool:
    """Detect presence of asserts or simple test indicators in code.

    Currently checks for Python 'assert' statements in the AST.
    """
    try:
        tree = ast.parse(code)
    except SyntaxError:
        return False

    for node in ast.walk(tree):
        if isinstance(node, ast.Assert):
            return True
    return False


def contains_input_call(code: str) -> bool:
    """Check if code contains input() calls that would block execution."""
    try:
        tree = ast.parse(code)
    except SyntaxError:
        return False

    for node in ast.walk(tree):
        if isinstance(node, ast.Call):
            # Check for direct input() call
            if isinstance(node.func, ast.Name) and node.func.id == 'input':
                return True
            # Check for builtins.input() call
            if isinstance(node.func, ast.Attribute) and node.func.attr == 'input':
                return True
    return False


def has_class_references(code: str) -> bool:
    """Detect references to class-like names being used (e.g., BankAccount(...)).

    Heuristics:
    - Call to a Name with PascalCase (starts with uppercase)
    - Call to an Attribute whose attr is PascalCase (e.g., module.ClassName(...))
    - isinstance(x, ClassName)
    """
    try:
        tree = ast.parse(code)
    except SyntaxError:
        return False

    def is_pascal_case(name: str) -> bool:
        return bool(name) and name[0].isupper()

    for node in ast.walk(tree):
        if isinstance(node, ast.Call):
            # ClassName(...)
            if isinstance(node.func, ast.Name) and is_pascal_case(node.func.id):
                return True
            # module.ClassName(...)
            if isinstance(node.func, ast.Attribute) and is_pascal_case(node.func.attr):
                return True
            # isinstance(x, ClassName)
            if isinstance(node.func, ast.Name) and node.func.id == 'isinstance':
                if len(node.args) >= 2:
                    second = node.args[1]
                    if isinstance(second, ast.Name) and is_pascal_case(second.id):
                        return True
        # Could extend to type annotations, etc., but keep minimal
    return False


def has_only_definitions(code: str) -> bool:
    """Check if code only contains function/class definitions without external execution.
    
    Returns True if:
    - Code contains at least one function or class definition
    - All top-level statements are either function defs, class defs, imports, or docstrings
    - No executable code exists outside of definitions
    """
    try:
        tree = ast.parse(code)
    except SyntaxError:
        return False
    
    has_definitions = False
    
    for node in tree.body:
        # Check if we have any function or class definitions
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
            has_definitions = True
        # These are allowed at module level for definition-only code
        elif isinstance(node, (ast.Import, ast.ImportFrom)):
            continue
        # Docstrings are allowed
        elif isinstance(node, ast.Expr) and isinstance(node.value, ast.Constant) and isinstance(node.value.value, str):
            continue
        # Any other statement means there's executable code
        else:
            return False
    
    return has_definitions


def _exec_worker(code: str, q: Queue) -> None:
    """Worker process to execute code in isolation and return results via queue."""
    try:
        # Import builtins to get __build_class__
        import builtins
        
        # Create a restricted globals dict with essential builtins
        safe_builtins = {
            'print': print,
            'input': (lambda prompt="": ""),  # don't block on input
            'len': len,
            'range': range,
            'int': int,
            'str': str,
            'list': list,
            'dict': dict,
            'set': set,
            'tuple': tuple,
            'bool': bool,
            'float': float,
            'type': type,
            'super': super,  # Required for inheritance
            'isinstance': isinstance,
            'enumerate': enumerate,
            'zip': zip,
            'sum': sum,
            'max': max,
            'min': min,
            'abs': abs,
            'round': round,
            'sorted': sorted,
            'property': property,  # For property decorators
            'staticmethod': staticmethod,  # For static methods
            'classmethod': classmethod,  # For class methods
            'ValueError': ValueError,  # Common exceptions
            'TypeError': TypeError,
            'KeyError': KeyError,
            'IndexError': IndexError,
            'AttributeError': AttributeError,
            'ZeroDivisionError': ZeroDivisionError,
            'FileNotFoundError': FileNotFoundError,
            'Exception': Exception,
            # Critical for class creation
            '__build_class__': builtins.__build_class__,
            '__name__': '__main__',
        }
        
        safe_globals = {'__builtins__': safe_builtins}
        buf = io.StringIO()
        with redirect_stdout(buf):
            exec(code, safe_globals)
        q.put({"ok": True, "stdout": buf.getvalue()})
    except Exception as e:
        q.put({"ok": False, "err_type": e.__class__.__name__, "err_msg": str(e)})


def can_execute_code(code: str, timeout_sec: float = 10.0) -> Tuple[bool, str, Optional[str], bool, str]:
    """
    Test if code can be executed without errors, with timeout.
    Returns (success, captured_stdout, error_type, timed_out, error_message).
    """
    # First try to compile quickly to catch syntax errors fast
    try:
        compile(code, '<string>', 'exec')
    except Exception as e:
        return False, "", e.__class__.__name__, False, str(e)

    q: Queue = Queue()
    p = Process(target=_exec_worker, args=(code, q))
    p.start()
    p.join(timeout_sec)

    if p.is_alive():
        p.terminate()
        p.join()
        return False, "", "TimeoutError", True, "Execution timeout"

    # Process finished; fetch result from queue
    try:
        result = q.get_nowait()
    except Exception:
        # No result; treat as failure
        return False, "", "ExecutionError", False, "No result from execution"

    if result.get("ok"):
        return True, result.get("stdout", ""), None, False, ""
    else:
        return False, "", result.get("err_type", "ExecutionError"), False, result.get("err_msg", "")


def update_code_block(content: str, start_line: int, end_line: int, new_fence: str) -> str:
    """Update a code block's fence type."""
    lines = content.split('\n')

    # Update opening fence
    lines[start_line] = f'```{new_fence}'

    return '\n'.join(lines)


def process_file(file_path: Path, timeouts_accumulator: list[tuple[Path, int]] | None = None) -> int:
    """Process a single markdown file. Returns number of changes made.

    Any blocks that exceed timeout are appended to timeouts_accumulator as (file_path, start_line).
    """
    print(f"Processing {file_path}")

    try:
        content = file_path.read_text(encoding='utf-8')
    except Exception as e:
        print(f"  Error reading file: {e}")
        return 0

    code_blocks = find_python_code_blocks(content)
    if not code_blocks:
        print("  No Python code blocks found")
        return 0

    print(f"  Found {len(code_blocks)} Python code blocks")

    changes_made = 0
    updated_content = content

    for start_line, end_line, code, current_fence in code_blocks:
        # Skip empty code blocks
        if not code.strip():
            continue

        # Check for input() calls first - skip these without timeout
        if contains_input_call(code):
            if timeouts_accumulator is not None:
                timeouts_accumulator.append((file_path, start_line + 1))
            print(f"  Line {start_line+1}: ⏭ Contains input() call → skipped (would block)")
            continue

        # Heuristics
        has_classes = contains_class_definitions(code)
        has_class_refs = has_class_references(code)
        has_asserts = has_asserts_or_tests(code)
        only_definitions = has_only_definitions(code)
        # Actual execution check
        exec_ok, stdout_text, err_type, timed_out, err_msg = can_execute_code(code, timeout_sec=10.0)

        if timed_out:
            # Skip modification and record timeout
            if timeouts_accumulator is not None:
                timeouts_accumulator.append((file_path, start_line + 1))
            print(f"  Line {start_line+1}: ⏱ Timed out (>10s) → unchanged (flagged)")
            continue

        new_fence = current_fence

        # Classification rules (strict order):
        # 1) Exec if code runs AND (produces output OR contains asserts)
        if exec_ok and (stdout_text.strip() or has_asserts):
            out_note = " with output" if stdout_text.strip() else " with asserts"
            print(f"  Line {start_line+1}: ✓ Executed successfully{out_note} → python-exec")
            new_fence = "python-exec"
        # 2) Template if only contains definitions without external execution
        elif only_definitions:
            new_fence = "python-template"
            print(f"  Line {start_line+1}: ✎ Only contains function/class definitions → python-template")
        # 3) Template if fails AND (has class defs OR has class refs) AND failure is not missing library
        elif (not exec_ok) and (has_classes or has_class_refs) and err_type not in {"ImportError", "ModuleNotFoundError"}:
            new_fence = "python-template"
            reason = "class defs" if has_classes else "class refs"
            # Debug: show error message for first few NameErrors
            if err_type == "NameError" and err_msg:
                print(f"  Line {start_line+1}: ✎ Execution failed ({err_type}: {err_msg}); {reason} present → python-template")
            else:
                print(f"  Line {start_line+1}: ✎ Execution failed ({err_type}); {reason} present → python-template")
        else:
            print(f"  Line {start_line+1}: ◻ Leave unchanged (plain python)")
            new_fence = "python"

        if new_fence != current_fence:
            updated_content = update_code_block(updated_content, start_line, end_line, new_fence)
            changes_made += 1

    if changes_made > 0:
        try:
            file_path.write_text(updated_content, encoding='utf-8')
            print(f"  ✅ Made {changes_made} changes")
        except Exception as e:
            print(f"  ❌ Error writing file: {e}")
            return 0

    return changes_made


def main():
    """Main entry point."""
    # Find script directory and go up to repo root
    script_dir = Path(__file__).parent
    repo_root = script_dir.parent
    docs_dir = repo_root / "docs"

    if not docs_dir.exists():
        print(f"Error: docs directory not found at {docs_dir}")
        sys.exit(1)

    # Find all index.md files in docs/
    index_files = list(docs_dir.rglob("index.md"))

    if not index_files:
        print("No index.md files found in docs/")
        sys.exit(0)

    print(f"Found {len(index_files)} index.md files to process")
    print()

    total_changes = 0
    timed_out_blocks: list[tuple[Path, int]] = []

    for file_path in sorted(index_files):
        changes = process_file(file_path, timeouts_accumulator=timed_out_blocks)
        total_changes += changes
        print()

    print(f"🎉 Processing complete! Total changes made: {total_changes}")

    if total_changes > 0:
        print("\n📋 Summary of changes:")
        print("  - ```python-exec: Code runs AND (produces output OR contains asserts)")
        print("  - ```python-template: Only contains function/class definitions OR (fails AND has class definitions/references AND not due to missing library)")
        print("  - ```python: Unchanged (all other cases)")
        print("\n  Note: All Python blocks (including previously tagged) were re-evaluated.")

    if timed_out_blocks:
        print("\n⏱ Skipped blocks (input() calls or timeouts):")
        for path, line_no in timed_out_blocks:
            try:
                rel = path.relative_to(repo_root)
            except Exception:
                rel = path
            print(f"  - {rel} @ line {line_no}")


if __name__ == "__main__":
    main()
