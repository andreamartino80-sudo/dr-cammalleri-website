// FAQ accordion
document.querySelectorAll('.faq-item').forEach(item => {
  const question = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');
  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      if (openItem !== item) {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-answer').style.maxHeight = null;
      }
    });
    if (isOpen) {
      item.classList.remove('open');
      answer.style.maxHeight = null;
    } else {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

// Cookie banner
const cookieBanner = document.getElementById('cookieBanner');
const cookieAccept = document.getElementById('cookieAccept');
const cookieReject = document.getElementById('cookieReject');
if (cookieBanner) {
  const consent = localStorage.getItem('cookieConsent');
  if (!consent) {
    setTimeout(() => cookieBanner.classList.add('visible'), 600);
  }
  cookieAccept.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'all');
    cookieBanner.classList.remove('visible');
    // Se in futuro aggiungi Google Analytics / Meta Pixel,
    // inizializzali qui SOLO dopo il consenso (consent = 'all').
  });
  cookieReject.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'necessary');
    cookieBanner.classList.remove('visible');
  });
}

// Animated stat counter (only present on the homepage)
const statsEl = document.querySelector('.about-stats');
if (statsEl) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      statsEl.querySelectorAll('.stat-num[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count, 10);
        const duration = 900;
        const start = performance.now();
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
      statsEl.querySelectorAll('.stat-num-static').forEach((el, i) => {
        setTimeout(() => el.classList.add('in'), i * 150);
      });
      statsObserver.unobserve(statsEl);
    });
  }, { threshold: 0.4 });
  statsObserver.observe(statsEl);
}

// Floating "Prenota" button: show after scrolling past hero, hide once booking section is reached
const fabBook = document.querySelector('.fab-book');
const heroEl = document.querySelector('.hero, .page-hero');
const prenotaEl = document.getElementById('prenota');
if (fabBook && heroEl && prenotaEl) {
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      fabBook.classList.toggle('visible', !entry.isIntersecting);
    });
  }, { threshold: 0 });
  heroObserver.observe(heroEl);

  const prenotaObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) fabBook.classList.remove('visible');
    });
  }, { threshold: 0.3 });
  prenotaObserver.observe(prenotaEl);
}

// Mobile nav toggle
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileNav.classList.remove('open')));
}

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

// Before/After tabs (only present on the homepage gallery)
const baTabs = document.querySelectorAll('.ba-tab');
const baCases = document.querySelectorAll('.ba-case');
baTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    baTabs.forEach(t => t.classList.remove('active'));
    baCases.forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.target).classList.add('active');
  });
});

// Booking form -> mailto
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
  bookingForm.addEventListener('submit', function(e){
    e.preventDefault();
    const f = e.target;
    const nome = f.fName.value.trim();
    const cognome = f.fSurname.value.trim();
    const email = f.fEmail.value.trim();
    const telefono = f.fPhone.value.trim();
    const studio = f.fStudio.value;
    const trattamento = f.fTreatment.value;
    const messaggio = f.fMessage.value.trim();

    const subject = `Richiesta di prenotazione — ${nome} ${cognome}`;
    const body =
`Nome: ${nome} ${cognome}
Email: ${email}
Telefono: ${telefono || '—'}
Studio preferito: ${studio}
Trattamento di interesse: ${trattamento}

Messaggio:
${messaggio || '—'}`;

    window.location.href = `mailto:info@drmarcellocammalleri.it?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}
