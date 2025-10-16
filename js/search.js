import { BASE_URL } from './api';
import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// 1. Отримуємо посилання на DOM-елементи
const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');

// 2. Ініціалізуємо SimpleLightbox для галереї
let modal = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 0,
  overlay: true,
  spinner: true,
  nav: true,
  close: true,
});
modal.on('show.simplelightbox', function (e) {
  const imageURL = e.target.dataset.modal;
  console.log(imageURL);
});

// 3. Додаємо обробник події на форму пошуку
form.addEventListener('submit', searchImage);

// 4. Функція для побудови URL для запиту
function buildSearchUrl(query) {
  const params = [
    `q=${encodeURIComponent(query)}`,
    'image_type=photo',
    'orientation=horizontal',
    'safesearch=true',
  ].join('&');
  return `${BASE_URL}&${params}`;
}

// 5. Обробник події submit форми
function searchImage(e) {
  e.preventDefault();

  const searchQueryValue = new FormData(e.target).get('searchQuery');
  if (!searchQueryValue) {
    Notify.failure('Введи пошуковий запит!');
    return;
  }

  getImages(buildSearchUrl(searchQueryValue));
}

// 6. Асинхронна функція для отримання зображень з API
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

// 7. Функція для рендеру галереї
function renderGallery(data) {
   if (!data.hits || data.hits.length === 0) {
     Notify.failure('Нічого не знайдено за запитом!');
     return;
   }
  const markup = galleryMarkup(data);
  gallery.insertAdjacentHTML('afterbegin', markup);
  modal.refresh();
}

// 8. Функція для створення розмітки галереї
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
      </div>`;
    })
    .join('');
}
