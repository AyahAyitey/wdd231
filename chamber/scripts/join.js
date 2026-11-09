/**
 * join.js – Membership application page scripts
 * Handles: timestamp injection, modal open/close, card entrance animation
 */

// ── 1. Timestamp hidden field ──────────────────────────────────────────────
// Populate the hidden timestamp field with the current date/time when the
// form is loaded into the browser.
(function setTimestamp() {
  const tsField = document.getElementById('timestamp');
  if (!tsField) return;
  const now = new Date();
  // ISO-style but human readable: e.g. "2026-11-09T14:35:22"
  const pad = (n) => String(n).padStart(2, '0');
  const formatted =
    `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}` +
    `T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  tsField.value = formatted;
})();


// ── 2. Membership card animations ─────────────────────────────────────────
// Add the .animate class after a brief delay so the CSS @keyframes triggers
// on page load (not on hover). Respects prefers-reduced-motion.
(function animateCards() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const cards = document.querySelectorAll('.mem-card');
  // Use requestAnimationFrame + small timeout so the animation fires fresh
  // after the initial paint.
  requestAnimationFrame(() => {
    setTimeout(() => {
      cards.forEach((card) => card.classList.add('animate'));
    }, 80);
  });
})();


// ── 3. Modal open / close ──────────────────────────────────────────────────
(function initModals() {
  // Open: any button with [data-modal] attribute
  document.querySelectorAll('[data-modal]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      if (modal) modal.showModal();
    });
  });

  // Close: any button with [data-close] attribute, or clicking the backdrop
  document.querySelectorAll('[data-close]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close');
      const modal = document.getElementById(modalId);
      if (modal) modal.close();
    });
  });

  // Close on backdrop click (click outside the modal-inner content)
  document.querySelectorAll('.benefit-modal').forEach((modal) => {
    modal.addEventListener('click', (e) => {
      // The dialog element itself is the backdrop; clicks on the inner content
      // bubble up to the dialog but the target will be the dialog itself only
      // when the backdrop is clicked.
      if (e.target === modal) modal.close();
    });
  });

  // Close on Escape key is handled natively by <dialog> — no extra code needed.
})();
