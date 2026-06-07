/* ============================================================
   QASSIM NATIONAL DAY · OVERDO MICROSITE
   site.js — Lenis smooth scroll + GSAP ScrollTrigger
   ============================================================ */

(function () {
  'use strict';

  /* ---- Lenis smooth scroll ---- */
  const lenis = new Lenis({
    duration: 1.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  /* ---- Scroll progress bar ---- */
  const progressBar = document.getElementById('progress-bar');
  lenis.on('scroll', ({ progress }) => {
    if (progressBar) progressBar.style.width = (progress * 100) + '%';
  });

  /* ---- Nav scroll state ---- */
  const nav = document.getElementById('site-nav');
  lenis.on('scroll', ({ scroll }) => {
    if (nav) nav.classList.toggle('scrolled', scroll > 60);
  });

  /* ---- Hero animations (GSAP) ---- */
  gsap.registerPlugin(ScrollTrigger);

  // Sync Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Hero entrance
  const heroTl = gsap.timeline({ delay: 0.3 });
  heroTl
    .to('.hero-eyebrow',  { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' })
    .to('.hero-title',    { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' }, '-=0.6')
    .to('.hero-sub',      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.7')
    .to('.hero-logos',    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
    .to('.scroll-hint',   { opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.3');

  // Hero parallax
  gsap.to('.hero-bg', {
    yPercent: 20,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    }
  });

  /* ---- Parallax on all full-bleed and divider images ---- */
  document.querySelectorAll('.full-bleed-img, .section-divider-bg img, .closing-bg img').forEach(img => {
    gsap.fromTo(img,
      { yPercent: -10 },
      {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: {
          trigger: img.closest('.full-bleed, .section-divider, #closing'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      }
    );
  });

  /* ---- CPU hero parallax ---- */
  const cpuHeroImg = document.querySelector('.cpu-hero img');
  if (cpuHeroImg) {
    gsap.fromTo(cpuHeroImg,
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: '.cpu-hero',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      }
    );
  }

  /* ---- Reveal on scroll ---- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-scale');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));

  /* ---- KPI counter animation ---- */
  function animateCounter(el) {
    const text = el.textContent;
    const match = text.match(/^([\d,]+)/);
    if (!match) return;
    const target = parseInt(match[1].replace(/,/g, ''), 10);
    const suffix = text.replace(match[1], '');
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current.toLocaleString('ar') + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const kpiObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numEl = entry.target.querySelector('.kpi-num, .troupe-num');
        if (numEl && !numEl.dataset.animated) {
          numEl.dataset.animated = '1';
          animateCounter(numEl);
        }
        kpiObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.kpi-cell, .troupe-cell').forEach(el => kpiObserver.observe(el));

  /* ---- Design gallery lightbox ---- */
  const mainImg = document.querySelector('.design-gallery-main img');
  const thumbs = document.querySelectorAll('.design-thumb');

  if (mainImg && thumbs.length) {
    thumbs.forEach((thumb, i) => {
      thumb.addEventListener('click', () => {
        const src = thumb.querySelector('img').src;
        gsap.to(mainImg, {
          opacity: 0, scale: 0.97, duration: 0.25, ease: 'power2.in',
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

  /* ---- Nav anchor smooth scroll ---- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -72, duration: 1.4 });
      }
    });
  });

  /* ---- Lucide icons ---- */
  if (window.lucide) lucide.createIcons();

})();
