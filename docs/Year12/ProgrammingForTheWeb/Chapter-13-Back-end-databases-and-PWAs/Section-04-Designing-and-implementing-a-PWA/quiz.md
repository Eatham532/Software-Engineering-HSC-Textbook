# 13.4 Designing and implementing a PWA - Quiz

<div class="quiz-container">

1. **What is the primary purpose of a Service Worker in a PWA?**
   <div class="quiz-choices">
   a) To style the application interface
   b) To act as a proxy between the web app and the network
   c) To manage database connections
   d) To handle user authentication
   </div>
   <div class="quiz-answer">b) To act as a proxy between the web app and the network</div>
   <div class="quiz-explanation">Service Workers act as programmable network proxies, enabling offline functionality, background sync, push notifications, and caching strategies by intercepting network requests and responses.</div>

2. **Which manifest property is required for a PWA to be installable?**
   <div class="quiz-choices">
   a) theme_color
   b) background_color
   c) start_url
   d) orientation
   </div>
   <div class="quiz-answer">c) start_url</div>
   <div class="quiz-explanation">The start_url property in the web app manifest defines where the PWA should start when launched, making it essential for installation. Other properties like theme_color and background_color enhance the experience but aren't required for installability.</div>

3. **What caching strategy serves cached content first, then updates in the background?**
   <div class="quiz-choices">
   a) Network-first
   b) Cache-first (stale-while-revalidate)
   c) Network-only
   d) Cache-only
   </div>
   <div class="quiz-answer">b) Cache-first (stale-while-revalidate)</div>
   <div class="quiz-explanation">The cache-first or stale-while-revalidate strategy serves cached content immediately for fast response times, then updates the cache in the background with fresh content from the network.</div>

4. **Which event allows a PWA to handle installation prompts?**
   <div class="quiz-choices">
   a) appinstalled
   b) beforeinstallprompt
   c) serviceWorkerRegistered
   d) manifestready
   </div>
   <div class="quiz-answer">b) beforeinstallprompt</div>
   <div class="quiz-explanation">The beforeinstallprompt event fires when the browser determines the PWA meets installation criteria, allowing developers to customize the installation experience and show their own install prompts.</div>

5. **What is background sync used for in PWAs?**
   <div class="quiz-choices">
   a) Updating the user interface automatically
   b) Synchronizing data when connectivity is restored
   c) Managing memory usage
   d) Optimizing image loading
   </div>
   <div class="quiz-answer">b) Synchronizing data when connectivity is restored</div>
   <div class="quiz-explanation">Background sync allows PWAs to defer actions until connectivity is restored, ensuring that user data (like form submissions or offline actions) is synchronized with the server when the network becomes available.</div>

6. **Which CSS property helps PWAs adapt to device notches and safe areas?**
   <div class="quiz-choices">
   a) margin-top
   b) padding-top
   c) env(safe-area-inset-top)
   d) viewport-top
   </div>
   <div class="quiz-answer">c) env(safe-area-inset-top)</div>
   <div class="quiz-explanation">The env() CSS function with safe-area-inset values provides information about device-specific safe areas, allowing PWAs to properly layout content around notches, home indicators, and other device UI elements.</div>

7. **What is the recommended approach for handling conflicts during data synchronization?**
   <div class="quiz-choices">
   a) Always use server data
   b) Always use client data
   c) Implement a conflict resolution strategy based on timestamps or user preferences
   d) Merge all conflicting data automatically
   </div>
   <div class="quiz-answer">c) Implement a conflict resolution strategy based on timestamps or user preferences</div>
   <div class="quiz-explanation">Effective conflict resolution requires a strategy that considers the specific use case, such as using timestamps for most recent data, allowing user choice, or implementing custom merge logic based on the data type and business requirements.</div>

8. **Which display mode makes a PWA appear most like a native app?**
   <div class="quiz-choices">
   a) browser
   b) minimal-ui
   c) standalone
   d) fullscreen
   </div>
   <div class="quiz-answer">c) standalone</div>
   <div class="quiz-explanation">The standalone display mode hides browser UI elements while keeping the status bar, making the PWA look and feel like a native app while maintaining essential system information visibility.</div>

9. **What accessibility consideration is most important for PWA keyboard navigation?**
   <div class="quiz-choices">
   a) Adding colorful focus indicators
   b) Implementing logical tab order and focus management
   c) Using only mouse interactions
   d) Hiding interactive elements
   </div>
   <div class="quiz-answer">b) Implementing logical tab order and focus management</div>
   <div class="quiz-explanation">Proper keyboard navigation requires logical tab order, visible focus indicators, focus trapping in modals, and programmatic focus management to ensure all functionality is accessible to users who rely on keyboard navigation.</div>

10. **Which strategy is best for caching API responses in a PWA?**
    <div class="quiz-choices">
    a) Cache all API responses permanently
    b) Never cache API responses
    c) Use network-first with cache fallback for dynamic data
    d) Cache only GET requests for static data
    </div>
    <div class="quiz-answer">c) Use network-first with cache fallback for dynamic data</div>
    <div class="quiz-explanation">Network-first strategy attempts to fetch fresh data from the network first, falling back to cached data when offline. This ensures users get the most current data when connected while maintaining functionality during offline periods.</div>

</div>
