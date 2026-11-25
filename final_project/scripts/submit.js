import { setCopyright } from './modules/common.js';

setCopyright();
const params = new URLSearchParams(window.location.search);
const labels = {
  name: 'Your name',
  email: 'Email address',
  vendor: 'Vendor name',
  neighborhood: 'Neighborhood',
  specialty: 'What to order',
  consent: 'Confirmation'
};
const container = document.querySelector('#submission-details');
const allowedFields = ['name','email','vendor','neighborhood','specialty','consent'];
container.innerHTML = allowedFields
  .filter((key) => params.has(key))
  .map((key) => `<dt>${labels[key]}</dt><dd>${escapeHtml(params.get(key) || '')}</dd>`)
  .join('');

function escapeHtml(value) {
  const element = document.createElement('span');
  element.textContent = value;
  return element.innerHTML;
}
