document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');
  const body = document.body;

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  body.appendChild(overlay);

  // Scroll header effect
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  });

  // Mobile menu toggle
  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    overlay.classList.toggle('active');
    body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  });

  overlay.addEventListener('click', () => {
    nav.classList.remove('open');
    overlay.classList.remove('active');
    body.style.overflow = '';
  });

  // Dropdown toggle (click instead of hover, so it never gets stuck open while scrolling)
  document.querySelectorAll('.has-dropdown > a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const parent = link.parentElement;
      const wasOpen = parent.classList.contains('open');
      document.querySelectorAll('.has-dropdown.open').forEach(el => el.classList.remove('open'));
      if (!wasOpen) parent.classList.add('open');
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.has-dropdown')) {
      document.querySelectorAll('.has-dropdown.open').forEach(el => el.classList.remove('open'));
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.has-dropdown.open').forEach(el => el.classList.remove('open'));
    }
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        nav.classList.remove('open');
        overlay.classList.remove('active');
        body.style.overflow = '';
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Contact form handling — submits to FormSubmit via AJAX so it stays on the page
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.btn');
      const originalText = btn.textContent;
      let note = form.querySelector('.form-error');
      btn.disabled = true;
      btn.textContent = 'Sending...';

      const ajaxUrl = form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/');

      fetch(ajaxUrl, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      })
        .then((res) => res.json().catch(() => ({})).then((data) => ({ ok: res.ok, data })))
        .then(({ ok, data }) => {
          // FormSubmit can answer HTTP 200 with success:"false" (e.g. form not activated yet)
          if (!ok || String(data.success) !== 'true') throw new Error('Request failed');
          btn.textContent = 'Message sent!';
          btn.style.background = '#27ae60';
          btn.style.borderColor = '#27ae60';
          form.reset();
          if (note) note.hidden = true;
        })
        .catch(() => {
          btn.textContent = 'Not sent';
          btn.style.background = '#c0392b';
          btn.style.borderColor = '#c0392b';
          if (!note) {
            note = document.createElement('p');
            note.className = 'form-error';
            note.style.cssText = 'margin-top:12px;color:#c0392b;font-size:0.9rem;';
            form.appendChild(note);
          }
          note.textContent = 'Sorry, your message could not be sent. Please email hetpalett@ziggo.nl or call 06-41388006.';
          note.hidden = false;
        })
        .finally(() => {
          btn.disabled = false;
          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.style.borderColor = '';
          }, 4000);
        });
    });
  }
});
