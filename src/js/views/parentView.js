import icons from 'url:../../img/icons.svg';
export default class View {
	_data;
	render(data) {
		// guard clause, we abort and also call renderError
		// where the search returns no result, we end up having data === [], so we need to check for that also
		// console.log(data);
		if (!data || (Array.isArray(data) && data.length === 0)) {
			// return and render error on page at the same time
			return this.renderError();
		}

		// taking the data passed from the controller, also storing it in the object (instance) so that other methods (we also call here) can also access
		this._data = data;
		// we abstracted getting the markup into this method, and this method will need the data, and it can find it as the object property
		const markup = this._generateMarkup();
		this._clear();
		this._parentElement.insertAdjacentHTML('afterbegin', markup);
	}

	update(data) {
		// we don't need to validate data because we only pass readily available data from within our script, and so that there is no error for the sidebar refresh when we load into a recipe, because we trigger the sidebar refresh upon recipe loading but if we load via url into the recipe there is no search data to re-render
		// if (!data || (Array.isArray(data) && data.length === 0)) {
		// 	// return and render error on page at the same time
		// 	return this.renderError();
		// }

		// update the new data as the property
		this._data = data;
		const newMarkup = this._generateMarkup();

		console.log(undefined !== '');

		// create DOM object within script, not DOM
		const newDOM = document.createRange().createContextualFragment(newMarkup);
		const newElements = Array.from(newDOM.querySelectorAll('*'));
		const curElements = Array.from(this._parentElement.querySelectorAll('*'));

		// compare new to old
		newElements.forEach((newEl, i) => {
			const curEl = curElements[i];
			// update text
			if (!newEl.isEqualNode(curEl)) {
				// debugger;
				if (newEl?.firstChild?.nodeValue.trim() !== '') {
					curEl.textContent = newEl.textContent;
				}
			}
			/*
				if (
					!newEl.isEqualNode(curEl) &&
					// hmm but if firstChild does not exist and we get undefined then the entire expression is true, but anyway doing the textContent replacement won't give us any issues
					// see notes for explanation of below line
					newEl?.firstChild.nodeValue.trim() !== ''
				) {
					
				}
				*/
			// update attributes, we wouldn't need this if we didnt tag the serving numbers to the serving buttons
			if (!newEl.isEqualNode(curEl)) {
				Array.from(newEl.attributes).forEach(attr =>
					curEl.setAttribute(attr.name, attr.value)
				);
			}
		});
	}

	_clear() {
		this._parentElement.innerHTML = '';
	}

	renderSpinner() {
		const markup = `<div class="spinner">
    <svg>
      <use href="${icons}#icon-loader"></use>
    </svg>
  </div>`;
		this._clear();
		this._parentElement.insertAdjacentHTML('afterbegin', markup);
	}

	renderError(message = this._errorMessage) {
		const markup = `<div class="error">
		<div>
		<svg>
			<use href="${icons}#icon-alert-triangle"></use>
		</svg>
		</div>
		<p>${message}</p>
		</div>`;
		this._clear();
		this._parentElement.insertAdjacentHTML('afterbegin', markup);
	}

	renderMessage(message = this._successMessage) {
		const markup = `<div class="message">
		<div>
		<svg>
			<use href="${icons}#icon-smile"></use>
		</svg>
		</div>
		<p>${message}</p>
		</div>`;
		this._clear();
		this._parentElement.insertAdjacentHTML('afterbegin', markup);
	}
}
