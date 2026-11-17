import { places } from '../data/discover.mjs';

/* ── Build the 8 discovery cards ── */
const grid = document.querySelector('#discover-grid');

places.forEach((place, index) => {
  const card = document.createElement('article');
  card.classList.add('discover-card');

  // Lazy-load every image except the first two (above-the-fold heuristic)
  const loadingAttr = index < 2 ? 'eager' : 'lazy';

  card.innerHTML = `
    <figure class="discover-card__figure">
      <img
        src="${place.image}"
        alt="${place.imageAlt}"
        width="300"
        height="200"
        loading="${loadingAttr}">
    </figure>
    <div class="discover-card__body">
      <h2>${place.name}</h2>
      <address>${place.address}</address>
      <p>${place.description}</p>
      <button type="button" class="learn-more-btn">Learn More</button>
    </div>
  `;

  grid.appendChild(card);
});

/* ── localStorage: last-visit message ── */
const msgEl = document.querySelector('#visit-message');

const now = Date.now();
const lastVisit = localStorage.getItem('discoverLastVisit');

let message;

if (!lastVisit) {
  message = 'Welcome! Let us know if you have any questions.';
} else {
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysDiff = Math.floor((now - Number(lastVisit)) / msPerDay);

  if (daysDiff < 1) {
    message = 'Back so soon! Awesome!';
  } else if (daysDiff === 1) {
    message = 'You last visited 1 day ago.';
  } else {
    message = `You last visited ${daysDiff} days ago.`;
  }
}

msgEl.textContent = message;

// Store current visit timestamp
localStorage.setItem('discoverLastVisit', now);
