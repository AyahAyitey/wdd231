/* ── Fetch discover data and build cards ── */
async function init() {
  let places = [];

  try {
    const res = await fetch('data/discover.mjs');
    const text = await res.text();
    // Parse the exported array from the .mjs file
    const match = text.match(/export const places\s*=\s*(\[[\s\S]*?\]);/);
    if (match) {
      places = JSON.parse(match[1]);
    }
  } catch (e) {
    console.warn('Could not load discover.mjs via fetch, using inline data.', e);
  }

  // Fallback inline data (used if fetch fails)
  if (!places.length) {
    places = [
      {
        name: "Osu Kente Weavers",
        address: "14 Oxford Street, Osu, Accra, Ghana",
        description: "Hand-woven kente cloth, bags, and gifts crafted by master artisans who have kept this traditional weaving art alive in Accra for generations.",
        image: "images/osu-kente-weavers.webp",
        imageAlt: "Gold and green woven kente cloth stripes"
      },
      {
        name: "Labadi Beach Bites",
        address: "3 Beach Road, Labadi, Accra, Ghana",
        description: "Fresh grilled tilapia, kelewele, and tropical juices served steps from the Atlantic shore. A must-visit seaside dining experience in Greater Accra.",
        image: "images/labadi-beach-bites.webp",
        imageAlt: "Sun setting over blue ocean waves at Labadi Beach"
      },
      {
        name: "Cantonments Tech Hub",
        address: "22 Fifth Avenue, Cantonments, Accra, Ghana",
        description: "Accra's premier co-working and startup community offering web development training, mentoring, and fast fibre connectivity for tech entrepreneurs.",
        image: "images/cantonments-tech-hub.webp",
        imageAlt: "Glowing circuit lines connecting nodes"
      },
      {
        name: "Adabraka Fresh Market",
        address: "8 Ring Road Central, Adabraka, Accra, Ghana",
        description: "Farm-direct fruit, vegetables, and spices sourced daily from Greater Accra farms. The city's most colourful and aromatic morning market.",
        image: "images/adabraka-fresh-market.webp",
        imageAlt: "Colourful arrangement of fresh tropical fruits and vegetables"
      },
      {
        name: "East Legon Dental Care",
        address: "41 Boundary Road, East Legon, Accra, Ghana",
        description: "Family dentistry clinic offering braces, cosmetic procedures, and same-day emergency appointments in a modern, fully-equipped facility.",
        image: "images/east-legon-dental-care.webp",
        imageAlt: "Bright dental clinic interior with dental chair"
      },
      {
        name: "Makola Print & Design",
        address: "57 Kojo Thompson Road, Makola, Accra, Ghana",
        description: "One-stop printing and branding shop producing banners, business cards, and full corporate identity packages for small and growing businesses.",
        image: "images/makola-print-design.webp",
        imageAlt: "Overlapping coloured printed squares and design samples"
      },
      {
        name: "Airport City Logistics",
        address: "9 Airport City Boulevard, Accra, Ghana",
        description: "Full-service freight, customs clearing, and last-mile delivery covering all regions of Ghana. Trusted partner for importers and exporters since 2007.",
        image: "images/airport-city-logistics.webp",
        imageAlt: "Stacked brown shipping boxes in a warehouse"
      },
      {
        name: "Jamestown Coffee Roasters",
        address: "5 High Street, Jamestown, Accra, Ghana",
        description: "Small-batch roasted single-origin Ghanaian coffee served in a quiet historic building in one of Accra's oldest neighbourhoods.",
        image: "images/jamestown-coffee-roasters.webp",
        imageAlt: "Steaming cup of freshly brewed coffee on a wooden table"
      }
    ];
  }

  buildCards(places);
  buildVisitMessage();
}

/* ── Build the 8 discovery cards ── */
function buildCards(places) {
  const grid = document.querySelector('#discover-grid');

  places.forEach((place, index) => {
    const card = document.createElement('article');
    card.classList.add('discover-card');

    // Lazy-load every image except the first two (above-the-fold)
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
}

/* ── localStorage: last-visit message ── */
function buildVisitMessage() {
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
}

init();
