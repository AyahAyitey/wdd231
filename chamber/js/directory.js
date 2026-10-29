const membersEl = document.querySelector('#members');
const gridBtn = document.querySelector('#grid-btn');
const listBtn = document.querySelector('#list-btn');
const levelNames = { 1: 'Member', 2: 'Silver member', 3: 'Gold member' };

/* Fetch the member data with async/await */
async function getMembers() {
  if (window.location.protocol === 'file:') {
    displayMembers(window.memberDirectoryFallback);
    membersEl.setAttribute('aria-busy', 'false');
    return;
  }

  try {
    const response = await fetch('data/members.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const members = await response.json();
    displayMembers(members);
  } catch (error) {
    console.warn('Could not load members:', error.message);
    membersEl.innerHTML = '<p class="status">Sorry, the member directory could not be loaded. Please try again later.</p>';
  } finally {
    membersEl.setAttribute('aria-busy', 'false');
  }
}

function displayMembers(members) {
  membersEl.innerHTML = '';
  members.forEach((m) => {
    const card = document.createElement('article');
    card.className = `card level-${m.level}`;
    const site = m.website.replace(/^https?:\/\/(www\.)?/, '');
    card.innerHTML = `
      <img src="images/${m.image}" alt="${m.imageAlt}" width="480" height="300" loading="lazy">
      <div class="card-body">
        <div class="head">
          <h2>${m.name}</h2>
          <p class="badge">${levelNames[m.level]}</p>
        </div>
        <p class="desc">${m.description}</p>
        <address class="contact">
          <span>${m.address}</span>
          <a href="tel:${m.phone.replace(/\s/g, '')}">${m.phone}</a>
          <a href="${m.website}" target="_blank" rel="noopener noreferrer">${site}</a>
        </address>
      </div>`;
    membersEl.append(card);
  });
}

/* Grid / list toggle */
function setView(view) {
  const isGrid = view === 'grid';
  membersEl.classList.toggle('grid', isGrid);
  membersEl.classList.toggle('list', !isGrid);
  gridBtn.setAttribute('aria-pressed', isGrid);
  listBtn.setAttribute('aria-pressed', !isGrid);
}
gridBtn.addEventListener('click', () => setView('grid'));
listBtn.addEventListener('click', () => setView('list'));

getMembers();
