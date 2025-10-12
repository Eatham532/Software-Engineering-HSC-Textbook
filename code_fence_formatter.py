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
    
    # Build class list
    class_list = ['highlight', css_class]
    if classes:
        class_list.extend(classes)
    
    # Escape the source code for HTML
    escaped_source = html.escape(source)
    
    # Build the code block with data attributes for JavaScript
    code_attrs = f'class="language-{html.escape(base_lang)}"'
    if id_value:
        code_attrs += f' id="{html.escape(id_value)}"'
    
    # Add custom data attributes for the code runner
    data_attrs = f'data-fence-type="{fence_type}" data-language="{html.escape(base_lang)}"'
    
    # Add any custom attributes from the fence header
    for key, value in attrs.items():
        data_attrs += f' data-{html.escape(key)}="{html.escape(str(value))}"'
    
    # Build the complete HTML structure
    html_output = f'''<div class="{' '.join(class_list)}" {data_attrs}>
<pre><code {code_attrs}>{escaped_source}</code></pre>
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
