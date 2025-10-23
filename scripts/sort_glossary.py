"""
Sort glossary.toml alphabetically by term name.

This script reads docs/glossary.toml, sorts all terms alphabetically (case-insensitive),
and writes the sorted version back to the file while preserving formatting.
"""

import tomllib
from pathlib import Path


def sort_glossary_toml():
    """Sort glossary terms alphabetically and rewrite the file."""
    # Get the project root (script is in scripts/, project root is parent)
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    toml_path = project_root / 'docs' / 'glossary.toml'
    
    if not toml_path.exists():
        print(f"❌ Error: {toml_path} not found")
        return False
    
    # Read and parse the TOML file
    print(f"📖 Reading {toml_path.relative_to(project_root)}...")
    with open(toml_path, 'rb') as f:
        data = tomllib.load(f)
    
    if 'term' not in data:
        print("❌ Error: No [[term]] entries found in glossary.toml")
        return False
    
    terms = data['term']
    original_count = len(terms)
    print(f"📋 Found {original_count} terms")
    
    # Sort terms alphabetically by name (case-insensitive)
    sorted_terms = sorted(terms, key=lambda t: t['name'].lower())
    
    # Build the output manually to preserve formatting
    output_lines = [
        '# Glossary Configuration',
        '#',
        '# Define terms for the site-wide glossary system.',
        '# Terms are automatically linked throughout the site with interactive tooltips.',
        '#',
        '# Required fields: name, definition, category',
        '# Optional fields: aliases (list), full_form (for acronyms)',
        '',
    ]
    
    for term in sorted_terms:
        output_lines.append('[[term]]')
        output_lines.append(f'name = "{term["name"]}"')
        output_lines.append(f'definition = "{term["definition"]}"')
        output_lines.append(f'category = "{term["category"]}"')
        
        # Add optional fields if present
        if 'aliases' in term and term['aliases']:
            aliases_str = ', '.join(f'"{alias}"' for alias in term['aliases'])
            output_lines.append(f'aliases = [{aliases_str}]')
        
        if 'full_form' in term and term['full_form']:
            output_lines.append(f'full_form = "{term["full_form"]}"')
        
        output_lines.append('')  # Blank line between terms
    
    # Write back to file
    print(f"✍️  Writing sorted terms to {toml_path.relative_to(project_root)}...")
    with open(toml_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(output_lines))
    
    print(f"✅ Successfully sorted {original_count} terms alphabetically")
    
    # Show the order
    print("\n📝 Term order:")
    for i, term in enumerate(sorted_terms, 1):
        category_badge = f"[{term['category']}]"
        print(f"   {i:2d}. {term['name']:20s} {category_badge}")
    
    return True


if __name__ == '__main__':
    import sys
    success = sort_glossary_toml()
    sys.exit(0 if success else 1)
