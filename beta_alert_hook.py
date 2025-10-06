"""Beta banner hook (now effectively disabled).

Header-based banner is rendered by `overrides/main.html`. This hook returns
content unchanged to avoid duplicate in-page banners. Kept for fallback if the
override is removed later.
"""

def on_page_content(html, page, config, files):  # noqa: D401
    return html
