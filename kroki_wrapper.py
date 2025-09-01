"""MkDocs/Python-Markdown postprocessor to wrap Kroki SVGs with a container and expand button.

This runs after the kroki plugin has converted PlantUML code blocks to inline SVGs
and wraps them with the diagram container for modal functionality.
"""
from __future__ import annotations

import re
from typing import Match

from markdown.postprocessors import Postprocessor
from markdown.extensions import Extension


class KrokiWrapperPostprocessor(Postprocessor):
    def __init__(self, md, start_id: int = 0):
        super().__init__(md)
        self.counter = start_id

    def run(self, text: str) -> str:
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
                f'<button class="diagram-expand-btn" onclick="openDiagramModal(\'{diagram_id}\')">🔍 View Larger</button>'
                f'<div id="{diagram_id}" class="diagram-content">'
                f'<p>{svg_content}</p>'
                f'</div>'
                f'</div>'
            )
            return wrapped

        return pattern.sub(replace_kroki_svg, text)


class KrokiWrapperExtension(Extension):
    def __init__(self, **kwargs):
        self.config = {}
        super().__init__(**kwargs)

    def extendMarkdown(self, md):
        # Insert the postprocessor very late in the pipeline, after kroki
        md.postprocessors.register(KrokiWrapperPostprocessor(md), 'kroki_wrapper', 10)


def makeExtension(**kwargs):
    return KrokiWrapperExtension(**kwargs)
