/* NU-FIX, LLC — main.js (vanilla JS, no libraries) */

/* 1. HAMBURGER MOBILE MENU */
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileClose = document.querySelector('.mobile-close');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  });
  const closeMenu = () => {
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  if (mobileClose) mobileClose.addEventListener('click', closeMenu);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
}

/* 2. FAQ ACCORDION */
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');
  if (question && answer) {
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(i => {
        i.classList.remove('open');
        const a = i.querySelector('.faq-answer');
        if (a) a.style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  }
});

/* 3. SCROLL ANIMATIONS */
const animatedEls = document.querySelectorAll('.fade-in');
if (animatedEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  animatedEls.forEach(el => observer.observe(el));
}

/* 4. ACTIVE NAV LINK */
const currentPath = window.location.pathname;
const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
navLinks.forEach(link => {
  const href = link.getAttribute('href');
  if (href === '/' ? currentPath === '/' : href && currentPath.startsWith(href)) {
    link.classList.add('active');
  }
});

/* 5. FORM VALIDATION (submits to Netlify Forms) — applies to every .ajax-form on the page */
document.querySelectorAll('form.ajax-form').forEach(contactForm => {
  contactForm.addEventListener('submit', (e) => {
    let valid = true;
    const required = contactForm.querySelectorAll('[required]');
    required.forEach(field => {
      const error = field.parentElement.querySelector('.form-error');
      if (!field.value.trim()) {
        valid = false;
        if (error) error.classList.add('show');
        field.style.borderColor = '#C4302B';
      } else {
        if (error) error.classList.remove('show');
        field.style.borderColor = '';
      }
    });
    const emailField = contactForm.querySelector('[type="email"]');
    if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      valid = false;
      const emailError = emailField.parentElement.querySelector('.form-error');
      if (emailError) {
        emailError.textContent = 'Please enter a valid email address.';
        emailError.classList.add('show');
      }
      emailField.style.borderColor = '#C4302B';
    }
    /* honeypot — bots fill hidden fields, humans never see them */
    const honeypot = contactForm.querySelector('input[name="_gotcha"]');
    if (honeypot && honeypot.value) valid = false;

    if (!valid) { e.preventDefault(); return; }

    /* send via fetch so the visitor stays on the page; falls back to a normal POST if JS fails */
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const btnText = btn ? btn.textContent : '';
    if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(contactForm)).toString()
    }).then(res => {
      if (!res.ok) throw new Error('Form submit failed');
      const done = document.createElement('div');
      done.className = 'form-success';
      done.setAttribute('role', 'status');
      done.innerHTML = '<strong>Thank you. Your request is in.</strong><br>We will get back to you shortly. For urgent leaks, call <a href="tel:2676401778">267.640.1778</a>.';
      contactForm.replaceWith(done);
    }).catch(() => {
      if (btn) { btn.disabled = false; btn.textContent = btnText; }
      let err = contactForm.querySelector('.form-submit-error');
      if (!err) {
        err = document.createElement('p');
        err.className = 'form-submit-error';
        err.setAttribute('role', 'alert');
        contactForm.appendChild(err);
      }
      err.innerHTML = 'Sorry, something went wrong. Please call <a href="tel:2676401778">267.640.1778</a> or email <a href="mailto:service@nu-fix.com">service@nu-fix.com</a>.';
    });
  });
  contactForm.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('input', () => {
      field.style.borderColor = '';
      const error = field.parentElement.querySelector('.form-error');
      if (error) error.classList.remove('show');
    });
  });
});

/* 6. GALLERY / SERVICE FILTER */
const filterBtns = document.querySelectorAll('.filter-btn');
const filterCards = document.querySelectorAll('[data-category]');
if (filterBtns.length && filterCards.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      filterCards.forEach(card => {
        card.style.display = (cat === 'all' || card.dataset.category === cat) ? '' : 'none';
      });
    });
  });
}
