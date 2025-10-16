---
title: "13.04 Designing And Implementing A Pwa - Quiz"
---

# 13.04 Designing And Implementing A Pwa - Quiz

!!! quiz "Check your understanding"

    1. What is the primary purpose of a Service Worker in a PWA?

        - To style the application interface
        - To act as a proxy between the web app and the network { data-correct }
        - To manage database connections
        - To handle user authentication

    2. Which manifest property is required for a PWA to be installable?

        - theme_color
        - background_color
        - start_url { data-correct }
        - orientation

    3. What caching strategy serves cached content first, then updates in the background?

        - Network-first
        - Cache-first (stale-while-revalidate) { data-correct }
        - Network-only
        - Cache-only

    4. Which event allows a PWA to handle installation prompts?

        - appinstalled
        - beforeinstallprompt { data-correct }
        - serviceWorkerRegistered
        - manifestready

    5. What is background sync used for in PWAs?

        - Updating the user interface automatically
        - Synchronizing data when connectivity is restored { data-correct }
        - Managing memory usage
        - Optimizing image loading

    6. Which CSS property helps PWAs adapt to device notches and safe areas?

        - margin-top
        - padding-top
        - env(safe-area-inset-top) { data-correct }
        - viewport-top

    7. What is the recommended approach for handling conflicts during data synchronization?

        - Always use server data
        - Always use client data
        - Implement a conflict resolution strategy based on timestamps or user preferences { data-correct }
        - Merge all conflicting data automatically

    8. Which display mode makes a PWA appear most like a native app?

        - browser
        - minimal-ui
        - standalone { data-correct }
        - fullscreen

    9. What accessibility consideration is most important for PWA keyboard navigation?

        - Adding colorful focus indicators
        - Implementing logical tab order and focus management { data-correct }
        - Using only mouse interactions
        - Hiding interactive elements

    10. Which strategy is best for caching API responses in a PWA?

        - Cache all API responses permanently
        - Never cache API responses
        - Use network-first with cache fallback for dynamic data { data-correct }
        - Cache only GET requests for static data
