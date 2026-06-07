/* ============================================================
   QASSIM NATIONAL DAY · OVERDO MICROSITE
   site.js v4 — All selectors aligned to actual HTML markup
   ============================================================ */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     1. LENIS SMOOTH SCROLL
  ══════════════════════════════════════════════════════════ */
  const lenis = new Lenis({
    duration: 1.3,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2,
  });

  gsap.registerPlugin(ScrollTrigger);

  // Sync Lenis ↔ GSAP
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  /* ══════════════════════════════════════════════════════════
     2. PROGRESS BAR + NAV
  ══════════════════════════════════════════════════════════ */
  const progressBar = document.getElementById('progress-bar');
  const nav = document.getElementById('site-nav');

  lenis.on('scroll', ({ progress, scroll }) => {
    if (progressBar) progressBar.style.width = (progress * 100) + '%';
    if (nav) nav.classList.toggle('scrolled', scroll > 60);
  });

  /* ══════════════════════════════════════════════════════════
     3. HERO — CINEMATIC ENTRANCE
  ══════════════════════════════════════════════════════════ */
  const heroTl = gsap.timeline({ delay: 0.2 });
  heroTl
    .fromTo('.hero-eyebrow', { opacity: 0, y: 30, letterSpacing: '0.3em' },
      { opacity: 1, y: 0, letterSpacing: '0.12em', duration: 1.1, ease: 'power3.out' })
    .fromTo('.hero-title',   { opacity: 0, y: 60, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out' }, '-=0.7')
    .fromTo('.hero-sub',     { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' }, '-=0.8')
    .fromTo('.hero-logos',   { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.7')
    .fromTo('.scroll-hint',  { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.3');

  // Hero parallax zoom
  gsap.to('.hero-bg', {
    yPercent: 22,
    scale: 1.08,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    }
  });

  // Hero content fade out as you scroll away
  gsap.to('.hero-content', {
    opacity: 0,
    y: -60,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'center top',
      end: 'bottom top',
      scrub: true,
    }
  });

  /* ══════════════════════════════════════════════════════════
     4. PARALLAX — ALL FULL-BLEED IMAGES
  ══════════════════════════════════════════════════════════ */
  document.querySelectorAll('.full-bleed-img, .section-divider-bg img, .closing-bg img').forEach(img => {
    gsap.fromTo(img,
      { yPercent: -12 },
      {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: img.closest('.full-bleed, .section-divider, #closing'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        }
      }
    );
  });

  // CPU hero parallax
  const cpuHeroImg = document.querySelector('.cpu-hero img');
  if (cpuHeroImg) {
    gsap.fromTo(cpuHeroImg, { yPercent: -10 }, {
      yPercent: 10, ease: 'none',
      scrollTrigger: { trigger: '.cpu-hero', start: 'top bottom', end: 'bottom top', scrub: 1.5 }
    });
  }

  /* ══════════════════════════════════════════════════════════
     5. ABOUT SECTION — STAGGERED CAPABILITIES
     FIX: trigger was '.capabilities-grid' → now '.intro-caps'
  ══════════════════════════════════════════════════════════ */
  gsap.fromTo('.cap-item',
    { opacity: 0, x: 40, scale: 0.96 },
    {
      opacity: 1, x: 0, scale: 1,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.intro-caps',
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    }
  );

  // Intro body text — slide from left
  gsap.fromTo('.intro-body',
    { opacity: 0, x: -50 },
    {
      opacity: 1, x: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.intro-grid',
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    }
  );

  /* ══════════════════════════════════════════════════════════
     6. KPI COUNTERS — FIXED (reads data-count attribute)
  ══════════════════════════════════════════════════════════ */
  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    if (isNaN(target)) return;
    const hasSup = el.querySelector('sup');
    const suffix = hasSup ? hasSup.outerHTML : '';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.innerHTML = current.toLocaleString('en') + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // KPI row entrance
  gsap.fromTo('.kpi-row',
    { opacity: 0, y: 40 },
    {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '.kpi-row', start: 'top 85%', toggleActions: 'play none none none' }
    }
  );

  const kpiObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numEl = entry.target.querySelector('.kpi-num');
        if (numEl && !numEl.dataset.animated) {
          numEl.dataset.animated = '1';
          animateCounter(numEl);
        }
        kpiObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.kpi-cell').forEach(el => kpiObserver.observe(el));

  /* ══════════════════════════════════════════════════════════
     7. VALUES GRID — STAGGER FROM BOTTOM
  ══════════════════════════════════════════════════════════ */
  gsap.fromTo('.val-card',
    { opacity: 0, y: 50, scale: 0.94 },
    {
      opacity: 1, y: 0, scale: 1,
      stagger: 0.1,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.values-grid',
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    }
  );

  /* ══════════════════════════════════════════════════════════
     8. PROJECTS — HORIZONTAL SLIDE-IN (alternating directions)
  ══════════════════════════════════════════════════════════ */
  document.querySelectorAll('.project-card').forEach((card, i) => {
    const dir = i === 0 ? 0 : (i % 2 === 0 ? 60 : -60);
    const from = i === 0
      ? { opacity: 0, y: 50, scale: 0.96 }
      : { opacity: 0, x: dir, scale: 0.95 };
    const to = i === 0
      ? { opacity: 1, y: 0, scale: 1 }
      : { opacity: 1, x: 0, scale: 1 };
    gsap.fromTo(card, from, {
      ...to,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });
  });

  /* ══════════════════════════════════════════════════════════
     9. METHODOLOGY FLOW — SEQUENTIAL REVEAL WITH LINE DRAW
  ══════════════════════════════════════════════════════════ */
  const flowSteps = document.querySelectorAll('.flow-step');
  if (flowSteps.length) {
    flowSteps.forEach((step, i) => {
      gsap.fromTo(step,
        { opacity: 0, x: 80, scale: 0.9 },
        {
          opacity: 1, x: 0, scale: 1,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: step,
            start: 'top 82%',
            toggleActions: 'play none none none',
          }
        }
      );
    });

    // Animate the connecting line between steps
    const flowLine = document.querySelector('.flow-steps::before');
    // Use a pseudo-element trick via a real injected element
    const flowContainer = document.querySelector('.flow-steps');
    if (flowContainer) {
      const lineEl = document.createElement('div');
      lineEl.style.cssText = `
        position:absolute; top:28px; right:10%; left:10%; height:1px;
        background:linear-gradient(90deg,transparent,var(--sand),transparent);
        transform-origin:right; transform:scaleX(0); pointer-events:none; z-index:0;
      `;
      flowContainer.style.position = 'relative';
      flowContainer.appendChild(lineEl);
      gsap.to(lineEl, {
        scaleX: 1,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: flowContainer,
          start: 'top 75%',
          end: 'top 40%',
          scrub: 1,
        }
      });
    }
  }

  /* ══════════════════════════════════════════════════════════
     10. TIMELINE — PHASE CARDS SLIDE IN
     FIX: removed .phases-list injection (doesn't exist in HTML)
     Phase cards use .phases-grid which does exist
  ══════════════════════════════════════════════════════════ */
  const phaseCards = document.querySelectorAll('.phase-card');
  if (phaseCards.length) {
    phaseCards.forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, x: 60, scale: 0.96 },
        {
          opacity: 1, x: 0, scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 84%',
            toggleActions: 'play none none none',
          }
        }
      );
    });
  }

  /* ══════════════════════════════════════════════════════════
     11. QUALITY GATES — FLIP-IN STAGGER
  ══════════════════════════════════════════════════════════ */
  gsap.fromTo('.gate-card',
    { opacity: 0, rotateY: -15, transformOrigin: 'right center', scale: 0.92 },
    {
      opacity: 1, rotateY: 0, scale: 1,
      stagger: 0.08,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.gates-grid',
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    }
  );

  /* ══════════════════════════════════════════════════════════
     12. ISO CARDS — SCALE UP
     FIX: trigger was '.iso-grid' → now '.iso-row'
  ══════════════════════════════════════════════════════════ */
  gsap.fromTo('.iso-card',
    { opacity: 0, y: 40, scale: 0.88 },
    {
      opacity: 1, y: 0, scale: 1,
      stagger: 0.12,
      duration: 0.8,
      ease: 'back.out(1.4)',
      scrollTrigger: {
        trigger: '.iso-row',
        start: 'top 82%',
        toggleActions: 'play none none none',
      }
    }
  );

  /* ══════════════════════════════════════════════════════════
     13. SCOPE — STAGGERED REVEAL
     FIX: target was '.scope-col' → now '.scope-card'
  ══════════════════════════════════════════════════════════ */
  gsap.fromTo('.scope-card',
    { opacity: 0, y: 50 },
    {
      opacity: 1, y: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.scope-grid',
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    }
  );

  /* ══════════════════════════════════════════════════════════
     14. ARTISTS — CARD REVEAL WITH DEPTH
  ══════════════════════════════════════════════════════════ */
  gsap.fromTo('.artist-card',
    { opacity: 0, y: 60, scale: 0.9, rotateZ: -1 },
    {
      opacity: 1, y: 0, scale: 1, rotateZ: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.artists-grid',
        start: 'top 82%',
        toggleActions: 'play none none none',
      }
    }
  );

  /* ══════════════════════════════════════════════════════════
     15. FOLK TROUPES — ANIMATED COUNT-UP
     FIX: Arabic numerals (٣,٢) can't be parsed by parseInt.
     We read data-count attribute set in HTML instead.
  ══════════════════════════════════════════════════════════ */
  const troupeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numEl = entry.target.querySelector('.troupe-num');
        if (numEl && !numEl.dataset.animated) {
          numEl.dataset.animated = '1';
          // Read from data-count (Western numeral), fall back to 1
          const target = parseInt(numEl.dataset.count || '1', 10);
          let current = 0;
          const step = () => {
            current++;
            numEl.textContent = current;
            if (current < target) setTimeout(step, 120);
          };
          step();
        }
        troupeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.troupe-cell').forEach(el => troupeObserver.observe(el));

  // Troupe cells entrance animation
  gsap.fromTo('.troupe-cell',
    { opacity: 0, y: 40 },
    {
      opacity: 1, y: 0,
      stagger: 0.12,
      duration: 0.75,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.troupes-grid',
        start: 'top 82%',
        toggleActions: 'play none none none',
      }
    }
  );

  /* ══════════════════════════════════════════════════════════
     16. CPU SECTION
     FIX: '.cpu-stats'/'.cpu-stat' don't exist.
     Animate '.cpu-pill' items (inside .cpu-pills) instead.
     Dept cards trigger on '.dept-grid' (not '.depts-grid').
  ══════════════════════════════════════════════════════════ */
  // CPU hero overlay content
  gsap.fromTo('.cpu-hero-overlay',
    { opacity: 0, x: 60 },
    {
      opacity: 1, x: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.cpu-hero',
        start: 'top 75%',
        toggleActions: 'play none none none',
      }
    }
  );

  // CPU pills — stagger pop-in
  gsap.fromTo('.cpu-pill',
    { opacity: 0, y: 20, scale: 0.85 },
    {
      opacity: 1, y: 0, scale: 1,
      stagger: 0.1,
      duration: 0.6,
      ease: 'back.out(1.5)',
      scrollTrigger: {
        trigger: '.cpu-pills',
        start: 'top 82%',
        toggleActions: 'play none none none',
      }
    }
  );

  // Dept cards — stagger from bottom
  gsap.fromTo('.dept-card',
    { opacity: 0, y: 50, scale: 0.93 },
    {
      opacity: 1, y: 0, scale: 1,
      stagger: 0.1,
      duration: 0.75,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.dept-grid',
        start: 'top 82%',
        toggleActions: 'play none none none',
      }
    }
  );

  // Floor plan — mask reveal (wipe from right to left, RTL-aware)
  const floorplanImg = document.querySelector('.floorplan-img-wrap img');
  if (floorplanImg) {
    gsap.fromTo(floorplanImg,
      { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
      {
        clipPath: 'inset(0 0% 0 0)', opacity: 1,
        duration: 1.4,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: '.floorplan-section',
          start: 'top 75%',
          toggleActions: 'play none none none',
        }
      }
    );
  }

  /* ══════════════════════════════════════════════════════════
     17. DESIGN GALLERY — INTERACTIVE SWITCHER
  ══════════════════════════════════════════════════════════ */
  const mainImg = document.querySelector('.design-gallery-main img');
  const thumbs = document.querySelectorAll('.design-thumb');

  if (mainImg && thumbs.length) {
    thumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const src = thumb.querySelector('img').src;
        gsap.to(mainImg, {
          opacity: 0, scale: 0.97, duration: 0.22, ease: 'power2.in',
          onComplete: () => {
            mainImg.src = src;
            gsap.to(mainImg, { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' });
          }
        });
        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });
    });
    if (thumbs[0]) thumbs[0].classList.add('active');
  }

  // Gallery section entrance
  gsap.fromTo('.design-gallery',
    { opacity: 0, y: 50 },
    {
      opacity: 1, y: 0, duration: 1.0, ease: 'power3.out',
      scrollTrigger: { trigger: '.design-gallery', start: 'top 80%', toggleActions: 'play none none none' }
    }
  );

  /* ══════════════════════════════════════════════════════════
     18. TEAM — STAGGERED GRID REVEAL
     FIX: '.team-leads' doesn't exist as a wrapper.
     Lead cards are '.team-card.lead' inside '.team-grid'.
     We trigger the lead animation on the team-grid itself.
  ══════════════════════════════════════════════════════════ */
  document.querySelectorAll('.team-grid').forEach(grid => {
    // All team cards stagger in
    gsap.fromTo(grid.querySelectorAll('.team-card'),
      { opacity: 0, y: 40, scale: 0.93 },
      {
        opacity: 1, y: 0, scale: 1,
        stagger: 0.07,
        duration: 0.65,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: grid,
          start: 'top 82%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  // Lead team cards — more dramatic entrance (triggered on first lead card)
  const firstLead = document.querySelector('.team-card.lead');
  if (firstLead) {
    gsap.fromTo('.team-card.lead',
      { opacity: 0, y: 60, scale: 0.9 },
      {
        opacity: 1, y: 0, scale: 1,
        stagger: 0.15,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: firstLead,
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      }
    );
  }

  /* ══════════════════════════════════════════════════════════
     19. KT CARDS
  ══════════════════════════════════════════════════════════ */
  gsap.fromTo('.kt-card',
    { opacity: 0, y: 40, scale: 0.95 },
    {
      opacity: 1, y: 0, scale: 1,
      stagger: 0.12,
      duration: 0.75,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.kt-grid',
        start: 'top 82%',
        toggleActions: 'play none none none',
      }
    }
  );

  /* ══════════════════════════════════════════════════════════
     20. CLOSING — CINEMATIC REVEAL
  ══════════════════════════════════════════════════════════ */
  gsap.fromTo('.closing-content',
    { opacity: 0, y: 80, scale: 0.95 },
    {
      opacity: 1, y: 0, scale: 1,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#closing',
        start: 'top 70%',
        toggleActions: 'play none none none',
      }
    }
  );

  /* ══════════════════════════════════════════════════════════
     21. GENERIC REVEAL FALLBACK (for any remaining .reveal)
  ══════════════════════════════════════════════════════════ */
  const revealEls = document.querySelectorAll('.reveal:not([data-gsap])');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ══════════════════════════════════════════════════════════
     22. SECTION TITLE SPLIT ANIMATION
  ══════════════════════════════════════════════════════════ */
  document.querySelectorAll('.sec-title').forEach(title => {
    gsap.fromTo(title,
      { opacity: 0, y: 35 },
      {
        opacity: 1, y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: title,
          start: 'top 88%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  document.querySelectorAll('.sec-eyebrow').forEach(eyebrow => {
    gsap.fromTo(eyebrow,
      { opacity: 0, y: 20, letterSpacing: '0.3em' },
      {
        opacity: 1, y: 0, letterSpacing: '0.12em',
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: eyebrow,
          start: 'top 90%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  /* ══════════════════════════════════════════════════════════
     23. NAV SMOOTH ANCHOR SCROLL
  ══════════════════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -72, duration: 1.5 });
      }
    });
  });

  /* ══════════════════════════════════════════════════════════
     24. FLOATING DECORATIVE PARTICLES (subtle ambient)
  ══════════════════════════════════════════════════════════ */
  function createParticles(container, count) {
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'ambient-particle';
      p.style.cssText = `
        position:absolute;
        width:${2 + Math.random() * 4}px;
        height:${2 + Math.random() * 4}px;
        border-radius:50%;
        background:rgba(212,175,55,${0.1 + Math.random() * 0.2});
        left:${Math.random() * 100}%;
        top:${Math.random() * 100}%;
        pointer-events:none;
        z-index:1;
      `;
      container.appendChild(p);
      gsap.to(p, {
        y: -30 - Math.random() * 60,
        x: (Math.random() - 0.5) * 40,
        opacity: 0,
        duration: 3 + Math.random() * 4,
        delay: Math.random() * 5,
        repeat: -1,
        ease: 'power1.inOut',
      });
    }
  }

  const heroSection = document.querySelector('#hero');
  if (heroSection) createParticles(heroSection, 18);

  const closingSection = document.querySelector('#closing');
  if (closingSection) createParticles(closingSection, 12);

  /* ══════════════════════════════════════════════════════════
     25. LUCIDE ICONS
  ══════════════════════════════════════════════════════════ */
  if (window.lucide) lucide.createIcons();

})();
