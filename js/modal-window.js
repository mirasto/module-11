import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let modal = null;

export function showModalWindow() {

	if (modal) {
		 modal.refresh();
	} else {
		const modal = new SimpleLightbox('.gallery a', {
      captions: true,
      overlay: true,
      spinner: true,
      nav: true,
      close: true,
    });
    modal.on('show.simplelightbox');
	}

  
}