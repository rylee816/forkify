import View from './View';
import previewView from './PreviewView';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = "No recipes found for your query! Please try again."
  _message = "Success!"

    _generateMarkup(){
      const markup = this._data.map(bookmarks => previewView.render(bookmarks, false))
      return markup.join("")
    }
  }

export default new ResultsView();
