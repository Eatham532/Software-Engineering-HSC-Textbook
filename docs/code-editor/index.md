---
title: Python Code Editor
hide:
  - navigation
  - toc
  - footer
template: main.html
---

<style>
/* Override Material theme to make editor full-page */
.md-content {
    max-width: none !important;
    margin: 0 !important;
    padding: 0 !important;
}

.md-content__inner {
    margin: 0 !important;
    padding: 0 !important;
}

.md-main__inner {
    margin: 0 !important;
    padding: 0 !important;
}

.md-container {
    padding: 0 !important;
}

.md-grid {
    max-width: none !important;
    margin: 0 !important;
}

/* Hide the title */
.md-content h1 {
    display: none;
}
</style>

<div id="code-editor-app">
    <!-- Editor will be initialized by code-editor.js -->
    <div class="editor-loading">
        <div class="loading-spinner"></div>
        <p>Loading Python IDE...</p>
    </div>
</div>

<link rel="stylesheet" href="{{ base_url }}/assets/code-editor.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/loader.min.js"></script>
<script src="{{ base_url }}/assets/code-editor.js"></script>
