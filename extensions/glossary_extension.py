"""
Glossary Markdown Extension for MkDocs

Auto-links glossary terms throughout the site with tooltips.
Respects page-level opt-out via frontmatter and excludes code blocks.
"""

import re
import xml.etree.ElementTree as etree
from pathlib import Path
from typing import Dict, List, Optional, Union

try:
    import tomllib as tomli  # Python 3.11+
except ImportError:  # pragma: no cover - fallback for older Python
    import tomli  # type: ignore[import-any]

from markdown import Extension
from markdown.treeprocessors import Treeprocessor


class GlossaryConfig:
    """Loads and caches glossary configuration from TOML file."""
    
    _instance = None
    _terms: Dict[str, dict] = {}
    _pattern_str = None
    
    def __new__(cls, config_path: Optional[str] = None):
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


class GlossaryTreeprocessor(Treeprocessor):
    """Treeprocessor that wraps glossary terms while skipping code/diagram blocks."""

    _SKIP_TAGS = {"code", "pre", "kbd", "samp", "script", "style", "svg", "h1", "title"}
    _SKIP_CLASS_KEYS = {
        "glossary-term",
        "no-glossary",
        "diagram-content",
        "diagram-container",
        "tabbed-labels",
        "md-nav__title",
        "md-nav__link",
        "md-nav__list"
    }

    def __init__(self, md, glossary_config: GlossaryConfig, config: Dict[str, Union[str, bool]]):
        super().__init__(md)
        self.glossary_config = glossary_config
        self.enabled = config.get('enabled', True)
        self.pattern_str = glossary_config.pattern
        self.pattern = re.compile(self.pattern_str, re.IGNORECASE) if self.pattern_str else None
        self.config = config

    def run(self, root):
        if not self.enabled or not self.pattern:
            return

        # Check page-level opt-out via metadata
        meta = getattr(self.md, 'Meta', None)
        if isinstance(meta, dict):
            meta_glossary = meta.get('glossary', [])
            if meta_glossary and meta_glossary[0] == 'false':
                return

        self._process_element(root, parent=None, in_code_block=False)

    def _process_element(self, element, parent, in_code_block):
        # Check if this element is a code block or we're already inside one
        is_code_element = self._is_code_block(element)
        in_code = in_code_block or is_code_element
        
        if self._should_skip_element(element, in_code):
            return

        # Process element text only if not in code block
        if not in_code:
            self._process_text_node(element, parent, is_text=True)

        # Recursively process children
        for child in list(element):
            self._process_element(child, parent=element, in_code_block=in_code)
            # Process tail text after child only if not in code block
            if not in_code:
                self._process_text_node(child, parent=element, is_text=False)
    
    def _is_code_block(self, element) -> bool:
        """Check if element is a code block (pre, code, or has code-related attributes)."""
        tag = element.tag.lower() if hasattr(element.tag, 'lower') else element.tag
        
        # Direct code/pre tags
        if tag in {'code', 'pre', 'kbd', 'samp'}:
            return True
        
        # Divs with code-related classes (fenced code blocks)
        classes = element.get('class') or ''
        if classes:
            class_list = classes.split()
            # Any class starting with 'highlight', 'language-', 'codehilite'
            if any(cls.startswith(('highlight', 'language-', 'codehilite')) for cls in class_list):
                return True
        
        return False

    def _should_skip_element(self, element, in_code_block) -> bool:
        """Determine if element should be skipped for glossary processing."""
        # Skip if we're in a code block
        if in_code_block:
            return True
        
        tag = element.tag.lower() if hasattr(element.tag, 'lower') else element.tag
        if tag in self._SKIP_TAGS:
            return True

        classes = element.get('class') or ''
        if classes:
            class_list = classes.split()
            if any(cls in self._SKIP_CLASS_KEYS for cls in class_list):
                return True

        if element.get('data-glossary-skip') == 'true':
            return True

        return False

    def _process_text_node(self, element, parent, is_text: bool):
        pattern = self.pattern
        if pattern is None:
            return

        text = element.text if is_text else element.tail
        if not text:
            return

        matches = list(pattern.finditer(text))
        if not matches:
            return

        parts: List[Union[str, etree.Element]] = []
        last_index = 0
        for match in matches:
            start, end = match.start(), match.end()
            if start > last_index:
                parts.append(text[last_index:start])

            term = match.group(0)
            term_data = self.glossary_config.terms.get(term.lower())
            if not term_data:
                parts.append(term)
            else:
                parts.append(self._build_span(term, term_data))

            last_index = end

        if last_index < len(text):
            parts.append(text[last_index:])

        if is_text:
            self._apply_to_text(element, parts)
        else:
            self._apply_to_tail(element, parent, parts)

    def _apply_to_text(self, element, parts: List[Union[str, etree.Element]]):
        if not parts:
            return

        iterator = iter(parts)
        first = next(iterator)

        if isinstance(first, str):
            element.text = first
            prev_elem: Optional[etree.Element] = None
        else:
            element.text = ''
            element.insert(0, first)
            prev_elem = first

        for part in iterator:
            if isinstance(part, str):
                if prev_elem is None:
                    element.text = (element.text or '') + part
                else:
                    prev_elem.tail = (prev_elem.tail or '') + part
            else:
                insert_index = list(element).index(prev_elem) + 1 if prev_elem is not None else len(element)
                element.insert(insert_index, part)
                prev_elem = part

    def _apply_to_tail(self, element, parent, parts: List[Union[str, etree.Element]]):
        if parent is None or not parts:
            return

        iterator = iter(parts)
        first = next(iterator)

        if isinstance(first, str):
            element.tail = first
            prev_elem: Union[etree.Element, str] = 'SENTINEL'
        else:
            element.tail = ''
            insert_index = list(parent).index(element) + 1
            parent.insert(insert_index, first)
            prev_elem = first

        for part in iterator:
            if isinstance(part, str):
                if isinstance(prev_elem, etree.Element):
                    prev_elem.tail = (prev_elem.tail or '') + part
                else:
                    element.tail = (element.tail or '') + part
            else:
                if isinstance(prev_elem, etree.Element):
                    insert_index = list(parent).index(prev_elem) + 1
                else:
                    insert_index = list(parent).index(element) + 1
                parent.insert(insert_index, part)
                prev_elem = part

    def _build_span(self, term: str, term_data: Dict[str, str]) -> etree.Element:
        span = etree.Element('span')
        span.set('class', 'glossary-term')
        span.set('data-glossary-term', term_data['canonical'])
        span.set('data-glossary-definition', self._escape_attr(term_data['definition']))

        if term_data.get('category'):
            span.set('data-glossary-category', term_data['category'])

        if term_data.get('full_form'):
            span.set('data-glossary-full-form', term_data['full_form'])

        span.text = term
        return span

    @staticmethod
    def _escape_attr(text: str) -> str:
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
        
        glossary_processor = GlossaryTreeprocessor(md, glossary_config, self.getConfigs())
        # Register before typographic post-processing but after reference resolution
        md.treeprocessors.register(glossary_processor, 'glossary', 15)


def makeExtension(**kwargs):
    return GlossaryExtension(**kwargs)
