export function initNavigation() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#primary-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('open', !open);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('open');
    }
  });
}

export function setCopyright() {
  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();
}
