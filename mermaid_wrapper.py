"""MkDocs/Python-Markdown postprocessor to wrap mermaid code blocks and kroki SVGs with a container and expand button.

This runs during the markdown -> HTML conversion and replaces:
1. Mermaid: <pre class="mermaid">...</pre> or <pre><code class="language-mermaid">...</code></pre>
2. Kroki: <p><svg ... id="Kroki" or data-diagram-type="...">...</svg></p>

with:

<div class="diagram-container">
  <button class="diagram-expand-btn" onclick="openDiagramModal('diagram-N')">🔍 View Larger</button>
  <div id="diagram-N" class="diagram-content">
    (original content)
  </div>
</div>

The wrapper is idempotent: if content is already inside a .diagram-container it will be left alone.
"""
from __future__ import annotations

import re
from typing import Match

from markdown.postprocessors import Postprocessor
from markdown.extensions import Extension


class MermaidWrapperPostprocessor(Postprocessor):
    def __init__(self, md, start_id: int = 0):
        super().__init__(md)
        self.counter = start_id

    def run(self, text: str) -> str:
        # First, handle Mermaid pre blocks
        text = self._wrap_mermaid_blocks(text)
        # Then, handle Kroki SVGs
        text = self._wrap_kroki_svgs(text)
        return text

    def _wrap_mermaid_blocks(self, text: str) -> str:
        # Find all <pre ...>...</pre> blocks and wrap those that look like mermaid blocks.
        pattern = re.compile(r"(?P<pre><pre\b[^>]*?>.*?</pre>)", re.DOTALL | re.IGNORECASE)

        out_parts = []
        last_end = 0

        for m in pattern.finditer(text):
            pre_html = m.group('pre')
            start, end = m.span('pre')

            # Quick checks whether this pre contains mermaid markers.
            low = pre_html.lower()
            is_mermaid = (
                'class="mermaid"' in low
                or "class='mermaid'" in low
                or 'class="language-mermaid"' in low
                or "class='language-mermaid'" in low
                or 'class=mermaid' in low
                or 'language-mermaid' in low
            )

            # Also skip if already inside a diagram-container (idempotent)
            already_wrapped = 'class="diagram-container"' in text[max(0, start-120):start].lower()

            out_parts.append(text[last_end:start])

            if is_mermaid and not already_wrapped:
                diagram_id = f"diagram-{self.counter}"
                self.counter += 1

                wrapped = (
                    f"<div class=\"diagram-container\">"
                    f"<button class=\"diagram-expand-btn\" onclick=\"openDiagramModal('{diagram_id}')\">View Larger</button>"
                    f"<div id=\"{diagram_id}\" class=\"diagram-content\">{pre_html}</div>"
                    f"</div>"
                )
                out_parts.append(wrapped)
            else:
                out_parts.append(pre_html)

            last_end = end

        out_parts.append(text[last_end:])
        return ''.join(out_parts)

    def _wrap_kroki_svgs(self, text: str) -> str:
        # Find SVGs that look like Kroki diagrams and wrap them
        # Look for <p><svg ... id="Kroki" or data-diagram-type="...">...</svg></p>
        pattern = re.compile(
            r'<p>(\s*<svg[^>]*(?:id="Kroki"|data-diagram-type="[^"]*")[^>]*>.*?</svg>\s*)</p>',
            re.DOTALL | re.IGNORECASE
        )

        def replace_kroki_svg(match: Match) -> str:
            svg_content = match.group(1).strip()
            
            # Check if already wrapped (idempotent)
            start_pos = max(0, match.start() - 200)
            before_context = text[start_pos:match.start()]
            if 'class="diagram-container"' in before_context.lower():
                return match.group(0)  # Return original if already wrapped
            
            diagram_id = f"diagram-{self.counter}"
            self.counter += 1

            wrapped = (
                f'<div class="diagram-container">'
                f'<button class="diagram-expand-btn" onclick="openDiagramModal(\'{diagram_id}\')">View Larger</button>'
                f'<div id="{diagram_id}" class="diagram-content">'
                f'<p>{svg_content}</p>'
                f'</div>'
                f'</div>'
            )
            return wrapped

        return pattern.sub(replace_kroki_svg, text)


class MermaidWrapperExtension(Extension):
    def __init__(self, **kwargs):
        self.config = {}
        super().__init__(**kwargs)

    def extendMarkdown(self, md):
        # Insert the postprocessor late in the pipeline, but after kroki
        md.postprocessors.register(MermaidWrapperPostprocessor(md), 'mermaid_wrapper', 5)


def makeExtension(**kwargs):
    return MermaidWrapperExtension(**kwargs)
