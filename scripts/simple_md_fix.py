"""Simple, safe markdown fixer:
- converts duplicate H1s (# ) to H2s (## ) after the first
- ensures blank line before and after headings (not inside code fences)
- ensures blank line before list items

This is conservative: it preserves code fences and won't touch lines inside them.
"""
from pathlib import Path
import re

repo = Path(__file__).resolve().parents[1]
md_files = list(repo.glob('**/*.md'))

def fix_file(p: Path):
    text = p.read_text(encoding='utf-8')
    lines = text.splitlines()
    out = []
    in_fence = False
    first_h1_seen = False
    changed = False
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.lstrip()
        # detect fence
        if stripped.startswith('```'):
            out.append(line)
            in_fence = not in_fence
            i += 1
            continue
        if in_fence:
            out.append(line)
            i += 1
            continue
        # admonition block: normalize following indented lines to 4-space base indent
        if stripped.startswith('!!!'):
            out.append(line)  # keep admonition marker as-is
            i += 1
            # collect consecutive lines that belong to the admonition (blank or indented)
            block_lines = []
            while i < len(lines):
                nxt = lines[i]
                if nxt.strip() == '' or (len(nxt) > 0 and nxt[0].isspace()):
                    block_lines.append(nxt)
                    i += 1
                    continue
                break
            # determine original base indent from first non-empty block line
            orig_base = None
            for bl in block_lines:
                if bl.strip() != '':
                    bl_exp = bl.expandtabs(4)
                    leading = len(bl_exp) - len(bl_exp.lstrip(' '))
                    orig_base = leading
                    break
            # normalize: map orig_base -> 4 spaces, preserve relative deeper indents
            for bl in block_lines:
                if bl.strip() == '':
                    out.append('')
                    continue
                bl_exp = bl.expandtabs(4)
                leading = len(bl_exp) - len(bl_exp.lstrip(' '))
                rel = leading - orig_base if orig_base is not None else leading
                if rel < 0:
                    rel = 0
                new_lead = 4 + rel
                content = bl_exp.lstrip(' ')
                out.append(' ' * new_lead + content)
            continue
        # H1 handling
        if re.match(r'^#\s', stripped):
            if not first_h1_seen:
                first_h1_seen = True
                # ensure blank line above
                if out and out[-1].strip() != '':
                    out.append('')
                    changed = True
                out.append(line)
                # ensure blank line after
                nxt = lines[i+1] if i+1 < len(lines) else ''
                if nxt.strip() != '':
                    out.append('')
                    changed = True
                i += 1
                continue
            else:
                # convert to H2
                new_line = line.replace('# ', '## ', 1)
                if new_line != line:
                    changed = True
                # ensure blank line above
                if out and out[-1].strip() != '':
                    out.append('')
                out.append(new_line)
                # ensure blank line after
                nxt = lines[i+1] if i+1 < len(lines) else ''
                if nxt.strip() != '':
                    out.append('')
                i += 1
                continue
        # heading other levels ensure blank lines
        if re.match(r'^(#{2,})\s', stripped):
            if out and out[-1].strip() != '':
                out.append('')
                changed = True
            out.append(line)
            nxt = lines[i+1] if i+1 < len(lines) else ''
            if nxt.strip() != '':
                out.append('')
                changed = True
            i += 1
            continue
        # list item: if previous output line not blank, insert blank
        if re.match(r'^([-*+]\s|\d+\.\s)', stripped):
            if out and out[-1].strip() != '':
                out.append('')
                changed = True
            out.append(line)
            i += 1
            continue
        # default
        out.append(line)
        i += 1
    new_text = '\n'.join(out) + ('\n' if out and out[-1] != '' else '')
    if new_text != text:
        p.write_text(new_text, encoding='utf-8')
        return True
    return False

fixed = 0
for f in sorted(md_files):
    if fix_file(f):
        print(f'Fixed: {f.relative_to(repo)}')
        fixed += 1
print(f'Done. Files fixed: {fixed}')
