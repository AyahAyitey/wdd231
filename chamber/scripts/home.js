/* ============================================================
   home.js  –  Weather (OpenWeatherMap) + Member Spotlights
   Chamber of Commerce | WDD 231
   ============================================================ */

// ── OpenWeatherMap config ──────────────────────────────────
// Accra, Ghana  (lat/lon used for reliable results)
// Sign up free at https://openweathermap.org/api and replace the key below.
const API_KEY  = 'b6907d289e10d714a6e88b30761fac74'; // replace with your own OWM free-tier key
const LAT      = 5.6037;
const LON      = -0.1870;
const UNITS    = 'metric';  // Celsius (appropriate for Ghana)
const UNIT_SYM = '°C';

// OWM endpoint URLs
const CURRENT_URL  = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=${UNITS}&appid=${API_KEY}`;
const FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&units=${UNITS}&cnt=24&appid=${API_KEY}`;

// ── DOM refs ──────────────────────────────────────────────
const weatherNowEl   = document.querySelector('#weather-now');
const forecastEl     = document.querySelector('#weather-forecast');
const spotlightsEl   = document.querySelector('#spotlights');

// ── Membership level labels ───────────────────────────────
const levelNames = { 1: 'Member', 2: 'Silver Member', 3: 'Gold Member' };

/* ============================================================
   WEATHER
   ============================================================ */
async function loadWeather() {
  try {
    const [nowRes, foreRes] = await Promise.all([
      fetch(CURRENT_URL),
      fetch(FORECAST_URL),
    ]);

    if (!nowRes.ok)  throw new Error(`Current weather HTTP ${nowRes.status}`);
    if (!foreRes.ok) throw new Error(`Forecast HTTP ${foreRes.status}`);

    const nowData  = await nowRes.json();
    const foreData = await foreRes.json();

    renderCurrentWeather(nowData);
    renderForecast(foreData);
  } catch (err) {
    console.warn('Weather load error:', err.message);
    weatherNowEl.innerHTML  = '<p class="weather-error">Weather data unavailable right now.</p>';
    forecastEl.innerHTML    = '';
  } finally {
    weatherNowEl.setAttribute('aria-busy', 'false');
    forecastEl.setAttribute('aria-busy', 'false');
  }
}

function renderCurrentWeather(data) {
  const temp        = Math.round(data.main.temp);
  const feelsLike   = Math.round(data.main.feels_like);
  const description = capitalize(data.weather[0].description);
  const humidity    = data.main.humidity;
  const iconCode    = data.weather[0].icon;
  const iconUrl     = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  const iconAlt     = description;

  weatherNowEl.setAttribute('aria-busy', 'false');
  weatherNowEl.innerHTML = `
    <div class="weather-main">
      <img class="weather-icon" src="${iconUrl}" alt="${iconAlt}" width="64" height="64">
      <div class="weather-temp-block">
        <span class="weather-temp">${temp}${UNIT_SYM}</span>
        <span class="weather-desc">${description}</span>
      </div>
    </div>
    <dl class="weather-details">
      <dt>Feels like</dt><dd>${feelsLike}${UNIT_SYM}</dd>
      <dt>Humidity</dt><dd>${humidity}%</dd>
    </dl>`;
}

function renderForecast(data) {
  // OWM /forecast returns readings every 3 hours.
  // Pick one reading per day for the next 3 distinct calendar days.
  const today = new Date().toDateString();
  const seen  = new Set();
  const days  = [];

  for (const entry of data.list) {
    const d = new Date(entry.dt * 1000);
    const label = d.toDateString();
    if (label === today) continue;          // skip today
    if (seen.has(label)) continue;
    seen.add(label);
    days.push(entry);
    if (days.length === 3) break;
  }

  forecastEl.setAttribute('aria-busy', 'false');
  forecastEl.innerHTML = days.map((entry) => {
    const d    = new Date(entry.dt * 1000);
    const day  = d.toLocaleDateString('en-US', { weekday: 'short' });
    const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const high = Math.round(entry.main.temp_max);
    const low  = Math.round(entry.main.temp_min);
    const icon = entry.weather[0].icon;
    const desc = capitalize(entry.weather[0].description);
    return `
      <li class="forecast-day">
        <img class="forecast-icon" src="https://openweathermap.org/img/wn/${icon}.png" alt="${desc}" width="40" height="40">
        <span class="forecast-name">${day}<br><small>${date}</small></span>
        <span class="forecast-temps"><strong>${high}${UNIT_SYM}</strong> / <span class="forecast-low">${low}${UNIT_SYM}</span></span>
      </li>`;
  }).join('');
}

/* ============================================================
   SPOTLIGHTS  –  2–3 random Gold (3) or Silver (2) members
   ============================================================ */
async function loadSpotlights() {
  try {
    let members;

    // file:// protocol — use the inline JS fallback if available
    if (window.location.protocol === 'file:' && window.memberDirectoryFallback) {
      members = window.memberDirectoryFallback;
    } else {
      const res = await fetch('data/members.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      members = await res.json();
    }

    // Filter to gold (3) and silver (2) only
    const eligible = members.filter((m) => m.level === 2 || m.level === 3);

    // Fisher-Yates shuffle then take 2 or 3
    shuffle(eligible);
    const count    = eligible.length >= 3 ? 3 : 2;
    const selected = eligible.slice(0, count);

    renderSpotlights(selected);
  } catch (err) {
    console.warn('Spotlight load error:', err.message);
    spotlightsEl.innerHTML = '<p class="weather-error">Spotlights unavailable right now.</p>';
  } finally {
    spotlightsEl.setAttribute('aria-busy', 'false');
  }
}

function renderSpotlights(members) {
  spotlightsEl.innerHTML = members.map((m) => {
    const site = m.website.replace(/^https?:\/\/(www\.)?/, '');
    return `
      <article class="spotlight-card level-${m.level}">
        <img src="images/${m.image}" alt="${m.imageAlt}" width="320" height="200" loading="lazy">
        <div class="spotlight-body">
          <h3>${m.name}</h3>
          <p class="badge">${levelNames[m.level]}</p>
          <address class="contact">
            <span>${m.address}</span>
            <a href="tel:${m.phone.replace(/\s/g, '')}">${m.phone}</a>
            <a href="${m.website}" target="_blank" rel="noopener noreferrer">${site}</a>
          </address>
        </div>
      </article>`;
  }).join('');
}

/* ============================================================
   UTILITIES
   ============================================================ */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/* ============================================================
   INIT
   ============================================================ */
loadWeather();
loadSpotlights();
