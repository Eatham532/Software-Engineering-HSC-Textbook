"""
Glossary page generator for MkDocs macros plugin.
Generates the glossary page with alphabetical sorting and category filtering.
"""

from pathlib import Path
try:
    import tomllib as tomli  # Python 3.11+
except ImportError:
    import tomli  # Fallback for older Python


def define_env(env):
    """Hook for mkdocs-macros plugin."""
    
    @env.macro
    def generate_glossary():
        """Generate glossary HTML content from TOML config."""
        config_path = Path(env.project_dir) / 'docs' / 'glossary.toml'
        
        if not config_path.exists():
            return "<!-- Glossary config not found -->"
        
        with open(config_path, 'rb') as f:
            data = tomli.load(f)
        
        terms = data.get('term', [])
        if not terms:
            return "<!-- No glossary terms defined -->"
        
        # Sort terms alphabetically
        terms_sorted = sorted(terms, key=lambda t: t['name'].lower())
        
        # Group by first letter
        by_letter = {}
        for term in terms_sorted:
            letter = term['name'][0].upper()
            if letter not in by_letter:
                by_letter[letter] = []
            by_letter[letter].append(term)
        
        # Get all categories for filter UI
        categories = sorted(set(t.get('category', '') for t in terms if t.get('category')))
        
        # Build HTML
        html_parts = []
        
        # Category filter UI
        if categories:
            html_parts.append('<div class="glossary-filters">')
            html_parts.append('  <div class="glossary-categories">')
            html_parts.append('    <span class="filter-label">Filter by category:</span>')
            html_parts.append('    <button class="category-filter-btn active" data-category="all">All</button>')
            for cat in categories:
                cat_id = cat.lower().replace(' ', '-')
                html_parts.append(
                    f'    <button class="category-filter-btn" data-category="{cat_id}">{cat}</button>'
                )
            html_parts.append('  </div>')
            html_parts.append('</div>')
            html_parts.append('')
        
        # Terms by letter
        for letter in sorted(by_letter.keys()):
            html_parts.append(f'<div class="glossary-section" data-letter="{letter}">')
            html_parts.append(f'  <h2 id="{letter}" class="glossary-letter-heading">')
            html_parts.append(f'    {letter}')
            html_parts.append(f'    <a class="headerlink" href="#{letter}" title="Permanent link">¶</a>')
            html_parts.append('  </h2>')
            
            for term in by_letter[letter]:
                term_id = term['name'].lower().replace(' ', '-')
                category = term.get('category', '')
                cat_class = f' data-term-category="{category.lower().replace(" ", "-")}"' if category else ''
                
                html_parts.append(f'  <div class="glossary-entry"{cat_class}>')
                html_parts.append(f'    <h3 id="{term_id}">')
                html_parts.append(f'      {term["name"]}')
                html_parts.append(f'      <a class="headerlink" href="#{term_id}" title="Permanent link">¶</a>')
                html_parts.append('    </h3>')
                
                # Full form for acronyms
                if term.get('full_form'):
                    html_parts.append(f'    <p class="glossary-full-form"><em>{term["full_form"]}</em></p>')
                
                # Definition
                html_parts.append(f'    <p class="glossary-definition">{term["definition"]}</p>')
                
                # Category pill (clickable to filter)
                if category:
                    cat_id = category.lower().replace(' ', '-')
                    html_parts.append(f'    <a href="?category={cat_id}" class="term-category-pill" data-category="{cat_id}">{category}</a>')
                
                html_parts.append('  </div>')
            
            html_parts.append('</div>')
            html_parts.append('')
        
        return '\n'.join(html_parts)
    
    @env.macro
    def glossary_data_json():
        """Generate JSON data for export functionality."""
        config_path = Path(env.project_dir) / 'docs' / 'glossary.toml'
        
        if not config_path.exists():
            return '{}'
        
        with open(config_path, 'rb') as f:
            data = tomli.load(f)
        
        terms = data.get('term', [])
        # Return JSON string for embedding in JavaScript
        import json
        return json.dumps(terms, indent=2)
