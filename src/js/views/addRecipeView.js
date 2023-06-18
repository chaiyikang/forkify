import View from './parentView.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
	_parentElement = document.querySelector('.upload');
	_successMessage = 'Recipe was successfully uploaded';
	_window = document.querySelector('.add-recipe-window');
	_overlay = document.querySelector('.overlay');
	_btnOpen = document.querySelector('.nav__btn--add-recipe');
	_btnClose = document.querySelector('.btn--close-modal');

	constructor() {
		super();
		this._addHandlerShowWindow();
		this._addHandlerHideWindow();
	}

	toggleWindow() {
		this._overlay.classList.toggle('hidden');
		this._window.classList.toggle('hidden');
	}

	_addHandlerShowWindow() {
		// console.log(this);
		this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
	}

	_addHandlerHideWindow() {
		this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
		this._overlay.addEventListener('click', this.toggleWindow.bind(this));
	}

	addHandlerUpload(handler) {
		this._parentElement.addEventListener('submit', function (e) {
			e.preventDefault();
			const dataArray = [...new FormData(this)]; // here, this keyword is a form element
			// FormData is some weird object, but we can spread it.
			// dataArray is now an array of entries (an array of 2 element arrays that are key-value pairs of question-answer)

			// just as how Object.entries can convert an object into an array of entires, it is possible to convert an array of entries into an object
			const data = Object.fromEntries(dataArray);
			handler(data);
		});
	}

	_generateMarkup() {}
}

export default new AddRecipeView();
