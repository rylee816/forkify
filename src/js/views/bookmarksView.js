import View from "./View";
import previewView from "./PreviewView";

class BookmarksView extends View {
_parentElement = document.querySelector(".bookmarks__list");
_errorMessage = "No bookmarks yet. Find a nice recipe and add it to your bookmarks list!";
_message = "";

addHandlerRender(handler){
  window.addEventListener("load", handler);
}

_generateMarkup(){
  const markup = this._data.map(result => previewView.render(result, false))
  return markup.join("")
}
}
export default new BookmarksView;