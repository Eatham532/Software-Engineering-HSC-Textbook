"""
Glossary Markdown Extension for MkDocs

Auto-links glossary terms throughout the site with tooltips.
Respects page-level opt-out via frontmatter and excludes code blocks.
"""

import re
import xml.etree.ElementTree as etree
from pathlib import Path
from typing import Dict

try:
    import tomllib as tomli  # Python 3.11+
except ImportError:
    import tomli  # Fallback for older Python

from markdown import Extension
from markdown.inlinepatterns import InlineProcessor


class GlossaryConfig:
    """Loads and caches glossary configuration from TOML file."""
    
    _instance = None
    _terms: Dict[str, dict] = {}
    _pattern_str = None
    
    def __new__(cls, config_path: str = None):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            if config_path:
                cls._instance.load(config_path)
        return cls._instance
    
    def load(self, config_path: str):
        """Load glossary terms from TOML file."""
        path = Path(config_path)
        if not path.exists():
            print(f"⚠️  Glossary config not found: {config_path}")
            return
        
        with open(path, 'rb') as f:
            data = tomli.load(f)
        
        # Build term dictionary with all variants (canonical + aliases)
        term_map = {}
        for term_data in data.get('term', []):
            canonical = term_data['name']
            term_map[canonical.lower()] = {
                'canonical': canonical,
                'definition': term_data['definition'],
                'category': term_data.get('category', ''),
                'full_form': term_data.get('full_form', '')
            }
            
            # Add aliases
            for alias in term_data.get('aliases', []):
                term_map[alias.lower()] = term_map[canonical.lower()]
        
        self._terms = term_map
        self._build_pattern()
        print(f"✓ Glossary loaded: {len(data.get('term', []))} terms, {len(term_map)} total variants")
    
    def _build_pattern(self):
        """Build regex pattern for efficient term matching."""
        if not self._terms:
            self._pattern_str = None
            return
        
        # Sort by length (longest first) to match "Web API" before "API"
        terms = sorted(self._terms.keys(), key=len, reverse=True)
        # Escape special regex characters
        escaped = [re.escape(term) for term in terms]
        # Word boundary pattern
        self._pattern_str = r'\b(' + '|'.join(escaped) + r')\b'
    
    @property
    def terms(self) -> Dict[str, dict]:
        return self._terms
    
    @property
    def pattern(self):
        return self._pattern_str


class GlossaryInlineProcessor(InlineProcessor):
    """Inline processor to wrap glossary terms in spans."""
    
    def __init__(self, pattern, md, config):
        super().__init__(pattern, md)
        self.config_path = config.get('config_path', 'docs/glossary.toml')
        self.enabled = config.get('enabled', True)
        self.glossary_config = GlossaryConfig(self.config_path)
        # Override compiled pattern to be case-insensitive
        self.compiled_re = re.compile(self.pattern, re.IGNORECASE)
    
    def handleMatch(self, m, data):
        if not self.enabled:
            return None, None, None
        
        # Check page meta for opt-out
        if hasattr(self.md, 'Meta'):
            meta_glossary = self.md.Meta.get('glossary', [])
            if meta_glossary and meta_glossary[0] == 'false':
                return None, None, None
        
        term = m.group(1)
        term_lower = term.lower()
        
        if term_lower not in self.glossary_config.terms:
            return None, None, None
        
        term_data = self.glossary_config.terms[term_lower]
        canonical = term_data['canonical']
        
        # Create span element
        span = etree.Element('span')
        span.set('class', 'glossary-term')
        span.set('data-glossary-term', canonical)
        span.set('data-glossary-definition', self._escape_attr(term_data['definition']))
        
        if term_data['category']:
            span.set('data-glossary-category', term_data['category'])
        
        if term_data['full_form']:
            span.set('data-glossary-full-form', term_data['full_form'])
        
        span.text = term
        
        return span, m.start(0), m.end(0)
    
    def _escape_attr(self, text: str) -> str:
        """Escape text for HTML attribute."""
        return text.replace('"', '&quot;').replace("'", '&#39;')


class GlossaryExtension(Extension):
    """MkDocs extension for glossary auto-linking."""
    
    def __init__(self, **kwargs):
        self.config = {
            'enabled': [True, 'Enable glossary auto-linking'],
            'config_path': ['docs/glossary.toml', 'Path to glossary TOML config']
        }
        super().__init__(**kwargs)
    
    def extendMarkdown(self, md):
        # Load config to get pattern
        config_path = self.getConfig('config_path')
        glossary_config = GlossaryConfig(config_path)
        
        if not glossary_config.pattern:
            print("⚠️  No glossary pattern found - terms will not be linked")
            return  # No terms loaded
        
        # Register inline processor
        glossary_processor = GlossaryInlineProcessor(
            glossary_config.pattern,
            md,
            self.getConfigs()
        )
        # Priority 100 - before links (priority 120) but after code (priority 190)
        md.inlinePatterns.register(glossary_processor, 'glossary', 100)
        # print(f"✓ Glossary extension registered with pattern matching {len(glossary_config.terms)} term variants")


def makeExtension(**kwargs):
    return GlossaryExtension(**kwargs)
