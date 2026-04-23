/* ============================================================
   M'ÉCLAT BEAUTY STUDIO — script.js
============================================================ */

/* ============================================================
   1. PARTÍCULAS FLOTANTES DORADAS
============================================================ */
(function initParticles() {

  const canvas = document.createElement('canvas');
  canvas.id = 'particleCanvas';
  Object.assign(canvas.style, {
    position : 'fixed',
    top      : '0',
    left     : '0',
    width    : '100%',
    height   : '100%',
    pointerEvents : 'none',
    zIndex   : '0',
    opacity  : '1',
  });
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');

  const COLORS = [
    'rgba(201,168,76,',
    'rgba(232,201,106,',
    'rgba(245,230,184,',
    'rgba(122, 98, 48,',
  ];

  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', () => {
    resize();
    buildParticles();
  });

  resize();

  function createParticle(forceBottom = false) {
    const size   = Math.random() * 2.8 + 0.4;
    const color  = COLORS[Math.floor(Math.random() * COLORS.length)];
    const opacity = Math.random() * 0.55 + 0.08;
    const speed  = Math.random() * 0.4 + 0.12;
    const drift  = (Math.random() - 0.5) * 0.35;

    return {
      x       : Math.random() * W,
      y       : forceBottom ? H + Math.random() * 200 : Math.random() * H,
      size,
      color,
      opacity,
      speed,
      drift,
      twinkleSpeed : Math.random() * 0.018 + 0.006,
      twinkleDir   : Math.random() > 0.5 ? 1 : -1,
      opacityBase  : opacity,
    };
  }

  function particleCount() {
    if (W < 480)  return 55;
    if (W < 768)  return 85;
    if (W < 1280) return 130;
    return 180;
  }

  function buildParticles() {
    const count = particleCount();
    particles = Array.from({ length: count }, () => createParticle(false));
  }

  buildParticles();

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.opacity += p.twinkleSpeed * p.twinkleDir;
      if (p.opacity >= p.opacityBase + 0.18 || p.opacity <= 0.04) {
        p.twinkleDir *= -1;
      }
      p.opacity = Math.max(0.04, Math.min(p.opacity, 0.75));

      p.y    -= p.speed;
      p.x    += p.drift;

      if (p.x < -10)  p.x = W + 10;
      if (p.x > W + 10) p.x = -10;

      if (p.y < -10) {
        particles[i] = createParticle(true);
        continue;
      }

      ctx.save();

      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3.5);
      gradient.addColorStop(0,   p.color + (p.opacity) + ')');
      gradient.addColorStop(0.4, p.color + (p.opacity * 0.4) + ')');
      gradient.addColorStop(1,   p.color + '0)');

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.min(p.opacity + 0.3, 1) + ')';
      ctx.fill();

      ctx.restore();
    }

    requestAnimationFrame(draw);
  }

  draw();

})();


/* ============================================================
   2. MENÚ HAMBURGUESA
============================================================ */
(function initMenu() {

  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const sidebar      = document.getElementById('sidebar');
  const sidebarClose = document.getElementById('sidebarClose');
  const overlay      = document.getElementById('menuOverlay');

  if (!hamburgerBtn || !sidebar) return;

  function openMenu() {
    sidebar.classList.add('is-open');
    overlay.classList.add('is-active');
    hamburgerBtn.classList.add('is-open');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    sidebar.classList.remove('is-open');
    overlay.classList.remove('is-active');
    hamburgerBtn.classList.remove('is-open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburgerBtn.addEventListener('click', function () {
    const isOpen = sidebar.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  });

  if (sidebarClose) {
    sidebarClose.addEventListener('click', closeMenu);
  }

  overlay.addEventListener('click', closeMenu);

  const sidebarLinks = sidebar.querySelectorAll('.sidebar__link');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && sidebar.classList.contains('is-open')) {
      closeMenu();
      hamburgerBtn.focus();
    }
  });

})();


/* ============================================================
   3. HEADER — efecto al hacer scroll
============================================================ */
(function initHeader() {

  const header = document.getElementById('header');
  if (!header) return;

  let ticking = false;

  function updateHeader() {
    if (window.scrollY > 20) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });

})();


/* ============================================================
   4. SCROLL REVEAL
============================================================ */
(function initScrollReveal() {

  const targets = [
    { selector: '.about .section-label',         cls: 'reveal' },
    { selector: '.about .section-title',         cls: 'reveal' },
    { selector: '.about .gold-divider',          cls: 'reveal' },
    { selector: '.about__card:nth-child(1)',      cls: 'reveal reveal-d1' },
    { selector: '.about__card:nth-child(2)',      cls: 'reveal reveal-d2' },
    { selector: '.about__card:nth-child(3)',      cls: 'reveal reveal-d3' },
    { selector: '.services .section-label',      cls: 'reveal' },
    { selector: '.services .section-title',      cls: 'reveal' },
    { selector: '.services .gold-divider',       cls: 'reveal' },
    { selector: '.services__category-title',     cls: 'reveal' },
    { selector: '.booking .section-label',       cls: 'reveal' },
    { selector: '.booking .section-title',       cls: 'reveal' },
    { selector: '.booking .gold-divider',        cls: 'reveal' },
    { selector: '.contact .section-label',       cls: 'reveal' },
    { selector: '.contact .section-title',       cls: 'reveal' },
    { selector: '.contact .gold-divider',        cls: 'reveal' },
    { selector: '.contact__item',                cls: 'reveal' },
    { selector: '.contact__cta',                 cls: 'reveal reveal-d2' },
    { selector: '.footer__logo',                 cls: 'reveal' },
    { selector: '.footer__links',                cls: 'reveal reveal-d1' },
    { selector: '.footer__social',               cls: 'reveal reveal-d2' },
    { selector: '.footer__copy',                 cls: 'reveal reveal-d3' },
  ];

  targets.forEach(({ selector, cls }) => {
    document.querySelectorAll(selector).forEach(el => {
      cls.split(' ').forEach(c => el.classList.add(c));
    });
  });

  document.querySelectorAll('.services__cards').forEach(grid => {
    const cards = grid.querySelectorAll('.service-card');
    cards.forEach((card, i) => {
      card.classList.add('reveal');
      const d = (i % 3) + 1;
      card.classList.add(`reveal-d${d}`);
    });
  });

  const observerOptions = {
    threshold  : 0.1,
    rootMargin : '0px 0px -40px 0px',
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  function observeAll() {
    document.querySelectorAll('.reveal, .reveal-left').forEach(el => {
      observer.observe(el);
    });
  }

  observeAll();

  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal, .reveal-left').forEach(el => {
      el.classList.add('is-visible');
    });
  }

})();


/* ============================================================
   5. NAVEGACIÓN ACTIVA
============================================================ */
(function initActiveNav() {

  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.header__nav-link');
  const sideLinks = document.querySelectorAll('.sidebar__link');

  if (!sections.length) return;

  function setActive(id) {
    [...navLinks, ...sideLinks].forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${id}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActive(entry.target.id);
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(sec => sectionObserver.observe(sec));

})();


/* ============================================================
   6. SMOOTH SCROLL
============================================================ */
(function initSmoothScroll() {

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      if (!targetId) return;

      const target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();

      const headerH = document.getElementById('header')?.offsetHeight || 68;
      const top     = target.getBoundingClientRect().top + window.scrollY - headerH;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

})();


/* ============================================================
   7. FORMULARIO DE RESERVA + MODAL DE ÉXITO
============================================================ */
(function initBooking() {

  const form          = document.getElementById('bookingForm');
  const overlay       = document.getElementById('successOverlay');
  const successClose  = document.getElementById('successClose');
  const successName   = document.getElementById('successName');
  const successDetail = document.getElementById('successDetail');
  const successCanvas = document.getElementById('successCanvas');
  const submitBtn     = document.getElementById('bookingSubmit');

  if (!form) return;

  /* ── Establece fecha mínima en hoy ── */
  const dateInput = document.getElementById('bookingDate');
  if (dateInput) {
    const today = new Date();
    const yyyy  = today.getFullYear();
    const mm    = String(today.getMonth() + 1).padStart(2, '0');
    const dd    = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  /* ── Formatear fecha legible ── */
  function formatDate(dateStr) {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    const months = ['enero','febrero','marzo','abril','mayo','junio',
                    'julio','agosto','septiembre','octubre','noviembre','diciembre'];
    return `${parseInt(d)} de ${months[parseInt(m) - 1]} de ${y}`;
  }

  /* ── Formatear hora legible ── */
  function formatTime(timeStr) {
    if (!timeStr) return '';
    const [h, min] = timeStr.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12  = hour % 12 || 12;
    return `${h12}:${min} ${ampm}`;
  }

  /* ── Validación de campo ── */
  function validateField(input) {
    const field = input.closest('.booking__field');
    const existing = field.querySelector('.booking__error-msg');
    if (existing) existing.remove();
    input.classList.remove('is-error');

    if (!input.value.trim()) {
      input.classList.add('is-error');
      const msg = document.createElement('p');
      msg.className = 'booking__error-msg';
      msg.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Este campo es requerido.';
      field.appendChild(msg);
      return false;
    }
    return true;
  }

  /* ── Limpiar errores al escribir ── */
  form.querySelectorAll('.booking__input').forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('is-error');
      const msg = input.closest('.booking__field').querySelector('.booking__error-msg');
      if (msg) msg.remove();
    });
  });

  /* ── SUBMIT ── */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nameEl    = document.getElementById('bookingName');
    const serviceEl = document.getElementById('bookingService');
    const dateEl    = document.getElementById('bookingDate');
    const timeEl    = document.getElementById('bookingTime');
    const noteEl    = document.getElementById('bookingNote');

const valid = [nameEl, serviceEl, dateEl, timeEl].map(validateField).every(Boolean);
if (!valid) return;

/* Validar que la fecha no sea pasada */
const selectedDate = new Date(dateEl.value + 'T00:00:00');
const todayDate = new Date();
todayDate.setHours(0, 0, 0, 0);

if (selectedDate < todayDate) {
  dateEl.classList.add('is-error');
  const field = dateEl.closest('.booking__field');
  const existing = field.querySelector('.booking__error-msg');
  if (!existing) {
    const errMsg = document.createElement('p');
    errMsg.className = 'booking__error-msg';
    errMsg.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> La fecha no puede ser en el pasado.';
    field.appendChild(errMsg);
  }
  return;
}

    const name    = nameEl.value.trim();
    const service = serviceEl.value;
    const date    = dateEl.value;
    const time    = timeEl.value;
    const note    = noteEl.value.trim();

    /* ── Construir mensaje de WhatsApp ── */
let msg = `Hola! Quisiera reservar una cita en M'Eclat Beauty Studio.\n\n`;
msg += `Nombre: ${name}\n`;
msg += `Servicio: ${service}\n`;
msg += `Fecha: ${formatDate(date)}\n`;
msg += `Hora: ${formatTime(time)}\n`;
if (note) {
  msg += `Nota: ${note}\n`;
}
msg += `\nMuchas gracias!`;

    const waURL = `https://wa.me/18496500647?text=${encodeURIComponent(msg)}`;

    /* ── Mostrar modal de éxito ── */
    successName.textContent = name;

    successDetail.innerHTML = `
      <div style="margin-bottom:6px">💆 <span>${service}</span></div>
      <div style="margin-bottom:6px">📅 <span>${formatDate(date)}</span></div>
      <div>${'🕐'} <span>${formatTime(time)}</span></div>
      ${note ? `<div style="margin-top:6px">📝 <span>${note}</span></div>` : ''}
    `;

    /* Mostrar overlay */
    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('is-visible');
    document.body.style.overflow = 'hidden';

    /* Lanzar confetti */
    launchConfetti();

    /* Agregar estrellitas decorativas */
    addStars();

    /* Abrir WhatsApp después de breve pausa (UX: el usuario ve el éxito primero) */
    setTimeout(() => {
      window.open(waURL, '_blank', 'noopener,noreferrer');
    }, 1200);
  });

  /* ── Cerrar modal ── */
  function closeModal() {
    overlay.classList.remove('is-visible');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    /* Resetear formulario */
    setTimeout(() => {
      form.reset();
      /* Reiniciar animaciones del SVG */
      const circle = document.querySelector('.success-checkmark__circle');
      const check  = document.querySelector('.success-checkmark__check');
      if (circle) { circle.style.animation = 'none'; void circle.offsetWidth; circle.style.animation = ''; }
      if (check)  { check.style.animation  = 'none'; void check.offsetWidth;  check.style.animation  = ''; }
    }, 400);
  }

  if (successClose) {
    successClose.addEventListener('click', closeModal);
  }

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('is-visible')) {
      closeModal();
    }
  });


  /* ============================================================
     CONFETTI DORADO en el canvas del modal
  ============================================================ */
  function launchConfetti() {
    if (!successCanvas) return;

    const modal = document.getElementById('successModal');
    const W     = modal.offsetWidth;
    const H     = modal.offsetHeight;
    successCanvas.width  = W;
    successCanvas.height = H;

    const ctx = successCanvas.getContext('2d');

    /* Colores del confetti: tonos dorados + blanco */
    const COLORS = ['#c9a84c','#e8c96a','#f5e6b8','#fff8e7','#a07830','#ffffff'];
    const SHAPES = ['circle','rect','diamond'];

    /* Crear partículas */
    const particles = Array.from({ length: 65 }, () => ({
      x     : Math.random() * W,
      y     : -10 - Math.random() * 40,
      w     : Math.random() * 8 + 4,
      h     : Math.random() * 5 + 3,
      color : COLORS[Math.floor(Math.random() * COLORS.length)],
      shape : SHAPES[Math.floor(Math.random() * SHAPES.length)],
      rot   : Math.random() * Math.PI * 2,
      rotSpd: (Math.random() - 0.5) * 0.18,
      vx    : (Math.random() - 0.5) * 3,
      vy    : Math.random() * 3 + 2,
      alpha : 1,
      fade  : Math.random() * 0.012 + 0.006,
    }));

    let frame = 0;
    const MAX_FRAMES = 200;

    function drawConfetti() {
      ctx.clearRect(0, 0, W, H);

      let allDone = true;

      particles.forEach(p => {
        if (p.alpha <= 0) return;
        allDone = false;

        p.x   += p.vx;
        p.y   += p.vy;
        p.vy  += 0.06; /* gravedad */
        p.rot += p.rotSpd;

        /* Fade out después de caer */
        if (p.y > H * 0.5) p.alpha -= p.fade;
        p.alpha = Math.max(0, p.alpha);

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'rect') {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        } else {
          /* diamond */
          ctx.beginPath();
          ctx.moveTo(0, -p.h);
          ctx.lineTo(p.w / 2, 0);
          ctx.lineTo(0, p.h);
          ctx.lineTo(-p.w / 2, 0);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      });

      frame++;
      if (!allDone && frame < MAX_FRAMES) {
        requestAnimationFrame(drawConfetti);
      } else {
        ctx.clearRect(0, 0, W, H);
      }
    }

    drawConfetti();
  }


  /* ── Estrellitas decorativas alrededor del ícono ── */
  function addStars() {
    const modal = document.getElementById('successModal');

    /* Limpiar estrellas anteriores */
    modal.querySelectorAll('.success-star').forEach(s => s.remove());

    const positions = [
      { top: '18%', left: '12%' },
      { top: '14%', right: '14%' },
      { top: '35%', left: '6%' },
      { top: '32%', right: '8%' },
      { top: '58%', left: '10%' },
      { top: '55%', right: '11%' },
    ];

    const icons = ['✦', '✧', '✦', '✧', '✦', '✧'];

    positions.forEach((pos, i) => {
      const star = document.createElement('span');
      star.className = 'success-star';
      star.textContent = icons[i];
      star.style.top   = pos.top   || 'auto';
      star.style.left  = pos.left  || 'auto';
      star.style.right = pos.right || 'auto';
      star.style.animationDelay = `${0.3 + i * 0.12}s`;
      star.style.fontSize = i % 2 === 0 ? '1rem' : '0.6rem';
      modal.appendChild(star);
    });
  }

})();