import "core-js/stable";
import "regenerator-runtime/runtime";
import * as model from "./model";
import recipeView from "./views/recipeView";
import searchView from "./views/searchView";
import resultsView from "./views/resultsView";
import paginationView from "./views/paginationView";
import bookmarksView from "./views/bookmarksView";
import AddRecipeView from "./views/addRecipeView";
import addRecipeView from "./views/addRecipeView";
import { MODAL_CLOSE_SEC } from "./config";

// if(module.hot) {
//   module.hot.accept();
// }



const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if(!id) return;
    recipeView.renderSpinner();

    // Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage())
    bookmarksView.update(model.state.bookmarks)
    
    // loading recipe
    await model.loadRecipe(id);

    // rendering recipe
    recipeView.render(model.state.recipe);
  // controlServings();

  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
};


const controlSearchResults = async function(){
  try {
    // Get search query
    const query = searchView.getQuery()
    if(!query) return; 
    
    resultsView.renderSpinner();
    
    // Load search results
    await model.loadSearchResults(query)
    // Render results
    // resultsView.render(model.state.search.results);// before pagination;
    resultsView.render(model.getSearchResultsPage());
    
    //render pagination buttons
    paginationView.render(model.state.search)
    
  } catch(err) {
    console.error(err)
    throw err;
  }
}

function controlPagination(page){
  // render NEW results
  resultsView.render(model.getSearchResultsPage(page));
  
  // render NEW pagination buttons
  paginationView.render(model.state.search)
};

const controlServings = function(newServings) {
  // Update the recipe servings (in state)
  if(newServings > 0)
  model.updateServings(newServings);

  // Update the view
  recipeView.update(model.state.recipe);
}

const controlAddBookmark = function(){
  // Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe); 
  
  else model.deleteBookmark(model.state.recipe.id)
  
  console.log(model.state.bookmarks);
  // Update recipe view
  recipeView.update(model.state.recipe)

  // Render bookmarks
  bookmarksView.render(model.state.bookmarks)
};


const controlBookmarks = function() {
  bookmarksView.render(model.state.bookmarks)
};


const controlAddRecipe = async function(newRecipe){
  try {
    // Render Spinner
    addRecipeView.renderSpinner()

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    // Render the newly uploaded recipe
    recipeView.render(model.state.recipe);

    // render success message
    addRecipeView.renderSuccess("Success! You have uploaded a new recipe! Happy cooking!");

    // Render new recipe in bookmarks view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, "", `#${model.state.recipe.id}`)
    
    // Close form window 
    setTimeout(function() {
      addRecipeView.toggleWindow();
       location.reload();
    }, MODAL_CLOSE_SEC * 1000)


  } catch (err){
    addRecipeView.renderError(err.message);
  }
};




const init = function(){
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmarkRecipe(controlAddBookmark)
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  AddRecipeView.addHandlerUpload(controlAddRecipe);
}

init();
