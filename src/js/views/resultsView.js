import View from './parentView.js';

class ResultsView extends View {
	_parentElement = document.querySelector('.results');
	_errorMessage = `No recipes were found.`;

	// the render method inherited from the parent class relies on a _generateMarkup method in the class.
	_generateMarkup() {
		return this._data.map(this._mapMethodForGenerateMarkup).join('');
	}
	_mapMethodForGenerateMarkup(thisDotDataArrayElement) {
		const id = window.location.hash.slice(1);
		return `
            <li class="preview">
            ${
							'' /*check if this recipe sidebar preview is the active recipe being shown*/
						}
            <a class='preview__link ${
							thisDotDataArrayElement.id === id ? 'preview__link--active' : ''
						}' href="#${thisDotDataArrayElement.id}">
            <figure class="preview__fig">
                <img src="${thisDotDataArrayElement.image}" alt="${
			thisDotDataArrayElement.title
		}" />
            </figure>
            <div class="preview__data">
                <h4 class="preview__title">${thisDotDataArrayElement.title}</h4>
                <p class="preview__publisher">${
									thisDotDataArrayElement.publisher
								}</p>
            </div>
            </a>
        </li>
    `;
	}
}

export default new ResultsView();
