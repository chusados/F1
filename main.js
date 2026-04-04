/* ══════════════════════════════════════════════════
       PRELOADER ANIMATION
       ══════════════════════════════════════════════════ */
    let progressObj = { val: 0 };
    gsap.to(progressObj, {
      val: 100,
      duration: 1.5,
      roundProps: "val",
      ease: "power2.inOut",
      onUpdate: () => {
        document.getElementById('preloader-pct').innerText = progressObj.val;
        document.getElementById('loading-bar').style.width = progressObj.val + '%';
      },
      onComplete: () => {
        gsap.to('#preloader', {
          yPercent: -100,
          duration: 0.8,
          ease: 'power4.inOut',
          onComplete: initHeroAnimations // Disparamos las animaciones del hero al terminar
        });
      }
    });

    /* ══════════════════════════════════════════════════
       LENIS SMOOTH SCROLL (NUEVO)
       Hace que el scrub de video sea infinitamente más suave
       ══════════════════════════════════════════════════ */
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000) });
    gsap.ticker.lagSmoothing(0);

    /* ══════════════════════════════════════════════════
       MAGNETIC BUTTONS (NUEVO)
       Atrae los botones al ratón
       ══════════════════════════════════════════════════ */
    document.querySelectorAll('.magnetic').forEach(elem => {
      elem.addEventListener('mousemove', (e) => {
        const rect = elem.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(elem, { x: x * 0.4, y: y * 0.4, duration: 0.3, ease: 'power2.out' });
      });
      elem.addEventListener('mouseleave', () => {
        gsap.to(elem, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
      });
    });



    /* ══════════════════════════════════════════════════
       EFFECT 2 · SPLIT TEXT
       ══════════════════════════════════════════════════ */
    function splitAndAnimate(selector, trigger, staggerVal = 0.04) {
      document.querySelectorAll(selector).forEach(el => {
        const text = el.innerHTML;
        const html = text.replace(/(<br\s*\/?>|<em>|<\/em>)/g, '§$1§').split('§');
        el.innerHTML = html.map(chunk => {
          if (chunk.match(/^</)) return chunk;
          return chunk.split('').map(ch =>
            ch === ' '
              ? '<span style="display:inline-block;width:0.28em"></span>'
              : `<span class="char-wrap"><span class="char" style="display:inline-block;transform:translateY(110%)">${ch}</span></span>`
          ).join('');
        }).join('');

        const chars = el.querySelectorAll('.char');
        gsap.to(chars, {
          scrollTrigger: { trigger: trigger || el, start: 'top 85%' },
          y: '0%',
          duration: 0.65,
          ease: 'power3.out',
          stagger: staggerVal,
        });
      });
    }

    (function () {
      const el = document.querySelector('.hero-title');
      if (!el) return;
      const html = el.innerHTML;
      el.innerHTML = html.trim().replace(/(<br\s*\/?>|<em>|<\/em>)/g, '§$1§').split('§').map((chunk, index, array) => {
        if (chunk.match(/^</)) return chunk;
        let text = chunk;
        // Trim leading space for first chunk and trailing for last,
        // and also handle the whitespace chunks between tags if they are just indentation.
        if (index === 0) text = text.replace(/^\s+/, '');
        if (index === array.length - 1) text = text.replace(/\s+$/, '');
        // If it's a chunk entirely composed of whitespace after a <br>, it's likely indentation.
        if (array[index-1] && array[index-1].match(/<br/i)) text = text.replace(/^\s+/, '');

        return text.split('').map(ch =>
          ch === ' '
            ? '<span style="display:inline-block;width:0.28em"></span>'
            : `<span class="char-wrap"><span class="char" style="display:inline-block;transform:translateY(110%)">${ch}</span></span>`
        ).join('');
      }).join('');
    })();

    splitAndAnimate('.section-title', '.section-header', 0.035);
    splitAndAnimate('.about-name', '.about', 0.035);
    splitAndAnimate('.contact .section-title', '.contact', 0.035);

    /* ══════════════════════════════════════════════════
       EFFECT 3 · PARALLAX
       ══════════════════════════════════════════════════ */
    document.querySelectorAll('.parallax-el').forEach(el => {
      const speed = parseFloat(el.dataset.speed || 0.2);
      gsap.to(el, {
        yPercent: speed * -80,
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('section') || el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });
    });

    gsap.to('.stat-val', {
      y: -30,
      ease: 'none',
      scrollTrigger: { trigger: '.stats', start: 'top bottom', end: 'bottom top', scrub: true }
    });

    gsap.to('.about-bio', {
      y: -20,
      ease: 'none',
      scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true }
    });

    /* ══════════════════════════════════════════════════
       EFFECT 4 · 3D HOVER CARDS
       ══════════════════════════════════════════════════ */
    document.querySelectorAll('.service-card').forEach(card => {
      const shine = card.querySelector('.card-shine');

      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        const rotX = -dy * 8;
        const rotY = dx * 8;

        gsap.to(card, {
          rotateX: rotX, rotateY: rotY,
          transformPerspective: 900,
          duration: 0.35, ease: 'power2.out',
          overwrite: 'auto'
        });

        if (shine) {
          const px = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
          const py = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
          shine.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(232,0,29,0.14) 0%, transparent 65%)`;
        }
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateX: 0, rotateY: 0,
          duration: 0.6, ease: 'elastic.out(1, 0.5)',
          overwrite: 'auto'
        });
      });
    });

    /* ══════════════════════════════════════════════════
       ANIMATED COUNTERS
       ══════════════════════════════════════════════════ */
    (function () {
      const counters = [
        { el: document.querySelectorAll('.stat-val')[0], from: 0, to: 340, suffix: '+', decimals: 0 },
        { el: document.querySelectorAll('.stat-val')[1], from: 0, to: 0.8, suffix: 'mm', decimals: 1 },
        { el: document.querySelectorAll('.stat-val')[2], from: 0, to: 18, suffix: 'k', decimals: 0 },
        { el: document.querySelectorAll('.stat-val')[3], from: 0, to: 3, suffix: '×', decimals: 0 },
      ];

      counters.forEach(c => {
        if (!c.el) return;
        const obj = { val: c.from };
        gsap.to(obj, {
          val: c.to,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.stats', start: 'top 80%', once: true },
          onUpdate: () => {
            c.el.textContent = obj.val.toFixed(c.decimals) + c.suffix;
          }
        });
      });
    })();

    gsap.registerPlugin(ScrollTrigger);

    /* ─ CURSOR ────────────────────────────── */
    const cursor = document.getElementById('cursor');
    const cursorRing = document.getElementById('cursor-ring');
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
    });

    function lerp(a, b, t) { return a + (b - a) * t; }
    function animateCursor() {
      rx = lerp(rx, mx, 0.12);
      ry = lerp(ry, my, 0.12);
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top = ry + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.querySelectorAll('a, button, .magnetic').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width = '4px';
        cursor.style.height = '4px';
        cursorRing.style.width = '52px';
        cursorRing.style.height = '52px';
        cursorRing.style.borderColor = 'rgba(232,0,29,0.8)';
        cursorRing.style.transform = 'translate(-50%, -50%) rotate(45deg)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.width = '8px';
        cursor.style.height = '8px';
        cursorRing.style.width = '36px';
        cursorRing.style.height = '36px';
        cursorRing.style.borderColor = 'rgba(232,0,29,0.5)';
        cursorRing.style.transform = 'translate(-50%, -50%) rotate(0deg)';
      });
    });

    /* ─ HERO ENTRANCE (Se dispara tras el preloader) ── */
    gsap.set(['.hero-tag', '.hero-title', '.hero-sub', '.hero-actions', '.hero-metrics', '.scroll-hint'], { opacity: 0 });

    function initHeroAnimations() {
      const heroTl = gsap.timeline();

      // Animación del texto de entrada — FIX: también animar opacity del contenedor
      gsap.to('.hero-title', { opacity: 1, duration: 0.01 });
      gsap.to('.hero-title .char', {
        y: '0%', duration: 0.8, ease: 'power3.out', stagger: 0.03
      });

      heroTl
        .fromTo('.hero-tag', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '+=0.3')
        .fromTo('.hero-sub', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.5')
        .fromTo('.hero-actions', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.4')
        .fromTo('.hero-metrics', { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.7, ease: 'power2.out' }, '-=0.5')
        .fromTo('.scroll-hint', { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.2');
    }

    /* ─ HERO VIDEO autoplay fallback ─────── */
    const heroVideo = document.getElementById('hero-video');
    if (heroVideo) {
      heroVideo.play().catch(() => { });
    }

    /* ─ SERVICES CARDS ────────────────────── */
    gsap.from('.service-card', {
      scrollTrigger: { trigger: '.services-grid', start: 'top 80%' },
      opacity: 0, y: 40, duration: 0.7, stagger: 0.15, ease: 'power3.out'
    });

    /* ─ STATS ─────────────────────────────── */
    gsap.from('.stat-item', {
      scrollTrigger: { trigger: '.stats', start: 'top 80%' },
      opacity: 0, y: 30, duration: 0.6, stagger: 0.1, ease: 'power3.out'
    });

    /* ─ ABOUT BARS ────────────────────────── */
    ScrollTrigger.create({
      trigger: '#specialties',
      start: 'top 75%',
      onEnter: () => {
        document.querySelectorAll('.spec-fill').forEach(bar => {
          bar.style.width = bar.dataset.pct + '%';
        });
      }
    });

    /* ─ ABOUT content ─────────────────────── */
    gsap.from('.about-visual', {
      scrollTrigger: { trigger: '.about', start: 'top 75%' },
      opacity: 0, x: -40, duration: 0.9, ease: 'power3.out'
    });
    gsap.from('.about-content > *', {
      scrollTrigger: { trigger: '.about', start: 'top 75%' },
      opacity: 0, y: 30, duration: 0.7, stagger: 0.12, ease: 'power3.out'
    });

    /* ─ CONTACT ─────── */
    gsap.from('.contact-left > *', {
      scrollTrigger: { trigger: '.contact', start: 'top 75%' },
      opacity: 0, y: 30, duration: 0.7, stagger: 0.15, ease: 'power3.out'
    });
    gsap.from('.contact-form > *', {
      scrollTrigger: { trigger: '.contact', start: 'top 75%' },
      opacity: 0, x: 30, duration: 0.7, stagger: 0.15, ease: 'power3.out', delay: 0.2
    });

    /* ═══════════════════════════════════════════════════
       VIDEO SCRUB — Sincroniza el video con el scroll
       ═══════════════════════════════════════════════════ */
    (function () {
      const scrubVideo = document.getElementById('scrub-video');
      const progressBar = document.getElementById('scrub-progress');
      const caption1 = document.getElementById('caption-1');
      const caption2 = document.getElementById('caption-2');
      if (!scrubVideo) return;

      // Esperar a que el video tenga metadatos
      function initScrub() {
        const duration = scrubVideo.duration;
        if (!duration || isNaN(duration)) return;

        ScrollTrigger.create({
          trigger: '.video-section',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
          onUpdate: (self) => {
            const progress = self.progress;

            // Sincronizar currentTime del video
            if (scrubVideo.readyState >= 2) {
              const targetTime = progress * duration;
              // Forzar pausa y actualizar
              scrubVideo.pause();
              scrubVideo.currentTime = targetTime;
            }

            // Actualizar barra de progreso
            if (progressBar) {
              progressBar.style.width = (progress * 100) + '%';
            }

            // Caption 1: visible entre 10% y 40%
            if (caption1) {
              if (progress > 0.1 && progress < 0.4) {
                caption1.style.opacity = '1';
                caption1.style.transform = 'translateY(0)';
              } else {
                caption1.style.opacity = '0';
                caption1.style.transform = 'translateY(20px)';
              }
            }

            // Caption 2: visible entre 55% y 85%
            if (caption2) {
              if (progress > 0.55 && progress < 0.85) {
                caption2.style.opacity = '1';
                caption2.style.transform = 'translateY(0)';
              } else {
                caption2.style.opacity = '0';
                caption2.style.transform = 'translateY(20px)';
              }
            }
          }
        });

        // Asegurar que el video se cargue y se muestre el primer frame en mobile
        scrubVideo.play().then(() => {
          scrubVideo.pause();
        }).catch(() => { });

        ScrollTrigger.refresh();
      }

      // El video necesita estar cargado para conocer su duration
      if (scrubVideo.readyState >= 1) {
        initScrub();
      } else {
        scrubVideo.addEventListener('loadedmetadata', initScrub);
      }

      // Asegurar transiciones suaves en captions
      if (caption1) { caption1.style.transition = 'opacity 0.4s ease, transform 0.4s ease'; }
      if (caption2) { caption2.style.transition = 'opacity 0.4s ease, transform 0.4s ease'; }
    })();

    /* ═══════════════════════════════════════════════════
       HAMBURGER MENU — Mobile Navigation
       ═══════════════════════════════════════════════════ */
    (function () {
      const hamburger = document.getElementById('nav-hamburger');
      const navLinks = document.getElementById('nav-links');
      if (!hamburger || !navLinks) return;

      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
      });

      // Cerrar menú al click en un enlace
      navLinks.querySelectorAll('.nav-link-item').forEach(link => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('active');
          navLinks.classList.remove('open');
        });
      });
    })();

    /* ═══════════════════════════════════════════════════
       DISABLE MAGNETIC ON TOUCH
       ═══════════════════════════════════════════════════ */
    (function () {
      const isTouchDevice = window.matchMedia('(hover: none)').matches;
      if (isTouchDevice) {
        // Desactivar partículas pesadas en mobile
        const canvas = document.getElementById('particle-canvas');
        if (canvas) canvas.style.display = 'none';
      }
    })();

    /* ═══════════════════════════════════════════════════
       TELEMETRY SIMULATION
       ═══════════════════════════════════════════════════ */
    (function() {
      const canvases = {
        rpm: document.getElementById('canvas-rpm'),
        speed: document.getElementById('canvas-speed'),
        pedals: document.getElementById('canvas-pedals'),
        gforce: document.getElementById('canvas-gforce')
      };
      
      const ctxs = {};
      for (let k in canvases) {
        if (canvases[k]) {
          ctxs[k] = canvases[k].getContext('2d');
          canvases[k].width = canvases[k].offsetWidth;
          canvases[k].height = 100;
        }
      }

      const history = { rpm: [], speed: [] };
      const maxPts = 50;

      function drawLineChart(ctx, data, color, maxVal) {
        const w = ctx.canvas.width;
        const h = ctx.canvas.height;
        ctx.clearRect(0,0,w,h);
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        data.forEach((v, i) => {
          const x = (i / maxPts) * w;
          const y = h - (v / maxVal) * h;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
        
        ctx.lineTo(w, h); ctx.lineTo(0, h);
        ctx.fillStyle = color.replace('1)', '0.1)');
        ctx.fill();
      }

      function updateTelemetry() {
        const rpm = 11000 + Math.random() * 4000;
        const speed = 280 + Math.random() * 40;
        
        document.getElementById('val-rpm').innerText = Math.floor(rpm);
        document.getElementById('val-speed').innerText = Math.floor(speed);
        
        history.rpm.push(rpm); if (history.rpm.length > maxPts) history.rpm.shift();
        history.speed.push(speed); if (history.speed.length > maxPts) history.speed.shift();
        
        if (ctxs.rpm) drawLineChart(ctxs.rpm, history.rpm, 'rgba(232, 0, 29, 1)', 18000);
        if (ctxs.speed) drawLineChart(ctxs.speed, history.speed, 'rgba(255, 255, 255, 1)', 360) ;
        
        // Pedals
        if (ctxs.pedals) {
          const ctx = ctxs.pedals; const w = ctx.canvas.width; const h = ctx.canvas.height;
          ctx.clearRect(0,0,w,h);
          const t = Math.random() * 100; const b = Math.random() < 0.2 ? Math.random() * 80 : 0;
          ctx.fillStyle = 'rgba(0, 255, 136, 0.4)'; ctx.fillRect(0, 10, (t/100)*w, 30);
          ctx.fillStyle = 'rgba(232, 0, 29, 0.4)'; ctx.fillRect(0, 50, (b/100)*w, 30);
        }
        
        // G-Force
        if (ctxs.gforce) {
          const ctx = ctxs.gforce; const w = ctx.canvas.width; const h = ctx.canvas.height;
          ctx.clearRect(0,0,w,h);
          ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.strokeRect(w/2 - 40, h/2 - 40, 80, 80);
          ctx.beginPath(); ctx.arc(w/2 + (Math.random()-0.5)*40, h/2 + (Math.random()-0.5)*40, 4, 0, Math.PI*2);
          ctx.fillStyle = 'var(--red)'; ctx.fill();
        }
        
        setTimeout(() => requestAnimationFrame(updateTelemetry), 80);
      }
      
      ScrollTrigger.create({
        trigger: "#telemetry",
        start: "top bottom",
        onEnter: () => updateTelemetry()
      });
    })();

    /* ═══════════════════════════════════════════════════
       NEW SECTIONS ENTRANCE
       ═══════════════════════════════════════════════════ */
    gsap.from('.project-card', {
      scrollTrigger: { trigger: '.project-grid', start: 'top 85%' },
      opacity: 0, y: 50, duration: 0.8, stagger: 0.2, ease: 'power3.out'
    });

    gsap.from('.method-step', {
      scrollTrigger: { trigger: '.methodology', start: 'top 85%' },
      opacity: 0, x: -30, duration: 0.8, stagger: 0.2, ease: 'power3.out'
    });

    /* ═══════════════════════════════════════════════════
       SIGNAL TRANSITION GLITCH
       ═══════════════════════════════════════════════════ */
    ScrollTrigger.create({
      trigger: '#signal-glitch',
      start: 'top center',
      onEnter: () => {
        gsap.to('.glitch-noise', { opacity: 1, duration: 0.1, repeat: 5, yoyo: true });
        gsap.to('.glitch-text', { scale: 1.05, duration: 0.1, repeat: 3, yoyo: true });
      }
    });

    ScrollTrigger.create({
      trigger: '#live',
      start: 'top 60%',
      onEnter: () => {
        document.querySelector('#live').classList.add('active');
      }
    });
