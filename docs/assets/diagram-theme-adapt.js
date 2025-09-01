// Toggle SVG theme-aware attributes on page load and when theme changes
(function () {
  function isDark() {
    try {
      // Check Material theme's data attributes and body classes
      var scheme = document.body.getAttribute('data-md-color-scheme');
      if (scheme === 'slate') return true;
      if (scheme === 'default') return false;
      
      // Fallback to system preference
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (e) {
      return false;
    }
  }

  function applyToSVG(svg) {
    if (!svg) return;
    // Make background transparent
    try {
      // remove any inline background declarations from the style attribute
      var s = svg.getAttribute('style') || '';
      s = s.replace(/background\s*:\s*[^;]+;?/gi, '');
      s = s.replace(/background-color\s*:\s*[^;]+;?/gi, '');
      if (s.trim() === '') svg.removeAttribute('style'); else svg.setAttribute('style', s);
      svg.style.background = 'transparent';
    } catch (e) {
      svg.style.background = 'transparent';
    }
    // Adjust stroke/fill for dark mode
    if (isDark()) {
      svg.classList.add('diagram-dark');
      svg.classList.remove('diagram-light');
    } else {
      svg.classList.add('diagram-light');
      svg.classList.remove('diagram-dark');
    }
  }

  function removeBackgroundRectsAndFixContrast(svg) {
    if (!svg) return;
    var dark = isDark();
    var darkColor = '#e6e6e6';
    var lightColor = '#0f172a';

    // Remove large rects that act as white backgrounds
    try {
      var rects = Array.from(svg.querySelectorAll('rect'));
      rects.forEach(function (r) {
        try {
          var rx = parseFloat(r.getAttribute('x') || r.getAttribute('x') === '0' ? r.getAttribute('x') : 0) || 0;
          var ry = parseFloat(r.getAttribute('y') || r.getAttribute('y') === '0' ? r.getAttribute('y') : 0) || 0;
          var rw = parseFloat(r.getAttribute('width') || 0) || 0;
          var rh = parseFloat(r.getAttribute('height') || 0) || 0;
          var svgW = parseFloat(svg.getAttribute('width')) || svg.viewBox.baseVal.width || svg.clientWidth || 0;
          var svgH = parseFloat(svg.getAttribute('height')) || svg.viewBox.baseVal.height || svg.clientHeight || 0;
          // if rect covers most of the svg area and looks like a background, remove it
          if (rw >= 0.9 * svgW && rh >= 0.9 * svgH) {
            r.parentNode && r.parentNode.removeChild(r);
          }
        } catch (e) {
          // ignore
        }
      });
    } catch (e) {
      // ignore
    }

    // Force fill/stroke for text and shapes for contrast
    try {
      var targetColor = dark ? darkColor : lightColor;
      // text elements
      svg.querySelectorAll('text, tspan').forEach(function (el) {
        el.setAttribute('fill', targetColor);
        el.style.fill = targetColor;
      });
      
      // Specifically handle PlantUML arrow polygons
      svg.querySelectorAll('polygon[fill="#181818"]').forEach(function (el) {
        el.setAttribute('fill', targetColor);
        el.style.fill = targetColor;
        el.setAttribute('stroke', targetColor);
        el.style.stroke = targetColor;
      });
      
      // Specifically handle PlantUML arrow lines/shafts
      svg.querySelectorAll('line[stroke="#181818"]').forEach(function (el) {
        el.setAttribute('stroke', targetColor);
        el.style.stroke = targetColor;
      });
      
      // Handle lines with inline style stroke
      svg.querySelectorAll('line[style*="stroke:#181818"]').forEach(function (el) {
        el.setAttribute('stroke', targetColor);
        el.style.stroke = targetColor;
        // Also remove the inline style to avoid conflicts
        var style = el.getAttribute('style') || '';
        style = style.replace(/stroke:\s*#181818/gi, 'stroke:' + targetColor);
        el.setAttribute('style', style);
      });
      
      // shapes with fill/stroke
      svg.querySelectorAll('[fill]').forEach(function (el) {
        var f = el.getAttribute('fill');
        if (f && f.toLowerCase() !== 'none') {
          el.setAttribute('fill', targetColor);
          el.style.fill = targetColor;
        }
      });
      svg.querySelectorAll('[stroke]').forEach(function (el) {
        var s = el.getAttribute('stroke');
        if (s && s.toLowerCase() !== 'none') {
          el.setAttribute('stroke', targetColor);
          el.style.stroke = targetColor;
        }
      });
    } catch (e) {
      // ignore
    }
  }

  function processAll() {
    console.log('Processing diagrams, dark mode:', isDark());
    
    // Handle inline <svg> first
    document.querySelectorAll('svg').forEach(function (svg) {
      applyToSVG(svg);
      removeBackgroundRectsAndFixContrast(svg);
    });

    // Handle <img> elements that may contain SVGs from kroki (data URI or external SVG URL)
    document.querySelectorAll('img').forEach(function (img) {
      var src = img.getAttribute('src') || '';
      try {
        if (src.indexOf('data:image/svg+xml') === 0) {
          // data URI: decode and inline
          var svgText = decodeURIComponent(src.split(',')[1]);
          var parser = new DOMParser();
          var doc = parser.parseFromString(svgText, 'image/svg+xml');
          var newSvg = doc.documentElement;
          img.parentNode.replaceChild(newSvg, img);
          applyToSVG(newSvg);
          removeBackgroundRectsAndFixContrast(newSvg);
          return;
        }

        // External kroki SVG (common form: https://kroki.io/plantuml/svg/<encoded>)
        var isKrokiSvg = src.indexOf('kroki.io') !== -1 && src.indexOf('/svg') !== -1;
        var isSvgExt = src.endsWith('.svg') || src.indexOf('/svg/') !== -1;
        if (isKrokiSvg || isSvgExt) {
          // Try to fetch and inline the SVG so we can style it.
          fetch(src, { method: 'GET', mode: 'cors' })
            .then(function (resp) {
              if (!resp.ok) throw new Error('Network response not ok');
              return resp.text();
            })
            .then(function (text) {
              try {
                var parser2 = new DOMParser();
                var doc2 = parser2.parseFromString(text, 'image/svg+xml');
                var svgEl = doc2.documentElement;
                if (svgEl && svgEl.tagName && svgEl.tagName.toLowerCase() === 'svg') {
                  img.parentNode.replaceChild(svgEl, img);
                  applyToSVG(svgEl);
                  removeBackgroundRectsAndFixContrast(svgEl);
                  return;
                }
                // Fallback: set class on original img
                img.classList.add(isDark() ? 'diagram-dark' : 'diagram-light');
              } catch (e) {
                img.classList.add(isDark() ? 'diagram-dark' : 'diagram-light');
              }
            })
            .catch(function () {
              // If fetch fails (CORS or network), still set class so CSS can minimally adapt
              img.classList.add(isDark() ? 'diagram-dark' : 'diagram-light');
            });
          return;
        }

        // Not an svg: just tag it for basic theming
        img.classList.add(isDark() ? 'diagram-dark' : 'diagram-light');
      } catch (e) {
        img.classList.add(isDark() ? 'diagram-dark' : 'diagram-light');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', processAll);
  
  // Watch for theme changes on body's data-md-color-scheme attribute
  var observer = new MutationObserver(function (mutations) {
    var themeChanged = false;
    mutations.forEach(function (mutation) {
      if (mutation.type === 'attributes' && 
          (mutation.attributeName === 'data-md-color-scheme' || 
           mutation.attributeName === 'class')) {
        themeChanged = true;
      }
    });
    if (themeChanged) {
      setTimeout(processAll, 100); // Small delay to ensure theme change is complete
    }
  });
  
  observer.observe(document.body, { 
    attributes: true, 
    attributeFilter: ['data-md-color-scheme', 'class'] 
  });
  observer.observe(document.documentElement, { 
    attributes: true, 
    attributeFilter: ['data-md-color-scheme', 'class'] 
  });
})();
