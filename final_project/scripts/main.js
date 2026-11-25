import { initNavigation, setCopyright } from './modules/common.js';

initNavigation();
setCopyright();

async function loadFeatured() {
  const container = document.querySelector('#featured-dishes');
  try {
    const response = await fetch('./data/dishes.json');
    if (!response.ok) throw new Error(`Could not load dishes: ${response.status}`);
    const dishes = await response.json();
    const featured = dishes.filter((dish) => dish.featured).slice(0, 3);
    container.innerHTML = featured.map((dish) => `
      <article class="dish-card">
        <img src="${dish.image}" alt="${dish.imageAlt || `${dish.name} from Ghana`}" width="480" height="360" loading="lazy">
        <div class="dish-card-body">
          <p class="type">${dish.type}</p>
          <h3>${dish.name}</h3>
          <p>${dish.description}</p>
          <p><strong>Typical cost:</strong> ${dish.cost}</p>
        </div>
      </article>`).join('');
  } catch (error) {
    container.innerHTML = '<p>We could not load featured dishes. Please refresh the page.</p>';
    console.error(error);
  }
}

loadFeatured();
