/**
 * Asmitha Developer Portfolio - Main Script
 * Pure Vanilla JavaScript (No external frameworks)
 * Features: Dark/Light Mode, Mobile Drawer, Sticky Nav, Filters, Copy-to-Clipboard, Modal, Form Handling
 */

(function () {
  'use strict';

  // --- 1. Theme Toggle Logic ---
  const THEME_STORAGE_KEY = 'asmitha_theme_preference';
  const themeToggleBtns = document.querySelectorAll('[data-action="toggle-theme"]');
  const htmlElement = document.documentElement;

  function getInitialTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme) {
      return savedTheme;
    }
    // Default to light theme per design preference, but check prefers-color-scheme if desired
    return 'light';
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      htmlElement.setAttribute('data-theme', 'dark');
      themeToggleBtns.forEach(btn => {
        btn.setAttribute('aria-label', 'Switch to light theme');
      });
    } else {
      htmlElement.removeAttribute('data-theme');
      themeToggleBtns.forEach(btn => {
        btn.setAttribute('aria-label', 'Switch to dark theme');
      });
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }

  // Initialize Theme
  applyTheme(getInitialTheme());

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isDark = htmlElement.getAttribute('data-theme') === 'dark';
      const newTheme = isDark ? 'light' : 'dark';
      applyTheme(newTheme);
      showToast(`Switched to ${newTheme} theme`);
    });
  });

  // --- 2. Sticky Header & Scroll Effects ---
  const siteHeader = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      siteHeader?.classList.add('is-scrolled');
    } else {
      siteHeader?.classList.remove('is-scrolled');
    }
  }, { passive: true });

  // --- 3. Mobile Navigation Drawer ---
  const mobileToggleBtn = document.querySelector('.btn-hamburger');
  const mobileDrawerOverlay = document.querySelector('.mobile-drawer-overlay');
  const mobileDrawerCloseBtn = document.querySelector('.btn-close-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileDrawer() {
    mobileDrawerOverlay?.classList.add('is-open');
    mobileToggleBtn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileDrawer() {
    mobileDrawerOverlay?.classList.remove('is-open');
    mobileToggleBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  mobileToggleBtn?.addEventListener('click', openMobileDrawer);
  mobileDrawerCloseBtn?.addEventListener('click', closeMobileDrawer);

  mobileDrawerOverlay?.addEventListener('click', (e) => {
    if (e.target === mobileDrawerOverlay) {
      closeMobileDrawer();
    }
  });

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileDrawer);
  });

  // --- 4. Active Navigation Highlighting via IntersectionObserver ---
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-link');

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          desktopNavLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
          mobileNavLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));
  }

  // --- 5. Skills Category Filtering ---
  const skillFilterBtns = document.querySelectorAll('[data-skill-filter]');
  const skillCategoryGroups = document.querySelectorAll('[data-skill-category]');

  skillFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      skillFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-skill-filter');

      skillCategoryGroups.forEach(group => {
        const category = group.getAttribute('data-skill-category');
        if (filterValue === 'all' || category === filterValue) {
          group.style.display = 'block';
        } else {
          group.style.display = 'none';
        }
      });
    });
  });

  // --- 6. Projects Filtering ---
  const projectFilterBtns = document.querySelectorAll('[data-project-filter]');
  const projectCards = document.querySelectorAll('[data-project-category]');

  projectFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      projectFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const target = btn.getAttribute('data-project-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-project-category');
        if (target === 'all' || category === target) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- 7. Toast Notification Utility ---
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, duration = 3000) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      setTimeout(() => {
        toast.remove();
      }, 250);
    }, duration);
  }

  // Make showToast accessible globally if needed
  window.showPortfolioToast = showToast;

  // --- 8. Copy to Clipboard Functionality ---
  const copyButtons = document.querySelectorAll('[data-copy-value]');
  copyButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const value = button.getAttribute('data-copy-value');
      const label = button.getAttribute('data-copy-label') || 'Text';

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value)
          .then(() => {
            showToast(`${label} copied to clipboard!`);
          })
          .catch(() => {
            fallbackCopy(value, label);
          });
      } else {
        fallbackCopy(value, label);
      }
    });
  });

  function fallbackCopy(text, label) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(`${label} copied to clipboard!`);
    } catch (err) {
      showToast(`Please manually copy: ${text}`);
    }
    document.body.removeChild(textArea);
  }

  // --- 9. Resume Modal Dialog ---
  const resumeModal = document.getElementById('resumeModal');
  const openResumeBtns = document.querySelectorAll('[data-action="open-resume"]');
  const closeResumeBtns = document.querySelectorAll('[data-action="close-resume"]');
  const printResumeBtn = document.getElementById('btnPrintResume');

  function openResumeModal() {
    if (!resumeModal) return;
    resumeModal.classList.add('is-open');
    resumeModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeResumeModal() {
    if (!resumeModal) return;
    resumeModal.classList.remove('is-open');
    resumeModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openResumeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openResumeModal();
    });
  });

  closeResumeBtns.forEach(btn => {
    btn.addEventListener('click', closeResumeModal);
  });

  resumeModal?.addEventListener('click', (e) => {
    if (e.target === resumeModal) {
      closeResumeModal();
    }
  });

  printResumeBtn?.addEventListener('click', () => {
    window.print();
  });

  // Global Keydown Handler (Escape to close modals & drawers)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (resumeModal?.classList.contains('is-open')) {
        closeResumeModal();
      }
      if (mobileDrawerOverlay?.classList.contains('is-open')) {
        closeMobileDrawer();
      }
    }
  });

  // --- 10. Contact Form Handling ---
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('senderName');
    const emailInput = document.getElementById('senderEmail');
    const subjectInput = document.getElementById('msgSubject');
    const messageInput = document.getElementById('msgBody');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !email || !message) {
      if (formFeedback) {
        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = 'Please fill out your name, email, and message.';
      }
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      if (formFeedback) {
        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = 'Please enter a valid email address.';
      }
      return;
    }

    // Build mailto URI to launch user's preferred email client directly
    const emailTo = 'asmithanaik99@gmail.com';
    const emailSubject = encodeURIComponent(subject || `Portfolio Inquiry from ${name}`);
    const emailBody = encodeURIComponent(`Hello Asmitha,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\nSent from your Portfolio Website`);

    const mailtoUrl = `mailto:${emailTo}?subject=${emailSubject}&body=${emailBody}`;

    if (formFeedback) {
      formFeedback.className = 'form-feedback success';
      formFeedback.textContent = 'Thank you! Opening your email client to send message...';
    }

    showToast('Opening email client...');

    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 600);
  });

  // --- 11. Back to Top Smooth Scroll ---
  const backToTopBtn = document.getElementById('btnBackToTop');
  backToTopBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // --- 12. Dynamic Year Updater ---
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

})();
