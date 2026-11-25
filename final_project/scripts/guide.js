import { initNavigation, setCopyright } from './modules/common.js';

initNavigation();
setCopyright();

const grid = document.querySelector('#dish-grid');
const filter = document.querySelector('#category-filter');
const savedOnlyButton = document.querySelector('#saved-only');
const savedCount = document.querySelector('#saved-count');
const resultCount = document.querySelector('#result-count');
const dialog = document.querySelector('#dish-dialog');
const dialogContent = document.querySelector('#dialog-content');
const closeButton = document.querySelector('.dialog-close');
let dishes = [];
let savedIds = [];
try {
  const savedValue = JSON.parse(localStorage.getItem('savedDishes') || '[]');
  savedIds = Array.isArray(savedValue) ? savedValue : [];
} catch (error) {
  console.warn('Saved dishes could not be restored.', error);
  localStorage.removeItem('savedDishes');
}
let showSavedOnly = false;

function updateSavedCount() {
  savedCount.textContent = savedIds.length;
  savedOnlyButton.setAttribute('aria-pressed', String(showSavedOnly));
}

function renderDishes() {
  const selected = filter.value;
  let visible = dishes.filter((dish) => selected === 'all' || dish.type === selected);
  if (showSavedOnly) visible = visible.filter((dish) => savedIds.includes(dish.id));
  resultCount.textContent = `${visible.length} dish${visible.length === 1 ? '' : 'es'} shown`;
  grid.innerHTML = visible.map((dish) => `
    <article class="dish-card">
      <img src="${dish.image}" alt="${dish.imageAlt || `${dish.name} street food`}" width="480" height="360" loading="lazy">
      <div class="dish-card-body">
        <p class="type">${dish.type}</p>
        <h3>${dish.name}</h3>
        <p>${dish.description}</p>
        <p><strong>${dish.cost}</strong></p>
        <div class="card-actions">
          <button class="details-button" type="button" data-id="${dish.id}">View details</button>
          <button class="save-button" type="button" data-save="${dish.id}" aria-pressed="${savedIds.includes(dish.id)}">${savedIds.includes(dish.id) ? 'Saved' : 'Save'}</button>
        </div>
      </div>
    </article>`).join('');
  if (visible.length === 0) grid.innerHTML = '<p>No dishes match this view.</p>';
  updateSavedCount();
}

async function loadDishes() {
  try {
    const response = await fetch('./data/dishes.json');
    if (!response.ok) throw new Error(`Could not load dishes: ${response.status}`);
    dishes = await response.json();
    renderDishes();
  } catch (error) {
    grid.innerHTML = '<p>We could not load the food guide. Please refresh the page.</p>';
    console.error(error);
  }
}

filter.addEventListener('change', renderDishes);
savedOnlyButton.addEventListener('click', () => {
  showSavedOnly = !showSavedOnly;
  renderDishes();
});

grid.addEventListener('click', (event) => {
  const saveButton = event.target.closest('[data-save]');
  const detailsButton = event.target.closest('[data-id]');
  if (saveButton) {
    const id = saveButton.dataset.save;
    savedIds = savedIds.includes(id) ? savedIds.filter((item) => item !== id) : [...savedIds, id];
    localStorage.setItem('savedDishes', JSON.stringify(savedIds));
    renderDishes();
  }
  if (detailsButton) {
    const dish = dishes.find((item) => item.id === detailsButton.dataset.id);
    dialogContent.innerHTML = `
      <img src="${dish.image}" alt="${dish.imageAlt || `${dish.name} street food`}" width="680" height="420">
      <div class="dialog-body">
        <p class="type">${dish.type}</p>
        <h2 id="dialog-title">${dish.name}</h2>
        <p>${dish.description}</p>
        <p><strong>Typical cost:</strong> ${dish.cost}</p>
        <h3>Ingredients</h3>
        <ul>${dish.ingredients.map((ingredient) => `<li>${ingredient}</li>`).join('')}</ul>
      </div>`;
    dialog.showModal();
  }
});

closeButton.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

loadDishes();
