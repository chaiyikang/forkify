import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
// 1111 we import the object instance with all the methods we need to call
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if (module.hot) module.hot.accept();

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
const controlRecipes = async function () {
	try {
		// remove # from hash
		const id = window.location.hash.slice(1);
		if (!id) return;

		recipeView.renderSpinner();

		// refresh sidebar to update active recipe
		resultsView.update(model.getSearchResultsByPage());
		// refresh bookmarks to update active recipe
		bookmarksView.update(model.state.bookmarks);

		// load recipe; this line simply fetches and then updates the state object in model.js, which we can also access (live connection, passed by reference) here
		await model.loadRecipe(id);

		// render recipe
		recipeView.render(model.state.recipe);
	} catch (err) {
		// alert(`${err} CONTROLLER caught😍😍😍`);
		// from the controller, we render the error in the DOM
		recipeView.renderError();
	}
};

// instead of directly obtaining the query results,
// we simply execute some code that will store it in the model.
// this way, we dont have to worry about transferring any return values here and there
// whenever we need to use it, we can just take it from the model state conveniently.

// called upon once search is submited
const controlSearchResults = async function () {
	try {
		resultsView.renderSpinner();

		// get query from view; i feel i would shift this block into the view
		const query = searchView.getQuery();
		if (!query) return;

		// get results from model
		await model.loadSearchResults(query);

		// render results
		// we start with page 1 and set currentPage as such during getSearchResultsByPage
		resultsView.render(model.getSearchResultsByPage(1));

		// render page buttons
		paginationView.render(model.state.search);
	} catch (err) {
		alert(err);
	}
};

// when the page button is clicked, the handling of the event is split into both the view and the controller function.
// the view handles event delegation and determining which page the button is for
// the controller is then responsible for rendering based on the page.

const controlPagination = function (goToPage) {
	// IMO would be better that getSearchResultsByPage updates the state, so we dont have to nest function
	resultsView.render(model.getSearchResultsByPage(goToPage));
	// when we render this page, we also update the page in the state
	// we also clear existing stuff before rendering

	// currentPage in model.state.search  was updated by getResults, so we can safely re-render the page buttons
	paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
	model.updateServings(newServings);

	// recipeView.render(model.state.recipe);
	recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
	// add or remove in state
	if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
	else model.deleteBookmark(model.state.recipe.id);
	// console.log(model.state.recipe);

	// update recipe view
	recipeView.update(model.state.recipe);

	// render bookmarks list
	bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
	bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
	try {
		addRecipeView.renderSpinner();
		await model.uploadRecipe(newRecipe);
		// console.log(model.state.recipe);

		recipeView.render(model.state.recipe);

		addRecipeView.renderMessage();

		bookmarksView.render(model.state.bookmarks);

		//change id in url
		// pushState allows us to change url without reloading page
		window.history.pushState(null, '', `#${model.state.recipe.id}`);

		setTimeout(function () {
			addRecipeView.toggleWindow();
		}, MODAL_CLOSE_SEC * 1000);
	} catch (err) {
		console.log(err);
		addRecipeView.renderError(err.message);
	}
};

const init = function () {
	bookmarksView.addHandlerRender(controlBookmarks);
	recipeView.addHandlerRender(controlRecipes);
	recipeView.addHandlerUpdateServings(controlServings);
	recipeView.addHanlderBookmark(controlAddBookmark);
	searchView.addHandlerSearch(controlSearchResults);
	// notice that we want to add the event handler to the page buttons, but at this point they dont exist yet and the buttons will keep getting cleared and re-created,
	// which is why, we have to use event delegation here, and we add the event listener to the over-arching parent element which already exists.
	paginationView.addHandlerPage(controlPagination);
	addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();

// clearBookmarks();
