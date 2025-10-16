import { BASE_URL } from './api';
import axios from 'axios';


const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');

form.addEventListener('submit', submitButton);

function submitButton(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const searchQueryValue = formData.get('searchQuery');

  const searchImageType = 'image_type=photo';
  const searchOrientation = 'orientation=horizontal';
  const searchSafe = 'safesearch=true';

  const url = `${BASE_URL}&q=${searchQueryValue}&${searchImageType}&${searchOrientation}&${searchSafe}`;

  axios.get(url)
    .then(response => {
      const markup = galleryMarkup(response.data);
      gallery.insertAdjacentHTML('afterbegin', markup);
    })
}

gallery.addEventListener('click', (e) => {
  if (e.target.tagName == 'IMG') {
    console.log('asdasd')
  }
})



function galleryMarkup(data) {
  const images = data.hits;
  return images
    .map(({ webformatURL, tags, likes, views, comments, downloads }) => {
      return `<div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
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


