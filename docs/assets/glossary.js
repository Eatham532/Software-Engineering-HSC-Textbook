/**
 * Glossary Tooltip and Navigation System
 * Handles term tooltips (desktop hover, mobile tap tray), wave navigation, and category filtering.
 */

(function() {
  'use strict';

  // ============================================================================
  // TOOLTIP SYSTEM (Desktop: hover, Mobile: tap for tray)
  // ============================================================================
  
  let tooltipEl = null;
  let mobileTray = null;
  let currentTerm = null;
  const isMobile = () => window.innerWidth <= 768;

  function initTooltips() {
    // Desktop tooltip
    tooltipEl = document.createElement('div');
    tooltipEl.className = 'glossary-tooltip';
    tooltipEl.innerHTML = `
      <div class="glossary-tooltip-content">
        <div class="glossary-tooltip-term"></div>
        <div class="glossary-tooltip-full-form"></div>
        <div class="glossary-tooltip-definition"></div>
        <div class="glossary-tooltip-category"></div>
      </div>
    `;
    document.body.appendChild(tooltipEl);

    // Add hover listeners to tooltip itself to keep it visible
    tooltipEl.addEventListener('mouseenter', () => {
      if (hideTooltipTimeout) {
        clearTimeout(hideTooltipTimeout);
        hideTooltipTimeout = null;
      }
    });
    
    tooltipEl.addEventListener('mouseleave', () => {
      hideTooltipTimeout = setTimeout(() => {
        hideTooltip();
      }, 200);
    });

    // Mobile tray
    mobileTray = document.createElement('div');
    mobileTray.className = 'glossary-mobile-tray';
    mobileTray.innerHTML = `
      <div class="mobile-tray-handle"></div>
      <div class="mobile-tray-content">
        <button class="mobile-tray-close">&times;</button>
        <div class="mobile-tray-term"></div>
        <div class="mobile-tray-full-form"></div>
        <div class="mobile-tray-definition"></div>
        <div class="mobile-tray-category"></div>
      </div>
    `;
    document.body.appendChild(mobileTray);

    // Close button
    mobileTray.querySelector('.mobile-tray-close').addEventListener('click', hideMobileTray);

    // Attach event listeners
    if (isMobile()) {
      document.addEventListener('click', handleTermClick);
    } else {
      document.addEventListener('mouseover', handleTermHover);
      document.addEventListener('mouseout', handleTermLeave);
    }

    // Re-init on resize
    window.addEventListener('resize', debounce(() => {
      location.reload(); // Simple approach: reload on resize to re-init
    }, 300));
  }

  let hideTooltipTimeout = null;

  function handleTermHover(e) {
    const term = e.target.closest('.glossary-term');
    if (!term) return;

    // Clear any pending hide timeout
    if (hideTooltipTimeout) {
      clearTimeout(hideTooltipTimeout);
      hideTooltipTimeout = null;
    }

    currentTerm = term;
    showTooltip(term);
  }

  function handleTermLeave(e) {
    const term = e.target.closest('.glossary-term');
    if (!term) return;

    // Delay hiding to allow moving to tooltip
    hideTooltipTimeout = setTimeout(() => {
      hideTooltip();
    }, 200); // 200ms delay
  }

  function handleTermClick(e) {
    const term = e.target.closest('.glossary-term');
    if (term) {
      e.preventDefault();
      showMobileTray(term);
    }
  }

  function showTooltip(term) {
    const termName = term.dataset.glossaryTerm;
    const definition = term.dataset.glossaryDefinition;
    const category = term.dataset.glossaryCategory || '';
    const fullForm = term.dataset.glossaryFullForm || '';

    tooltipEl.querySelector('.glossary-tooltip-term').textContent = termName;
    tooltipEl.querySelector('.glossary-tooltip-definition').textContent = definition;
    
    const fullFormEl = tooltipEl.querySelector('.glossary-tooltip-full-form');
    if (fullForm) {
      fullFormEl.textContent = fullForm;
      fullFormEl.style.display = 'block';
    } else {
      fullFormEl.style.display = 'none';
    }

    const categoryEl = tooltipEl.querySelector('.glossary-tooltip-category');
    if (category) {
      categoryEl.innerHTML = `<span class="category-badge">${category}</span>`;
      categoryEl.style.display = 'block';
    } else {
      categoryEl.style.display = 'none';
    }

    positionTooltip(term);
    tooltipEl.classList.add('visible');
  }

  function hideTooltip() {
    tooltipEl.classList.remove('visible');
    currentTerm = null;
  }

  function positionTooltip(term) {
    const rect = term.getBoundingClientRect();
    const tooltipRect = tooltipEl.getBoundingClientRect();
    
    let top = rect.bottom + window.scrollY + 8;
    let left = rect.left + window.scrollX;

    if (left + tooltipRect.width > window.innerWidth) {
      left = window.innerWidth - tooltipRect.width - 16;
    }

    if (top + tooltipRect.height > window.innerHeight + window.scrollY) {
      top = rect.top + window.scrollY - tooltipRect.height - 8;
    }

    tooltipEl.style.top = `${top}px`;
    tooltipEl.style.left = `${left}px`;
  }

  function showMobileTray(term) {
    const termName = term.dataset.glossaryTerm;
    const definition = term.dataset.glossaryDefinition;
    const category = term.dataset.glossaryCategory || '';
    const fullForm = term.dataset.glossaryFullForm || '';

    mobileTray.querySelector('.mobile-tray-term').textContent = termName;
    mobileTray.querySelector('.mobile-tray-definition').textContent = definition;
    
    const fullFormEl = mobileTray.querySelector('.mobile-tray-full-form');
    if (fullForm) {
      fullFormEl.textContent = fullForm;
      fullFormEl.style.display = 'block';
    } else {
      fullFormEl.style.display = 'none';
    }

    const categoryEl = mobileTray.querySelector('.mobile-tray-category');
    if (category) {
      categoryEl.innerHTML = `<span class="category-badge">${category}</span>`;
      categoryEl.style.display = 'block';
    } else {
      categoryEl.style.display = 'none';
    }

    mobileTray.classList.add('visible');
  }

  function hideMobileTray() {
    mobileTray.classList.remove('visible');
  }

  // ============================================================================
  // WAVE NAVIGATION (Desktop)
  // ============================================================================

  function initGlossaryNav() {
    if (!document.querySelector('.glossary-section')) return;

    const toc = document.querySelector('.md-sidebar--secondary');
    if (toc) toc.style.display = 'none';

    if (isMobile()) {
      buildMobileNav();
    } else {
      buildWaveNav();
    }

    // Re-init on resize
    window.addEventListener('resize', debounce(() => {
      const nav = document.querySelector('.glossary-vertical-nav');
      const mobileNav = document.querySelector('.glossary-mobile-nav');
      
      if (isMobile() && nav) {
        nav.remove();
        if (!mobileNav) buildMobileNav();
      } else if (!isMobile() && mobileNav) {
        mobileNav.remove();
        if (!nav) buildWaveNav();
      }
    }, 300));
  }

  function buildWaveNav() {
    const sections = Array.from(document.querySelectorAll('.glossary-section'));
    if (!sections.length) return;

    const nav = document.createElement('div');
    nav.className = 'glossary-vertical-nav';
    
    // Hover circle
    const hoverCircle = document.createElement('div');
    hoverCircle.className = 'nav-hover-circle';
    hoverCircle.innerHTML = '<span class="hover-letter"></span>';
    nav.appendChild(hoverCircle);
    
    // Calculate proportional spacing
    const totalTerms = document.querySelectorAll('.glossary-entry').length;
    const avgTermsPerLetter = totalTerms / sections.length;
    
    let allDots = [];
    sections.forEach((section) => {
      const letter = section.dataset.letter;
      const termsCount = section.querySelectorAll('.glossary-entry').length;
      const dotCount = Math.max(1, Math.round((termsCount / avgTermsPerLetter) * 3));

      for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement('div');
        dot.className = 'nav-dot';
        dot.dataset.letter = letter;
        
        // Prevent dots from being dragged like images
        dot.addEventListener('dragstart', (e) => e.preventDefault());
        dot.addEventListener('drag', (e) => e.preventDefault());
        
        nav.appendChild(dot);
        allDots.push({ el: dot, letter });
      }
    });

    document.body.appendChild(nav);

    let isDragging = false;
    let lastMouseY = 0;

    // Mouse tracking for wave effect
    nav.addEventListener('mousemove', (e) => {
      lastMouseY = e.clientY;
      updateWaveEffect(nav, allDots, e.clientY);
      showHoverCircle(nav, e, getLetterAtPosition(allDots, e.clientY, nav));
    });

    nav.addEventListener('mouseleave', () => {
      resetWaveEffect(allDots);
      hideHoverCircle(nav);
    });

    nav.addEventListener('mousedown', (e) => {
      // Check if click is within the nav area (including wider hover zone)
      isDragging = true;
      nav.classList.add('dragging');
      
      // Find the letter at the clicked position
      const letter = getLetterAtPosition(allDots, e.clientY, nav);
      if (letter) {
        scrollToLetter(letter);
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        // Find letter at current position during drag
        const nav = document.querySelector('.glossary-vertical-nav');
        if (nav) {
          const letter = getLetterAtPosition(allDots, e.clientY, nav);
          if (letter) {
            scrollToLetter(letter);
          }
        }
      }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
      nav.classList.remove('dragging');
    });

    nav.addEventListener('click', (e) => {
      // Click anywhere in the nav area (including wider hover zone)
      const letter = getLetterAtPosition(allDots, e.clientY, nav);
      if (letter) {
        scrollToLetter(letter);
      }
    });

    // Scroll highlighting
    updateActiveNavOnScroll(allDots);
    window.addEventListener('scroll', () => updateActiveNavOnScroll(allDots), { passive: true });
  }

  function updateWaveEffect(nav, dots, mouseY) {
    const navRect = nav.getBoundingClientRect();
    const relativeY = mouseY - navRect.top;

    dots.forEach(({ el }) => {
      const dotRect = el.getBoundingClientRect();
      const dotY = dotRect.top + dotRect.height / 2 - navRect.top;
      const distance = Math.abs(relativeY - dotY);
      
      // Wave effect: closer = larger, max scale 2.5, min scale 0.6
      const maxDistance = 100;
      const scale = distance < maxDistance 
        ? 0.6 + (1.9 * (1 - distance / maxDistance))
        : 0.6;
      
      el.style.transform = `scale(${scale})`;
      el.style.opacity = distance < maxDistance ? 1 : 0.4;
    });
  }

  function resetWaveEffect(dots) {
    dots.forEach(({ el }) => {
      el.style.transform = 'scale(1)';
      el.style.opacity = '0.4';
    });
  }

  function getLetterAtPosition(dots, mouseY, nav) {
    const navRect = nav.getBoundingClientRect();
    const relativeY = mouseY - navRect.top;

    for (const { el, letter } of dots) {
      const dotRect = el.getBoundingClientRect();
      const dotY = dotRect.top + dotRect.height / 2 - navRect.top;
      if (Math.abs(relativeY - dotY) < 20) {
        return letter;
      }
    }
    return null;
  }

  function showHoverCircle(nav, event, letter) {
    if (!letter) return;

    const circle = nav.querySelector('.nav-hover-circle');
    const letterSpan = circle.querySelector('.hover-letter');
    
    letterSpan.textContent = letter;
    circle.classList.add('visible');
    circle.classList.remove('scroll-active'); // Remove scroll-active when hovering
    
    // Position at mouse
    const navRect = nav.getBoundingClientRect();
    const y = event.clientY - navRect.top;
    circle.style.top = `${y}px`;
  }

  function hideHoverCircle(nav) {
    const circle = nav.querySelector('.nav-hover-circle');
    // Only hide if not in scroll-active mode
    if (!circle.classList.contains('scroll-active')) {
      circle.classList.remove('visible');
    }
  }

  function updateActiveNavOnScroll(dots) {
    const sections = Array.from(document.querySelectorAll('.glossary-section'));
    let currentLetter = null;

    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 100 && rect.bottom > 100) {
        currentLetter = section.dataset.letter;
        break;
      }
    }

    dots.forEach(({ el, letter }) => {
      el.classList.toggle('active', letter === currentLetter);
    });

    // Issue #4: Show hover circle with current letter when scrolling
    if (currentLetter) {
      const nav = document.querySelector('.glossary-vertical-nav');
      if (nav) {
        const circle = nav.querySelector('.nav-hover-circle');
        const letterSpan = circle.querySelector('.hover-letter');
        
        letterSpan.textContent = currentLetter;
        circle.classList.add('visible', 'scroll-active');
        
        // Position at the active dot
        const activeDot = dots.find(d => d.letter === currentLetter && d.el.classList.contains('active'));
        if (activeDot) {
          const navRect = nav.getBoundingClientRect();
          const dotRect = activeDot.el.getBoundingClientRect();
          const y = dotRect.top + dotRect.height / 2 - navRect.top;
          circle.style.top = `${y}px`;
        }
      }
    }
  }

  function scrollToLetter(letter) {
    const section = document.querySelector(`.glossary-section[data-letter="${letter}"]`);
    if (section) {
      // Check if this is the first section - if so, scroll to top of page
      const firstSection = document.querySelector('.glossary-section');
      if (section === firstSection) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  // ============================================================================
  // MOBILE NAVIGATION (Swipeable horizontal slider)
  // ============================================================================

  function buildMobileNav() {
    const sections = Array.from(document.querySelectorAll('.glossary-section'));
    if (!sections.length) return;

    const navContainer = document.createElement('div');
    navContainer.className = 'glossary-mobile-nav';

    const track = document.createElement('div');
    track.className = 'mobile-nav-track';

    // Hover circle
    const hoverCircle = document.createElement('div');
    hoverCircle.className = 'mobile-hover-circle';
    hoverCircle.innerHTML = '<span class="hover-letter"></span>';
    navContainer.appendChild(hoverCircle);

    const allDots = [];
    sections.forEach(section => {
      const letter = section.dataset.letter;
      
      const dot = document.createElement('div');
      dot.className = 'mobile-nav-dot';
      dot.dataset.letter = letter;
      
      // Prevent dots from being dragged like images
      dot.addEventListener('dragstart', (e) => e.preventDefault());
      dot.addEventListener('drag', (e) => e.preventDefault());
      
      track.appendChild(dot);
      allDots.push({ el: dot, letter });
    });

    navContainer.appendChild(track);
    document.body.appendChild(navContainer);

    // Swipe/drag handling - work on entire track area
    let isDragging = false;
    let startX = 0;

    // Add click handler to entire track
    track.addEventListener('click', (e) => {
      const trackRect = track.getBoundingClientRect();
      const trackStart = trackRect.left;
      const trackWidth = trackRect.width;
      const relativeX = Math.max(0, Math.min(trackWidth, e.clientX - trackStart));
      const progress = relativeX / trackWidth;
      const letterIndex = Math.floor(progress * allDots.length);
      const clampedIndex = Math.max(0, Math.min(allDots.length - 1, letterIndex));
      
      const targetDot = allDots[clampedIndex];
      if (targetDot) {
        scrollToLetter(targetDot.letter);
      }
    });

    track.addEventListener('touchstart', (e) => {
      isDragging = true;
      startX = e.touches[0].clientX;
      handleTouchMove(e, track, allDots, hoverCircle, navContainer);
    });

    track.addEventListener('touchmove', (e) => {
      if (isDragging) {
        handleTouchMove(e, track, allDots, hoverCircle, navContainer);
      }
    });

    track.addEventListener('touchend', () => {
      isDragging = false;
      hideMobileHoverCircle(navContainer);
      // Reset wave effect
      allDots.forEach(({ el }) => {
        el.style.transform = 'scale(1)';
        el.style.opacity = '0.4';
      });
    });

    // Mouse hover support (for hybrid devices)
    track.addEventListener('mousemove', (e) => {
      applyMobileWaveEffect(allDots, e.clientX);
      
      // Interpolate position across track
      const trackRect = track.getBoundingClientRect();
      const trackStart = trackRect.left;
      const trackWidth = trackRect.width;
      const relativeX = Math.max(0, Math.min(trackWidth, e.clientX - trackStart));
      const progress = relativeX / trackWidth;
      const letterIndex = Math.floor(progress * allDots.length);
      const clampedIndex = Math.max(0, Math.min(allDots.length - 1, letterIndex));

      const targetDot = allDots[clampedIndex];
      if (targetDot) {
        showMobileHoverCircle(e, targetDot.letter, navContainer);
      }
    });

    track.addEventListener('mouseleave', () => {
      hideMobileHoverCircle(navContainer);
      allDots.forEach(({ el }) => {
        el.style.transform = 'scale(1)';
        el.style.opacity = '0.4';
      });
    });

    // Update active on scroll
    const updateMobileNav = () => {
      const sections = Array.from(document.querySelectorAll('.glossary-section'));
      
      // Calculate scroll progress for continuous position
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = docHeight > 0 ? scrollTop / docHeight : 0;
      
      // Clear all active states initially
      allDots.forEach(({ el }) => {
        el.classList.remove('active');
      });
      
      // Find current section
      let currentLetter = null;
      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom > 100) {
          currentLetter = section.dataset.letter;
          break;
        }
      }
      
      // Only set active if we're clearly in a section, not between sections
      if (currentLetter) {
        const currentDot = allDots.find(({ letter }) => letter === currentLetter);
        if (currentDot) {
          currentDot.el.classList.add('active');
        }
      }
      // If we're between sections (e.g., in whitespace), no dot is active
    };

    updateMobileNav();
    window.addEventListener('scroll', updateMobileNav, { passive: true });
  }

  function handleTouchMove(e, track, allDots, hoverCircle, container) {
    const touch = e.touches[0];
    const touchX = touch.clientX;

    // Apply wave effect
    applyMobileWaveEffect(allDots, touchX);

    // Interpolate position across full track width
    const trackRect = track.getBoundingClientRect();
    const trackStart = trackRect.left;
    const trackWidth = trackRect.width;
    const relativeX = Math.max(0, Math.min(trackWidth, touchX - trackStart)); // Clamp to track bounds
    const progress = relativeX / trackWidth; // 0 to 1
    const letterIndex = Math.floor(progress * allDots.length);
    const clampedIndex = Math.max(0, Math.min(allDots.length - 1, letterIndex));

    const targetDot = allDots[clampedIndex];
    if (targetDot) {
      scrollToLetter(targetDot.letter);
      showMobileHoverCircle(touch, targetDot.letter, container);
    }
  }

  function applyMobileWaveEffect(dots, touchX) {
    const maxScale = 2.5;
    const minScale = 1.0;
    const maxDistance = 150;

    dots.forEach(({ el }) => {
      const dotRect = el.getBoundingClientRect();
      const dotCenterX = dotRect.left + dotRect.width / 2;
      const distance = Math.abs(touchX - dotCenterX);

      const scale = distance < maxDistance
        ? minScale + ((maxDistance - distance) / maxDistance) * (maxScale - minScale)
        : minScale;

      el.style.transform = `scale(${scale})`;
      el.style.opacity = distance < maxDistance * 1.5 ? 1 : 0.4;
    });
  }

  function showMobileHoverCircle(event, letter, container) {
    const circle = container.querySelector('.mobile-hover-circle');
    const letterSpan = circle.querySelector('.hover-letter');
    
    letterSpan.textContent = letter;
    circle.classList.add('visible');
    
    // Position at touch point
    circle.style.left = `${event.clientX}px`;
  }

  function hideMobileHoverCircle(container) {
    const circle = container.querySelector('.mobile-hover-circle');
    circle.classList.remove('visible');
  }

  // ============================================================================
  // CATEGORY FILTERING
  // ============================================================================

  function initCategoryFilter() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');

    if (category && category !== 'all') {
      filterByCategory(category);
      document.querySelectorAll('.category-filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
      });
    }

    document.querySelectorAll('.category-filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = btn.dataset.category;
        
        if (cat === 'all') {
          clearCategoryFilter();
        } else {
          filterByCategory(cat);
        }

        const url = new URL(window.location);
        if (cat === 'all') {
          url.searchParams.delete('category');
        } else {
          url.searchParams.set('category', cat);
        }
        window.history.pushState({}, '', url);

        document.querySelectorAll('.category-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    document.querySelectorAll('.term-category-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = pill.dataset.category;
        
        const url = new URL(window.location);
        url.searchParams.set('category', cat);
        window.history.pushState({}, '', url);
        
        filterByCategory(cat);
        
        document.querySelectorAll('.category-filter-btn').forEach(b => {
          b.classList.toggle('active', b.dataset.category === cat);
        });
      });
    });
  }

  function filterByCategory(category) {
    document.querySelectorAll('.glossary-entry').forEach(entry => {
      entry.style.display = entry.dataset.termCategory === category ? 'block' : 'none';
    });

    document.querySelectorAll('.glossary-section').forEach(section => {
      const visible = Array.from(section.querySelectorAll('.glossary-entry'))
        .some(e => e.style.display !== 'none');
      section.style.display = visible ? 'block' : 'none';
    });
  }

  function clearCategoryFilter() {
    document.querySelectorAll('.glossary-entry, .glossary-section').forEach(el => {
      el.style.display = 'block';
    });
  }

  // ============================================================================
  // PDF EXPORT
  // ============================================================================

  function initExport() {
    const exportBtn = document.getElementById('glossary-export-pdf');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => window.print());
    }
  }

  // ============================================================================
  // UTILITIES
  // ============================================================================

  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  function init() {
    initTooltips();
    initGlossaryNav();
    initCategoryFilter();
    initExport();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
