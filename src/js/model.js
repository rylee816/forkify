import { API_URL, API_KEY, RESULTS_PER_PAGE } from "./config";
import { AJAX } from "./helpers";

export const state = {
    recipe: {},
    search: {
        query: "",
        results: [],
        page: 1,
        resultsPerPage: RESULTS_PER_PAGE
    },
    bookmarks: []
};

const createRecipeObject = function(data){
    const { recipe } = data.data;
    
   return state.recipe = {
      id: recipe.id,
      publisher: recipe.publisher,
      title: recipe.title,
      ingredients: recipe.ingredients,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ...(recipe.key && {key: recipe.key})
    };
}

export const loadRecipe = async function(id){
    try {
        const request = await AJAX(`${API_URL}/${id}?key=${API_KEY}`)

         createRecipeObject(request);
        
        if(state.bookmarks.some(bookmark => bookmark.id === id)){
            state.recipe.bookmarked = true;
        } else {
            state.recipe.bookmarked = false;
        }
      } catch (err) {
        console.error(`${err} 🤦‍♂️`);
        throw err;
      }
}

export const loadSearchResults = async function(query){
try {
    state.search.query = query;

    const request = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`)

    const {data:{recipes}} = request;
    state.search.results = recipes.map(recipe => {
        return {
            id: recipe.id,
            publisher: recipe.publisher,
            title: recipe.title,
            image: recipe.image_url,
            ...(recipe.key && {key: recipe.key})
        }
    });
    state.search.page = 1;
} catch(err) {
    console.error(`${err} 🤦‍♂️`);
    throw err;
}
}

export const getSearchResultsPage = function(page = state.search.page) {
    state.search.page = page;
    const start = (page -1) * state.search.resultsPerPage;  //0;
    const end = page * state.search.resultsPerPage;  //9;

    return state.search.results.slice(start, end);
};

export const updateServings = function(newServings) {
     state.recipe.ingredients.forEach(ing => {
        ing.quantity = ing.quantity * newServings / state.recipe.servings;
    });

    state.recipe.servings = newServings;
    console.log(state.recipe.servings);
};

const persistBookmarks = function() {
    localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks))
};


export const addBookmark = function(recipe){
    // Add bookmark

    state.bookmarks.push(recipe);

    // Mark current recipe as bookmarked
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

    persistBookmarks();
}

export const deleteBookmark = function(id) {
    // Delete bookmark
    const index = state.bookmarks.findIndex(el => el.id === id)
    state.bookmarks.splice(index, 1)
        
    // Mark current recipe as NOT bookmarked
    if (id === state.recipe.id) state.recipe.bookmarked = false;

    persistBookmarks();
};

const init = function() {
    const storage = localStorage.getItem("bookmarks");
    if (storage) state.bookmarks = JSON.parse(storage);
}

export const uploadRecipe = async function(newRecipe) {
    try {
        const ingredients = Object.entries(newRecipe).filter(entry => {
           return entry[0].startsWith("ingredient") && entry[1] !== ""
        }).map(ing => {
            // const ingArr = ing[1].replaceAll(" ", "").split(",");
            const ingArr = ing[1].split(",").map(el => el.trim())

            if(ingArr.length !== 3) throw new Error("Wrong ingredient format! Please use the correct format.");
    
            const [quantity, unit = "", description =""] = ingArr;
            
             return {quantity: quantity ? +quantity : null, unit, description}
        });
        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
        }

        const data = await AJAX(`${API_URL}?&key=${API_KEY}`, recipe);
        createRecipeObject(data);
        addBookmark(state.recipe)

    } catch(err){
        throw err;
    }
};

init();

