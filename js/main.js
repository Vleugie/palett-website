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

  // Simple form handling
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.btn');
      btn.textContent = 'Message sent!';
      btn.style.background = '#27ae60';
      btn.style.borderColor = '#27ae60';
      setTimeout(() => {
        btn.textContent = 'Send message';
        btn.style.background = '';
        btn.style.borderColor = '';
        form.reset();
      }, 3000);
    });
  }
});
