import { API_URL, RESULTS_PER_PAGE, KEY } from './config.js';
import { getJSON, sendJSON } from './helpers.js';

export const state = {
	recipe: {},
	search: {
		query: '',
		results: [],
		resultsPerPage: RESULTS_PER_PAGE,
		currentPage: 1,
		// for the number of pages we have, it is done in paginationView but IMO we should do it here and store it here
	},
	bookmarks: [],
};

const createRecipeObject = function (data) {
	const { recipe } = data.data;
	return {
		cookingTime: recipe.cooking_time,
		id: recipe.id,
		imageUrl: recipe.image_url,
		ingredients: recipe.ingredients,
		publisher: recipe.publisher,
		servings: recipe.servings,
		sourceUrl: recipe.source_url,
		title: recipe.title,
		// short circuting. if recipe.key is true, then expression is the object. else undefined. then we spread it out into the outer object
		...(recipe.key && { key: recipe.key }),
	};
};
// fetches data, packages it nicely (format names), then stores it in the state for easy, straightforward and non-confusing access from the controller
export const loadRecipe = async function (id) {
	try {
		const responseJSON = await getJSON(`${API_URL}${id}`);
		state.recipe = createRecipeObject(responseJSON);

		if (state.bookmarks.some(bookmark => bookmark.id === id))
			state.recipe.bookmarked = true;
		else state.bookmarks.bookmarked = false;

		// console.log(state.recipe);
	} catch (err) {
		// alert(`${err}, MODEL caught 😍😍😍`);
		throw err;
	}
};
export const loadSearchResults = async function (query) {
	try {
		// this line isn't used for our application but we could be interested in the data about all the queries in the future
		state.search.query = query;

		const responseJSON = await getJSON(`${API_URL}?search=${query}`);

		// if invalid search, responseJSON.data.recipes is just an empty array
		// we expect an array of unpolished recipes
		state.search.results = responseJSON.data.recipes.map(recipe => {
			return {
				// here we change the names, and store it in the state as an array
				id: recipe.id,
				publisher: recipe.publisher,
				image: recipe.image_url,
				title: recipe.title,
			};
		});
	} catch (err) {
		alert(`${err}, FROM MODEL loadSearchResults`);
		throw err;
	}
};

// this function returns the recipes of interest for the given page, although probably might be more consistent to store the page recipes in the state also :/
export const getSearchResultsByPage = function (
	page = state.search.currentPage
) {
	// we update the currentPage since we are about to go there
	state.search.currentPage = page;
	const start = (page - 1) * state.search.resultsPerPage;
	const end = page * state.search.resultsPerPage; // slice does not include the last index
	return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
	state.recipe.ingredients.forEach(ingredient => {
		ingredient.quantity =
			(ingredient.quantity / state.recipe.servings) * newServings;
	});
	state.recipe.servings = newServings;
};

const persistBookmarks = function () {
	localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
	state.bookmarks.push(recipe);
	if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
	persistBookmarks();
};

export const deleteBookmark = function (id) {
	const index = state.bookmarks.findIndex(element => element.id === id);
	state.bookmarks.splice(index, 1);
	if (id === state.recipe.id) state.recipe.bookmarked = false;
	persistBookmarks();
};

export const uploadRecipe = async function (newRecipe) {
	try {
		const ingredients = Object.entries(newRecipe)
			.filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
			.map(ing => {
				const ingArr = ing[1].replaceAll(' ', '').split(',');

				if (ingArr.length !== 3) throw new Error('wrong ingredient format');

				const [quantity, unit, description] = ingArr;

				return { quantity: quantity ? +quantity : null, unit, description };
			});
		const recipe = {
			title: newRecipe.title,
			source_url: newRecipe.sourceUrl,
			image_url: newRecipe.image,
			publisher: newRecipe.publisher,
			cooking_time: +newRecipe.cookingTime,
			servings: +newRecipe.servings,
			ingredients,
		};
		const dataBack = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
		state.recipe = createRecipeObject(dataBack);
		addBookmark(state.recipe);
		console.log(state.recipe);
	} catch (err) {
		throw new Error(err);
	}
};

const init = function () {
	const storage = localStorage.getItem('bookmarks');
	if (storage) state.bookmarks = JSON.parse(storage);
};

init();
// console.log(state.bookmarks);
