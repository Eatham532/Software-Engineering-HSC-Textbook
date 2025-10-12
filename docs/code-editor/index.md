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

/* Hide feedback widget on code editor page */
.md-feedback {
    display: none !important;
}

aside .md-source-file,
a.md-content__button:nth-child(1),
a.md-content__button:nth-child(2) {
    display: none !important;
}

/* Ensure code editor doesn't overlap navbar */
#code-editor-app {
    margin-top: 0;
    z-index: 1;
}

/* When page is a smaller screen */
@media (max-width: 768px) {
    #code-editor-app {
        margin-top: 0px;
    }
}

@media screen and (min-width: 76.2344em) {
    #code-editor-app {
        margin-top: 36px; /* Height of navbar */
    }
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
