/**
 * Carl Bruce Clothing Brand — main.js
 * Premium African Streetwear · Since 2005
 * ─────────────────────────────────────────
 * Modules:
 *  1. Custom Cursor
 *  2. Loader
 *  3. Navbar Scroll
 *  4. Mobile Menu
 *  5. Product Tabs
 *  6. Fade-Up Reveal (IntersectionObserver)
 *  7. Newsletter Form
 *  8. Marquee Pause on Hover
 */

'use strict';

/* ═══════════════════════════════════════════
   1. CUSTOM CURSOR
═══════════════════════════════════════════ */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');

  if (!cursor || !ring) return;

  // Only show on devices with a fine pointer (desktop)
  if (!window.matchMedia('(pointer: fine)').matches) {
    cursor.style.display = 'none';
    ring.style.display   = 'none';
    return;
  }

  let mx = 0, my = 0;
  let rx = 0, ry = 0;
  let raf;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    raf = requestAnimationFrame(animateRing);
  }

  animateRing();

  // Hover states on interactive elements
  const interactives = document.querySelectorAll(
    'a, button, .product-card, .collection-card, .gallery-item, .tab-btn, .test-card'
  );

  interactives.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      ring.style.width       = '56px';
      ring.style.height      = '56px';
      ring.style.borderColor = 'rgba(224,90,90,0.8)';
      cursor.style.transform = 'translate(-50%,-50%) scale(0.5)';
    });

    el.addEventListener('mouseleave', () => {
      ring.style.width       = '36px';
      ring.style.height      = '36px';
      ring.style.borderColor = 'rgba(224,90,90,0.5)';
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    });
  });

  // Hide cursor when it leaves the window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    ring.style.opacity   = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    ring.style.opacity   = '1';
  });
})();


/* ═══════════════════════════════════════════
   2. LOADER
═══════════════════════════════════════════ */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  const LOADER_DURATION = 2300; // ms — matches CSS animation total

  function hideLoader() {
    loader.classList.add('out');
    // After transition remove from DOM entirely for accessibility
    loader.addEventListener('transitionend', () => {
      loader.remove();
    }, { once: true });
  }

  if (document.readyState === 'complete') {
    setTimeout(hideLoader, LOADER_DURATION);
  } else {
    window.addEventListener('load', () => {
      setTimeout(hideLoader, LOADER_DURATION);
    });
  }
})();


/* ═══════════════════════════════════════════
   3. NAVBAR SCROLL
═══════════════════════════════════════════ */
(function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle('scrolled', window.scrollY > 40);
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load in case page starts scrolled
})();


/* ═══════════════════════════════════════════
   4. MOBILE MENU
═══════════════════════════════════════════ */
(function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeBtn   = document.getElementById('mobileClose');
  const mLinks     = document.querySelectorAll('.m-link');

  if (!hamburger || !mobileMenu) return;

  function openMenu() {
    mobileMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    closeBtn && closeBtn.focus();
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    hamburger.focus();
  }

  hamburger.addEventListener('click', openMenu);
  closeBtn && closeBtn.addEventListener('click', closeMenu);

  // Close on nav link click
  mLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });

  // Close on backdrop click (outside menu content)
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) closeMenu();
  });
})();


/* ═══════════════════════════════════════════
   5. PRODUCT TABS
═══════════════════════════════════════════ */
(function initTabs() {
  const tabBtns   = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.products-panel');

  if (!tabBtns.length) return;

  function activateTab(btn) {
    const targetId = 'tab-' + btn.dataset.tab;

    // Update buttons
    tabBtns.forEach((b) => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });

    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    // Update panels
    tabPanels.forEach((panel) => {
      panel.classList.remove('active');
    });

    const target = document.getElementById(targetId);
    if (target) {
      target.classList.add('active');

      // Re-trigger fade-up for newly revealed cards
      target.querySelectorAll('.product-card').forEach((card, i) => {
        card.style.transitionDelay = (i * 0.04) + 's';
        card.style.opacity = '0';
        card.style.transform = 'translateY(16px)';

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity    = '1';
            card.style.transform  = 'none';
          });
        });

        // Clean up inline styles after animation
        setTimeout(() => {
          card.style.transition    = '';
          card.style.transitionDelay = '';
          card.style.opacity       = '';
          card.style.transform     = '';
        }, 600 + i * 40);
      });
    }
  }

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => activateTab(btn));

    // Keyboard navigation
    btn.addEventListener('keydown', (e) => {
      const tabs = [...tabBtns];
      const idx  = tabs.indexOf(btn);

      if (e.key === 'ArrowRight') {
        const next = tabs[(idx + 1) % tabs.length];
        next.focus();
        activateTab(next);
        e.preventDefault();
      }

      if (e.key === 'ArrowLeft') {
        const prev = tabs[(idx - 1 + tabs.length) % tabs.length];
        prev.focus();
        activateTab(prev);
        e.preventDefault();
      }
    });
  });
})();


/* ═══════════════════════════════════════════
   6. FADE-UP REVEAL (IntersectionObserver)
═══════════════════════════════════════════ */
(function initFadeUp() {
  const elements = document.querySelectorAll('.fade-up');
  if (!elements.length) return;

  // Fallback for browsers without IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // fire once
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
})();


/* ═══════════════════════════════════════════
   7. NEWSLETTER FORM
═══════════════════════════════════════════ */
(function initNewsletter() {
  const form    = document.getElementById('nlSubmit');
  const input   = document.getElementById('nl-email');
  const confirm = document.getElementById('nlConfirm');

  if (!form || !input || !confirm) return;

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener('click', () => {
    const email = input.value.trim();

    if (!email) {
      confirm.textContent = 'Please enter your email address.';
      confirm.style.color = 'rgba(255,255,255,0.7)';
      input.focus();
      return;
    }

    if (!isValidEmail(email)) {
      confirm.textContent = 'Please enter a valid email address.';
      confirm.style.color = 'rgba(255,255,255,0.7)';
      input.focus();
      return;
    }

    // Success state
    form.disabled       = true;
    form.textContent    = '✓ Done';
    input.value         = '';
    input.disabled      = true;
    confirm.textContent = 'You\'re in! Welcome to the Carl Bruce family.';
    confirm.style.color = '#fff';

    // Reset after 5s
    setTimeout(() => {
      form.disabled       = false;
      form.textContent    = 'Subscribe';
      input.disabled      = false;
      confirm.textContent = '';
    }, 5000);
  });

  // Allow Enter key to submit
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') form.click();
  });
})();


/* ═══════════════════════════════════════════
   8. MARQUEE PAUSE ON HOVER
═══════════════════════════════════════════ */
(function initMarquee() {
  const tracks = document.querySelectorAll('.marquee-track, .announce-track');

  tracks.forEach((track) => {
    const parent = track.parentElement;

    parent.addEventListener('mouseenter', () => {
      track.style.animationPlayState = 'paused';
    });

    parent.addEventListener('mouseleave', () => {
      track.style.animationPlayState = 'running';
    });
  });
})();


/* ═══════════════════════════════════════════
   9. SMOOTH HASH LINK SCROLL (offset for fixed navbar)
═══════════════════════════════════════════ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href').slice(1);
      const target   = document.getElementById(targetId);

      if (!target) return;

      e.preventDefault();

      const navHeight = document.getElementById('navbar')?.offsetHeight || 72;
      const announceHeight = document.querySelector('.announce')?.offsetHeight || 38;
      const offset    = navHeight;
      const top       = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    });
  });
})();
