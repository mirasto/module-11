import { BASE_URL } from './api';
import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { showModalWindow } from './modal-window';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');

form.addEventListener('submit', searchImage);

function buildSearchUrl(query) {
  const params = [
    `q=${encodeURIComponent(query)}`,
    'image_type=photo',
    'orientation=horizontal',
    'safesearch=true',
    'per_page=40',
    'page=1',
  ].join('&');
  return `${BASE_URL}&${params}`;
}

function searchImage(e) {
  e.preventDefault();

  const searchQueryValue = new FormData(e.target).get('searchQuery');
  if (!searchQueryValue) {
    Notify.failure('Введи пошуковий запит!');
    return;
  }
  gallery.innerHTML = '';

  getImages(buildSearchUrl(searchQueryValue));
}

async function getImages(url) {
  try {
    const response = await axios.get(url);

    if (response.status !== 200) {
      throw new Error(`HTTP error ${response.status}`);
    }

    renderGallery(response.data, url);
  } catch (error) {
    console.error(error.message);
  }
}

function renderGallery(data, currentURL) {
  if (!data.hits || data.hits.length === 0) {
    Notify.failure('Нічого не знайдено за запитом!');
    return;
  }
  const markup = galleryMarkup(data);
  gallery.insertAdjacentHTML('beforeend', markup);
  showModalWindow();

  const existBtn = document.querySelector('.load-more');
  if (existBtn) existBtn.remove();

  const loadMoreBtnMarkup = `<button type="button" class="load-more">Load more</button>`;
  gallery.insertAdjacentHTML('afterend', loadMoreBtnMarkup);

  const loadMoreBtn = document.querySelector('.load-more');
  loadMoreBtn.addEventListener('click', () => {
    try {
      const nextUrl = incrementPageInUrl(currentURL);
      getImages(nextUrl);
    } catch (error) {
      console.log('Помилка при завантаженні сторінки', error);
    }
  });
}

function galleryMarkup(data) {
  const images = data.hits;
  return images
    .map(({ webformatURL, tags, likes, views, comments, downloads, largeImageURL }) => {
      return `<div class="photo-card">
        <a href="${largeImageURL}">
          <img src="${webformatURL}" alt="${tags}" loading="lazy">
        </a>
        <div class="info">
          <p class="info-item"><b>Likes:</b> ${likes}</p>
          <p class="info-item"><b>Views:</b> ${views}</p>
          <p class="info-item"><b>Comments:</b> ${comments}</p>
          <p class="info-item"><b>Downloads:</b> ${downloads}</p>
        </div>
      </div>
      `;
    })
    .join('');
}

function incrementPageInUrl(url) {
  const urlObj = new URL(url);
  const page = Number(urlObj.searchParams.get('page')) || 1;
  urlObj.searchParams.set('page', String(page + 1));
  return urlObj.href;
}
