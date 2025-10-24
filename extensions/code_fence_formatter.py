"""
Custom fence formatters for code blocks in the NSW HSC Software Engineering Textbook.

This module provides custom fence types for pymdownx.superfences:
- {lang}-exec: Executable code with Run and Open in Editor buttons
- {lang}-template: Template/example code with only Open in Editor button (disabled Run)
- {lang}-error: Error example code with only Open in Editor button (disabled Run)

Supported languages:
- Python: Full execution with Pyodide
- HTML/CSS/JavaScript: Live preview in Web IDE
- Shell/Bash: Read-only reference
- Others: Syntax highlighting only

These formatters integrate with the code runner and IDE features.
"""

import html
import re
from pygments import highlight
from pygments.lexers import get_lexer_by_name, guess_lexer
from pygments.formatters import HtmlFormatter
from pygments.util import ClassNotFound


def _extract_language_from_fence(language):
    """
    Extract the base language and fence type from a fence identifier.
    
    Examples:
        'python-exec' -> ('python', 'exec')
        'javascript-template' -> ('javascript', 'template')
        'bash-error' -> ('bash', 'error')
    
    Args:
        language: The fence language identifier
        
    Returns:
        Tuple of (base_language, fence_type)
    """
    match = re.match(r'(\w+)-(exec|template|error)$', language)
    if match:
        return match.group(1), match.group(2)
    return language, None


def _format_code_fence(source, language, css_class, options, md, **kwargs):
    """
    Format code blocks with appropriate data attributes for the code runner.
    
    This is a generic formatter that handles any language with -exec, -template, or -error suffix.
    
    Args:
        source: The source code content
        language: The language identifier (e.g., python-exec, html-template)
        css_class: CSS class to apply
        options: Custom options from the fence header
        md: Markdown instance
        **kwargs: Additional arguments (classes, id_value, attrs, etc.)
    
    Returns:
        HTML string with formatted code block
    """
    # Extract base language and fence type
    base_lang, fence_type = _extract_language_from_fence(language)
    
    # Extract classes and id from kwargs if present (SuperFences 7.0+)
    classes = kwargs.get('classes', [])
    id_value = kwargs.get('id_value', '')
    attrs = kwargs.get('attrs', {})
    
    # Get syntax highlighting from Pygments
    try:
        lexer = get_lexer_by_name(base_lang)
    except ClassNotFound:
        # Fallback to plain text if language not found
        try:
            lexer = guess_lexer(source)
        except Exception:
            lexer = get_lexer_by_name('text')
    
    # Use Pygments to highlight the code
    # Configure formatter to not wrap in extra divs - we'll add our own wrapper
    formatter = HtmlFormatter(
        noclasses=False,  # Use CSS classes instead of inline styles
        nowrap=True,      # Don't wrap in <div class="highlight"><pre>...</pre></div>
    )
    highlighted_code = highlight(source, lexer, formatter)
    
    # Build class list for outer container
    class_list = ['highlight', css_class]
    if classes:
        class_list.extend(classes)
    
    # Build data attributes for the code runner
    data_attrs = [
        f'data-fence-type="{fence_type}"',
        f'data-language="{html.escape(base_lang)}"'
    ]
    
    # Add any custom attributes from the fence header
    for key, value in attrs.items():
        data_attrs.append(f'data-{html.escape(key)}="{html.escape(str(value))}"')
    
    # Add id if present
    id_attr = f' id="{html.escape(id_value)}"' if id_value else ''
    
    # Build the complete HTML structure
    # Wrap highlighted code in <pre><code> with our custom attributes on the container div
    html_output = f'''<div class="{' '.join(class_list)}" {' '.join(data_attrs)}{id_attr}>
<pre><code class="language-{html.escape(base_lang)}">{highlighted_code}</code></pre>
</div>'''
    
    return html_output


# Generic formatters for any language
def format_exec(source, language, css_class, options, md, **kwargs):
    """Format executable code blocks for any language."""
    return _format_code_fence(source, language, css_class, options, md, **kwargs)


def format_template(source, language, css_class, options, md, **kwargs):
    """Format template code blocks for any language."""
    return _format_code_fence(source, language, css_class, options, md, **kwargs)


def format_error(source, language, css_class, options, md, **kwargs):
    """Format error example code blocks for any language."""
    return _format_code_fence(source, language, css_class, options, md, **kwargs)


# Validator function (optional - accepts all valid attribute-style inputs)
def fence_validator(language, inputs, options, attrs, md):
    """
    Validate custom fence inputs for code blocks.
    
    This validator accepts all inputs and assigns them to attrs for pass-through
    to the HTML element. This allows for custom data attributes and options.
    
    Returns:
        bool: Always True (accepts all valid inputs)
    """
    # All inputs become attributes that can be accessed by the formatter
    for key, value in inputs.items():
        attrs[key] = value
    
    return True
