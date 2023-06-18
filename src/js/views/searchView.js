class SearchView {
	_parentElement = document.querySelector('.search');

	// imo we should have just implemented this function into the event handler so that we dont have to call it from the controller
	getQuery() {
		const query = this._parentElement.querySelector('.search__field').value;
		this._clearInput();
		return query;
	}

	_clearInput() {
		this._parentElement.querySelector('.search__field').value = '';
	}

	addHandlerSearch(handler) {
		const preventDefaultThenHandler = function (event) {
			// default behavior is to reload page on form submission
			event.preventDefault();

			// i would put this._getQuery() here, then maybe pass the query into the handler

			handler();
		};
		this._parentElement.addEventListener('submit', preventDefaultThenHandler);
	}
}

export default new SearchView();
