import { BASE_URL } from './api';
import axios from 'axios';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');

form.addEventListener('submit', searchImage);

function buildSearchUrl(query) {
  const params = [
    `q=${encodeURIComponent(query)}`,
    'image_type=photo',
    'orientation=horizontal',
    'safesearch=true',
  ].join('&');
  return `${BASE_URL}&${params}`;
}
function searchImage(e) {
  e.preventDefault();

  const searchQueryValue = new FormData(e.target).get('searchQuery');
  if (!searchQueryValue) return;

  getImages(buildSearchUrl(searchQueryValue));
}

async function getImages(url) {
  try {
    const response = await axios.get(url);

    if (response.status !== 200) {
      throw new Error(`HTTP error ${response.status}`);
    }

    renderGallery(response.data);
  } catch (error) {
    console.error(error.message);
  }
}

function renderGallery(data) {
  const markup = galleryMarkup(data);
  gallery.insertAdjacentHTML('afterbegin', markup);
}
gallery.addEventListener('click', e => {
  if (e.target.tagName == 'IMG') {
    const imageURL = e.target.dataset.modal;
  }
});

function galleryMarkup(data) {
  const images = data.hits;
  return images
    .map(({ webformatURL, tags, likes, views, comments, downloads, largeImageURL }) => {
      return `<div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" data-modal="${largeImageURL}">
        <div class="info">
          <p class="info-item"><b>Likes:</b> ${likes}</p>
          <p class="info-item"><b>Views:</b> ${views}</p>
          <p class="info-item"><b>Comments:</b> ${comments}</p>
          <p class="info-item"><b>Downloads:</b> ${downloads}</p>
        </div>
      </div>`;
    })
    .join('');
}
