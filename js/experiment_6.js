(function() {
  var EXPERIMENT_ID = 6;
  var PROJECT_ID = 5;
  var SEGMENTS = [
    { id: 11, name: 'A', preview_hash: '4JE7mmn7rCg', percentage: 0.5 },
    { id: 12, name: 'B', preview_hash: '_DmrtBVL7Tg', percentage: 0.5 }
  ];
  var WEBHOOK_URL = 'http://localhost:9000/webhook/event';
  var STORAGE_KEY = 'exp6_segment';

  function getSegment() {
    // Check for preview hash override
    var urlHash = new URLSearchParams(window.location.search).get('x');
    if (urlHash) {
      var forced = SEGMENTS.find(function(s) { return s.preview_hash === urlHash; });
      if (forced) return forced;
    }
    // Check stored assignment
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      var parsed = JSON.parse(stored);
      var found = SEGMENTS.find(function(s) { return s.id === parsed.id; });
      if (found) return found;
    }
    // Random assignment
    var rand = Math.random();
    var cumulative = 0;
    for (var i = 0; i < SEGMENTS.length; i++) {
      cumulative += SEGMENTS[i].percentage;
      if (rand < cumulative) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: SEGMENTS[i].id }));
        return SEGMENTS[i];
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: SEGMENTS[0].id }));
    return SEGMENTS[0];
  }

  function trackEvent(eventId, segment) {
    fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_id: eventId,
        segment_id: segment.id,
        segment_name: segment.name,
        experiment_id: EXPERIMENT_ID,
        project_id: PROJECT_ID,
        timestamp: new Date().toISOString(),
        metadata: {}
      })
    }).catch(function(err) { console.warn('Tracking error:', err); });
  }

  function applyVariant(segment) {
    if (segment.id === 12) {
      // Segment B: change hero button from orange to yellow
      var style = document.createElement('style');
      style.id = 'exp6-style';
      style.textContent =
        '.hero-btn, .cta-btn, a.btn, .btn-primary, button.btn, .hero a.button, .hero .button, ' +
        '#hero a, #hero button, .hero-section a.btn, section#hero a, ' +
        'a[href="#contact"].btn, a[href="#contatti"].btn, ' +
        '.hero a[class*="btn"], .hero a[class*="button"], ' +
        'a.hero-cta, .cta a, .banner a, ' +
        '[class*="btn-orange"], [class*="btn_orange"] ' +
        '{ background-color: #FFD700 !important; border-color: #FFD700 !important; color: #333 !important; }\n' +
        '[class*="btn-orange"]:hover, [class*="btn_orange"]:hover, ' +
        '.hero a[class*="btn"]:hover, .hero a[class*="button"]:hover ' +
        '{ background-color: #FFC200 !important; border-color: #FFC200 !important; }';
      document.head.appendChild(style);
    }
  }

  function attachTracking(segment) {
    // Track button_view for hero buttons via IntersectionObserver
    var tracked = false;
    function findHeroButtons() {
      // Try to find hero/CTA buttons broadly
      var selectors = [
        '#hero a', '#hero button',
        '.hero a', '.hero button',
        '.hero-btn', '.cta-btn',
        'section:first-of-type a[href]',
        'a.btn', 'button.btn'
      ];
      var buttons = [];
      for (var i = 0; i < selectors.length; i++) {
        var els = document.querySelectorAll(selectors[i]);
        for (var j = 0; j < els.length; j++) {
          if (buttons.indexOf(els[j]) === -1) buttons.push(els[j]);
        }
      }
      return buttons;
    }

    function setupObserver(buttons) {
      if (!buttons.length) return;
      if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting && !tracked) {
              tracked = true;
              trackEvent('button_view', segment);
            }
          });
        }, { threshold: 0.5 });
        // Observe only the first hero button
        observer.observe(buttons[0]);
      } else {
        // Fallback: fire immediately
        if (!tracked) {
          tracked = true;
          trackEvent('button_view', segment);
        }
      }
    }

    function setupClickTracking(buttons) {
      buttons.forEach(function(btn) {
        btn.addEventListener('click', function() {
          trackEvent('button_click', segment);
        });
      });
    }

    var buttons = findHeroButtons();
    setupObserver(buttons);
    setupClickTracking(buttons);
  }

  function init() {
    var segment = getSegment();
    applyVariant(segment);

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        attachTracking(segment);
      });
    } else {
      attachTracking(segment);
    }
  }

  init();
})();
