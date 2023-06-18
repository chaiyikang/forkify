import View from './parentView.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
	_parentElement = document.querySelector('.pagination');

	addHandlerPage(handler) {
		// event delegation
		this._parentElement.addEventListener('click', function (e) {
			const btn = e.target.closest('.btn--inline');
			// guard clause because btn could be undefined if we click on .pagination that is not button
			if (!btn) return;
			const goToPage = Number(btn.dataset.goto);
			handler(goToPage);
		});
	}

	// we will pass in model.state.search throgugh render,
	// then this.data = model.state.search
	_generateMarkup() {
		const curPage = this._data.currentPage;
		const numPages = Math.ceil(
			this._data.results.length / this._data.resultsPerPage
		);
		// console.log(curPage);
		// console.log(numPages);

		// we specify precisely which page, based on currentpage +- 1, the button will bring us to in the html itself

		// next page only
		if (curPage === 1 && numPages > 1) {
			return `<button data-goto="${
				curPage + 1
			}"class="btn--inline pagination__btn--next">
            <span>${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
		}
		// previous page only, more than 1 total page
		if (curPage === numPages && numPages > 1) {
			return `<button data-goto="${
				curPage - 1
			}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>${curPage - 1}</span>
          </button>`;
		}
		if (curPage > 1 && curPage < numPages) {
			return `<button data-goto="${
				curPage - 1
			}"class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>${curPage - 1}</span>
          </button>
          
          <button data-goto="${
						curPage + 1
					}" class="btn--inline pagination__btn--next">
            <span>${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
          `;
		}
		// the only page
		if (curPage === 1 && numPages === 1) {
			return '';
		}
	}
}

export default new PaginationView();
