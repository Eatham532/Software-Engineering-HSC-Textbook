---
title: Glossary
glossary: false
hide:

  - navigation

  - toc

  - footer
---

<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
  <p style="margin: 0;">A comprehensive reference of technical terms used throughout the NSW HSC Software Engineering course.</p>
  <button id="glossary-export-pdf" class="md-button" style="flex-shrink: 0; margin-left: 1rem;">Download as PDF</button>
</div>

{{ generate_glossary() }}

<script>
// Embed glossary data for export
window.glossaryData = {{ glossary_data_json() }};
</script>

<style>
    a.md-content__button {
        display: none;
    }

    /* Add horizontal padding on wider screens */
    @media (min-width: 769px) {
        .md-content__inner {
            max-width: 1200px;
            margin: 0 auto;
            padding-left: 4rem;
            padding-right: 4rem;
        }
    }

    /* Ensure content doesn't get hidden behind mobile nav */
    @media (max-width: 768px) {
        .md-content__inner {
            padding-bottom: 100px !important;
        }
    }
</style>
