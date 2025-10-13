---
title: Python Code Editor
hide:
  - navigation
  - toc
  - footer
template: main.html
---

<style>
/* Force full viewport height hierarchy */
html, body {
    height: 100vh !important;
    max-height: 100vh !important;
    overflow: hidden !important;
}

/* Material theme container overrides - force full height */
.md-container {
    height: 100vh !important;
    display: flex !important;
    flex-direction: column !important;
    padding: 0 !important;
}

.md-main {
    flex: 1 !important;
    min-height: 0 !important;
    display: flex !important;
    flex-direction: column !important;
}

.md-main__inner {
    flex: 1 !important;
    min-height: 0 !important;
    display: flex !important;
    margin: 0 !important;
    padding: 0 !important;
}

.md-content {
    flex: 1 !important;
    min-height: 0 !important;
    display: flex !important;
    flex-direction: column !important;
    position: relative !important;
    max-width: none !important;
    margin: 0 !important;
    padding: 0 !important;
}

.md-content__inner {
    flex: 1 !important;
    min-height: 0 !important;
    display: flex !important;
    flex-direction: column !important;
    margin: 0 !important;
    padding: 0 !important;
}

nav.md-tabs {
    display: none !important;
}

.md-header__button.md-logo {
    display: none !important;
}

.md-header__button.md-icon[for="__drawer"] {
    display: block !important;
}

/* Force article to fill */
.md-content__inner > article {
    flex: 1 !important;
    min-height: 0 !important;
    display: flex !important;
    flex-direction: column !important;
}

.md-grid {
    max-width: none !important;
    margin: 0 !important;
}

/* IDE app fills its container */
#code-editor-app {
    flex: 1 !important;
    min-height: 0 !important;
    display: flex !important;
    flex-direction: column !important;
    margin: 0 !important;
    padding: 0 !important;
}

/* Hide the title */
.md-content h1 {
    display: none !important;
}

/* Hide feedback widget on code editor page */
.md-feedback {
    display: none !important;
}

aside .md-source-file,
a.md-content__button:nth-child(1),
a.md-content__button:nth-child(2) {
    display: none !important;
}

</style>

<div id="code-editor-app">
    <!-- Editor will be initialized by code-editor.js -->
    <div class="editor-loading">
        <div class="loading-spinner"></div>
        <p>Loading Python IDE...</p>
    </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/loader.min.js"></script>
<script src="../assets/code-editor.js"></script>
