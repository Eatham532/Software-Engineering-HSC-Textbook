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
      // Navigation and tooltip re-initialization handled elsewhere; no reload needed.
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

    // Ensure we never create duplicate navs
    // Remove any existing instances before building anew
    const existingDesktopNav = document.querySelectorAll('.glossary-vertical-nav');
    const existingMobileNavs = document.querySelectorAll('.glossary-mobile-nav');
    if (existingDesktopNav.length > 0) existingDesktopNav.forEach(el => el.remove());
    if (existingMobileNavs.length > 0) existingMobileNavs.forEach(el => el.remove());

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

  // ============================================================================
  // VERTICAL NAVIGATION (Desktop sidebar with wave effect)
  // ============================================================================

  function buildWaveNav() {
    const sections = Array.from(document.querySelectorAll('.glossary-section'));
    if (!sections.length) return;

  const TOTAL_DOTS = 20;
  const MAX_WAVE_DISPLACEMENT = 50; // Max horizontal displacement in pixels
  const MIN_VIEWPORT_TOP = 112; // px: keep nav/circle below header & top UI

    // Safety: remove any pre-existing desktop nav before creating a new one
    const preExisting = document.querySelectorAll('.glossary-vertical-nav');
    if (preExisting.length) preExisting.forEach(el => el.remove());

    // Calculate proportional mapping based on term counts
    const sectionData = sections.map(section => ({
      letter: section.dataset.letter,
      element: section,
      termCount: section.querySelectorAll('.glossary-entry').length,
      offsetTop: section.offsetTop
    }));
    
    const totalTerms = sectionData.reduce((sum, s) => sum + s.termCount, 0);
    
    // Build cumulative distribution for proportional mapping
    let cumulativeTerms = 0;
    const letterRanges = sectionData.map(section => {
      const startRatio = cumulativeTerms / totalTerms;
      cumulativeTerms += section.termCount;
      const endRatio = cumulativeTerms / totalTerms;
      return {
        letter: section.letter,
        element: section.element,
        startRatio,
        endRatio,
        offsetTop: section.offsetTop
      };
    });

    // Create navigation container
    const nav = document.createElement('div');
    nav.className = 'glossary-vertical-nav';
    
    // Create hover circle indicator
    const circle = document.createElement('div');
    circle.className = 'nav-hover-circle';
    circle.innerHTML = '<span class="hover-letter"></span>';
    nav.appendChild(circle);
    
    // Create fixed 20 dots
    const dots = [];
    for (let i = 0; i < TOTAL_DOTS; i++) {
      const dot = document.createElement('div');
      dot.className = 'nav-dot';
      nav.appendChild(dot);
      dots.push({ 
        el: dot, 
        index: i
      });
    }

    document.body.appendChild(nav);

  // State
    let isDragging = false;
    let isHovering = false;
    let rafId = null;
    let circleHideTimeout = null;
    let isScrolling = false;
    let scrollEndTimeout = null;

    // Helper: Get letter for a given scroll progress (0-1) based on term counts
    function getLetterAtProgress(progress) {
      const clampedProgress = Math.max(0, Math.min(1, progress));
      
      for (const range of letterRanges) {
        if (clampedProgress >= range.startRatio && clampedProgress <= range.endRatio) {
          return range.letter;
        }
      }
      return letterRanges[letterRanges.length - 1]?.letter || null;
    }

    // Helper: Get scroll position for a given progress
    function getScrollForProgress(progress) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      return progress * docHeight;
    }

    // Helper: Get current scroll progress (0-1)
    function getCurrentScrollProgress() {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      return docHeight > 0 ? scrollTop / docHeight : 0;
    }

    // Helper: Get dot index at Y position relative to nav
    function getDotIndexAtY(clientY) {
      const navRect = nav.getBoundingClientRect();
      const relativeY = Math.max(0, Math.min(navRect.height, clientY - navRect.top));
      const progress = relativeY / navRect.height;
      return Math.round(progress * (TOTAL_DOTS - 1));
    }

    // Helper: Scroll based on dot index
    function scrollToDotIndex(index) {
      const progress = index / (TOTAL_DOTS - 1);
      const targetScroll = getScrollForProgress(progress);
      window.scrollTo({ top: targetScroll, behavior: 'instant' });
    }

    // Helper: Apply wave displacement to dots based on mouse position
    function applyWaveDrag(mouseX, mouseY) {
      const navRect = nav.getBoundingClientRect();
      const navCenterX = navRect.left + navRect.width / 2;
      const relativeY = mouseY - navRect.top;
      
      // Calculate horizontal displacement based on mouse X distance from nav
      const distanceFromNav = mouseX - navCenterX;
      const maxDistance = 200;
      
      // Calculate base shift for entire nav to keep hovered dot under cursor
      const hoveredDotIndex = getDotIndexAtY(mouseY);
      const baseShift = Math.max(-MAX_WAVE_DISPLACEMENT, Math.min(MAX_WAVE_DISPLACEMENT, distanceFromNav * 0.3));
      
      dots.forEach(({ el, index }) => {
        const dotRect = el.getBoundingClientRect();
        const dotY = dotRect.top + dotRect.height / 2 - navRect.top;
        const verticalDistance = Math.abs(relativeY - dotY);
        
        // Calculate wave displacement
        const verticalFactor = Math.max(0, 1 - (verticalDistance / 120));
        const horizontalFactor = Math.max(0, Math.min(1, Math.abs(distanceFromNav) / maxDistance));
        
        // Combine factors for smooth wave
        const waveFactor = verticalFactor * verticalFactor; // Quadratic for smoother falloff
        const waveDisplacement = waveFactor * Math.min(Math.abs(distanceFromNav) * 0.5, MAX_WAVE_DISPLACEMENT);
        
        // Total displacement = base shift + wave displacement
        const xOffset = baseShift + (distanceFromNav < 0 ? -waveDisplacement : waveDisplacement);
        
        // Scale effect: larger when closer to mouse Y
        const scale = 1 + (verticalFactor * 2);
        const opacity = 0.4 + (verticalFactor * 0.6);
        
        el.style.transform = `translateX(${xOffset}px) scale(${scale})`;
        el.style.opacity = opacity;
        el.style.transition = 'transform 0.08s ease-out, opacity 0.08s ease-out';
      });
      
      // Move circle horizontally with the wave
      const hoveredDot = dots[hoveredDotIndex];
      if (hoveredDot) {
        const hoveredDotRect = hoveredDot.el.getBoundingClientRect();
        const dotCenterX = hoveredDotRect.left + hoveredDotRect.width / 2 - navRect.left;
        circle.style.left = `${dotCenterX}px`;
        circle.style.transform = 'translate(-50%, -50%)';
      }
    }

    // Helper: Apply hover scale effect (no horizontal displacement)
    function applyHoverScale(centerY) {
      const navRect = nav.getBoundingClientRect();
      const relativeY = centerY - navRect.top;

      dots.forEach(({ el }) => {
        const dotRect = el.getBoundingClientRect();
        const dotY = dotRect.top + dotRect.height / 2 - navRect.top;
        const distance = Math.abs(relativeY - dotY);
        
        const maxDistance = 100;
        if (distance < maxDistance) {
          const factor = 1 - (distance / maxDistance);
          const scale = 1 + (factor * factor * 2);
          const opacity = 1;
          el.style.transform = `translateX(0) scale(${scale})`;
          el.style.opacity = opacity;
        } else {
          el.style.transform = 'translateX(0) scale(1)';
          el.style.opacity = '0.4';
        }
      });
      
      // Reset circle X position
      circle.style.left = '50%';
      circle.style.transform = 'translate(-50%, -50%)';
    }

    // Helper: Reset dots to default state
    function resetDots() {
      dots.forEach(({ el }) => {
        el.style.transform = 'translateX(0) scale(1)';
        el.style.opacity = '0.4';
        el.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      });
      
      // Reset circle position
      circle.style.left = '50%';
      circle.style.transform = 'translate(-50%, -50%)';
    }

    // Helper: Auto-hide circle after delay
    function scheduleCircleHide() {
      if (circleHideTimeout) clearTimeout(circleHideTimeout);
      circleHideTimeout = setTimeout(() => {
        if (!isDragging && !isHovering) {
          circle.classList.remove('visible');
        }
      }, 2000);
    }

    // Helper: Update active dot and circle based on scroll
    function updateActive() {
      const scrollProgress = getCurrentScrollProgress();
      
      // Find which dot should be active based on scroll progress
      const activeDotIndex = Math.round(scrollProgress * (TOTAL_DOTS - 1));
      
      dots.forEach(({ el, index }) => {
        if (index === activeDotIndex) {
          el.classList.add('active');
          if (!isDragging && !isHovering) {
            el.style.opacity = '1';
          }
        } else {
          el.classList.remove('active');
        }
      });

      // Update circle position and letter ONLY when scrolling (not hovering/dragging)
      if (isScrolling && !isDragging && !isHovering) {
        const activeDot = dots[activeDotIndex];
        if (activeDot) {
          const navRect = nav.getBoundingClientRect();
          const dotRect = activeDot.el.getBoundingClientRect();
            let y = dotRect.top + dotRect.height / 2 - navRect.top;
            // Clamp circle so it doesn't go above configured viewport offset
            const minY = MIN_VIEWPORT_TOP - navRect.top;
            y = Math.max(minY, Math.min(navRect.height, y));
          
          const letter = getLetterAtProgress(scrollProgress);
          if (letter) {
            circle.querySelector('.hover-letter').textContent = letter;
            circle.classList.add('visible');
            circle.style.top = `${y}px`;
            circle.style.left = '50%';
            circle.style.transform = 'translate(-50%, -50%)';
            circle.style.transition = 'top 0.2s ease-out, left 0.2s ease-out';
            scheduleCircleHide();
          }
        }
      } else if (!isHovering && !isDragging && !isScrolling) {
        // No interaction: keep hidden
        circle.classList.remove('visible');
      }
    }

    // Show circle while scrolling; auto-hide after scrolling stops
    window.addEventListener('scroll', () => {
      isScrolling = true;
      if (circleHideTimeout) clearTimeout(circleHideTimeout);
      if (scrollEndTimeout) clearTimeout(scrollEndTimeout);
      // Update immediately to reflect current position
      updateActive();
      // Consider scroll ended shortly after last event
      scrollEndTimeout = setTimeout(() => {
        isScrolling = false;
        scheduleCircleHide();
  }, 150);
    }, { passive: true });

    // Mouse hover
    nav.addEventListener('mouseenter', () => {
      isHovering = true;
      if (circleHideTimeout) clearTimeout(circleHideTimeout);
    });

    nav.addEventListener('mousemove', (e) => {
      if (isDragging) return;
      
      isHovering = true;
      if (circleHideTimeout) clearTimeout(circleHideTimeout);
      
      applyHoverScale(e.clientY);
      
      const dotIndex = getDotIndexAtY(e.clientY);
      const progress = dotIndex / (TOTAL_DOTS - 1);
      const letter = getLetterAtProgress(progress);
      
      if (letter) {
        const navRect = nav.getBoundingClientRect();
          let y = e.clientY - navRect.top;
          // Clamp circle so it doesn't go above configured viewport offset
          const minY = MIN_VIEWPORT_TOP - navRect.top; // relative to nav top
          y = Math.max(minY, Math.min(navRect.height, y));
        
        circle.querySelector('.hover-letter').textContent = letter;
        circle.classList.add('visible');
        circle.style.top = `${y}px`;
        circle.style.transition = 'top 0.05s linear';
      }
    });

    nav.addEventListener('mouseleave', () => {
      isHovering = false;
      if (!isDragging) {
        resetDots();
        updateActive();
        scheduleCircleHide();
      }
    });

    // Click
    nav.addEventListener('click', (e) => {
      if (isDragging) return;
      const dotIndex = getDotIndexAtY(e.clientY);
      scrollToDotIndex(dotIndex);
    });

    // Drag
    nav.addEventListener('mousedown', (e) => {
      e.preventDefault();
      isDragging = true;
      nav.classList.add('dragging');
      nav.style.cursor = 'grabbing';
      
      if (circleHideTimeout) clearTimeout(circleHideTimeout);
      
      const dotIndex = getDotIndexAtY(e.clientY);
      scrollToDotIndex(dotIndex);
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      const mouseY = e.clientY;
      const mouseX = e.clientX;
      
      const viewportHeight = window.innerHeight;
      
      // Get current nav dimensions and position
      const currentNavRect = nav.getBoundingClientRect();
      const navHeight = currentNavRect.height;
      
      let targetDotIndex;
      let shouldMoveNav = false;
      
      if (mouseY < currentNavRect.top) {
        // Mouse above current nav bounds - move nav to follow
        shouldMoveNav = true;
        targetDotIndex = 0;
      } else if (mouseY > currentNavRect.bottom) {
        // Mouse below current nav bounds - move nav to follow
        shouldMoveNav = true;
        targetDotIndex = TOTAL_DOTS - 1;
      } else {
        // Mouse within current nav bounds - don't move nav, just track the dot
        shouldMoveNav = false;
        targetDotIndex = getDotIndexAtY(mouseY);
      }
      
      // Only update nav position if we need to follow the mouse
      if (shouldMoveNav) {
        let newNavTop;
        
        if (mouseY < currentNavRect.top) {
          // Position nav so first dot is under mouse
          newNavTop = mouseY + (navHeight / 2);
        } else {
          // Position nav so last dot is under mouse
          newNavTop = mouseY - (navHeight / 2);
        }
        
        // Clamp nav position to viewport with padding
  const minTop = navHeight / 2 + MIN_VIEWPORT_TOP; // Keep at least MIN_VIEWPORT_TOP from top
        const maxTop = viewportHeight - navHeight / 2 - 20;
        newNavTop = Math.max(minTop, Math.min(maxTop, newNavTop));
        
        // Apply nav position (no transition for immediate response)
        nav.style.top = `${newNavTop}px`;
        nav.style.transform = 'translateY(-50%)';
        nav.style.transition = 'none';
      }
      
      // Apply wave displacement
      applyWaveDrag(mouseX, mouseY);
      
      // Scroll based on the target dot
      scrollToDotIndex(targetDotIndex);
      
      const progress = targetDotIndex / (TOTAL_DOTS - 1);
      const letter = getLetterAtProgress(progress);
      
      if (letter) {
        // Update circle position relative to nav
        const updatedNavRect = nav.getBoundingClientRect();
          let y = mouseY - updatedNavRect.top;
          // Clamp circle so it doesn't go above configured viewport offset
          const minY = MIN_VIEWPORT_TOP - updatedNavRect.top;
          y = Math.max(minY, Math.min(updatedNavRect.height, y));
        
        circle.querySelector('.hover-letter').textContent = letter;
        circle.classList.add('visible');
        circle.style.top = `${y}px`;
        circle.style.transition = 'top 0.05s linear, left 0.05s linear';
      }
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        nav.classList.remove('dragging');
        nav.style.cursor = 'grab';
        
        // Reset nav position to center
        nav.style.top = '50%';
        nav.style.transition = 'top 0.3s ease';
        
        setTimeout(() => {
          resetDots();
          updateActive();
          scheduleCircleHide();
        }, 100);
      }
    });

    // Scroll tracking
    function scrollUpdate() {
      if (!isDragging && !isHovering) {
        updateActive();
      }
      rafId = requestAnimationFrame(scrollUpdate);
    }
    scrollUpdate();

    // Cleanup
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (circleHideTimeout) clearTimeout(circleHideTimeout);
    };
  }

  // ============================================================================
  // MOBILE NAVIGATION (Swipeable horizontal slider)
  // ============================================================================

  // Shared helper function for scrolling to a letter section
  function scrollToLetter(letter) {
    const section = document.querySelector(`.glossary-section[data-letter="${letter}"]`);
    if (!section) return;
    
    const firstSection = document.querySelector('.glossary-section');
    if (section === firstSection) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      window.scrollTo({ top: section.offsetTop - 20, behavior: 'instant' });
    }
  }

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
      exportBtn.addEventListener('click', (e) => {
        e.preventDefault();

        // Collect glossary data from current page
        const pageTitle = (document.querySelector('.md-content h1')?.innerText || document.title || 'Glossary').trim();
        const sections = Array.from(document.querySelectorAll('.glossary-section'));
        if (!sections.length) return;

        const data = sections.map(sec => {
          const letter = sec.dataset.letter || '';
          const entries = Array.from(sec.querySelectorAll('.glossary-entry')).map(entry => ({
            term: (entry.querySelector('h3')?.innerText || '').trim(),
            full: (entry.querySelector('.glossary-full-form')?.innerText || '').trim(),
            def: (entry.querySelector('.glossary-definition')?.innerText || '').trim(),
            cat: (entry.querySelector('.term-category-pill')?.innerText || '').trim(),
          }));
          return { letter, entries };
        }).filter(s => s.entries.length > 0);

        // Build a beautiful print view HTML (self-contained)
        const now = new Date();
        const dateStr = now.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
        const totalTerms = data.reduce((sum, s) => sum + s.entries.length, 0);

        const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${pageTitle} – Printable</title>
  <style>
    @page { size: A4; margin: 16mm 14mm; }
    html, body { background: #fff; color: #111; font: 12pt/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Arial, sans-serif; }
    .toolbar.no-print { position: sticky; top: 0; background: #f7f7f7; border-bottom: 1px solid #ddd; padding: 8px 12px; display: flex; gap: 8px; z-index: 10; }
    .toolbar.no-print button { padding: 6px 12px; border-radius: 6px; border: 1px solid #bbb; background: white; cursor: pointer; }
    .container { max-width: 960px; margin: 0 auto; padding: 0 6mm 12mm; }
    .cover { page-break-after: always; text-align: center; margin-top: 25vh; }
    .cover h1 { font-size: 28pt; margin: 0 0 10mm; font-weight: 700; letter-spacing: 0.5px; }
    .cover .meta { color: #666; font-size: 12pt; }
    .toc { page-break-after: always; }
    .toc h2 { font-size: 18pt; margin: 0 0 6mm; border-bottom: 2px solid #eee; padding-bottom: 3mm; }
    .toc-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 6px 16px; }
    .toc-item { color: #333; }
    .toc-item .letter { font-weight: 700; font-size: 12pt; margin-right: 6px; }
    .toc-item .count { color: #777; font-size: 10pt; }
    .section { page-break-before: always; }
    .section:first-of-type { page-break-before: auto; }
    .letter-heading { font-size: 22pt; font-weight: 700; margin: 0 0 6mm; border-bottom: 2px solid #eee; padding-bottom: 3mm; }
    .entry { page-break-inside: avoid; margin: 0 0 5mm; }
    .entry h3 { margin: 0; font-size: 13pt; font-weight: 700; }
    .entry .full { font-style: italic; color: #555; margin: 1mm 0 2mm; }
    .entry .def { margin: 0 0 2mm; }
    .entry .cat { display: inline-block; background: #eef3ff; color: #1b3a8a; font-size: 9pt; padding: 1px 8px; border-radius: 999px; border: 1px solid #d6e3ff; }
    .footer { position: fixed; bottom: 6mm; left: 0; right: 0; text-align: center; color: #888; font-size: 9pt; }
    @media print { .no-print { display: none !important; } .container { padding: 0; } }
  </style>
</head>
<body>
  <div class="toolbar no-print">
    <button onclick="window.print()">Print</button>
    <button onclick="window.close()">Close</button>
    <div style="margin-left:auto;color:#666">${totalTerms} terms • ${dateStr}</div>
  </div>
  <div class="container">
    <section class="cover">
      <h1>${pageTitle}</h1>
      <div class="meta">${totalTerms} terms • Generated ${dateStr}</div>
    </section>

    <section class="toc">
      <h2>Contents</h2>
      <div class="toc-list">
        ${data.map(s => `<div class="toc-item"><span class="letter">${s.letter}</span><span class="count">(${s.entries.length})</span></div>`).join('')}
      </div>
    </section>

    ${data.map(s => `
      <section class="section" id="letter-${s.letter}">
        <h2 class="letter-heading">${s.letter}</h2>
        ${s.entries.map(en => `
          <article class="entry">
            <h3>${en.term || ''}</h3>
            ${en.full ? `<div class="full">${en.full}</div>` : ''}
            ${en.def ? `<div class="def">${en.def}</div>` : ''}
            ${en.cat ? `<div class="cat">${en.cat}</div>` : ''}
          </article>
        `).join('')}
      </section>
    `).join('')}

    <div class="footer no-print">Tip: Use your browser's Print dialog to save as PDF.</div>
  </div>
  <script>/* Optional: auto-print on open? Disabled to allow preview */</script>
</body>
</html>`;

        const win = window.open('', '_blank');
        if (!win) return;
        win.document.open();
        win.document.write(html);
        win.document.close();
      });
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

  function cleanup() {
    // Remove any existing navigation elements
    const existingNav = document.querySelector('.glossary-vertical-nav');
    const existingMobileNav = document.querySelector('.glossary-mobile-nav');
    if (existingNav) existingNav.remove();
    if (existingMobileNav) existingMobileNav.remove();
  }

  // Initial load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Handle MkDocs Material instant loading (navigation without full page reload)
  // Listen for both the navigation event and location change
  document.addEventListener('DOMContentLoaded', () => {
    // MkDocs Material emits this event when instant loading completes
    if (typeof document$ !== 'undefined' && document$ && typeof document$.subscribe === 'function') {
      document$.subscribe(() => {
        cleanup();
        setTimeout(init, 100); // Small delay to ensure DOM is ready
      });
    }
  });

  // Fallback: Also listen for location changes
  let lastPath = location.pathname;
  setInterval(() => {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      cleanup();
      setTimeout(init, 100);
    }
  }, 500);

})();
