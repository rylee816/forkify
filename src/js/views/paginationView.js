import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler){
      this._parentElement.addEventListener("click", (e) => {
          const btn = e.target.closest(".btn--inline");
          if(!btn) return;

          const goToPage = +btn.dataset.goto;
          handler(goToPage);
      })
  }

  _generateMarkup(){
      console.log(this._data);
      const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
      const currPage = this._data.page;
    
      if(currPage === 1 && numPages > 1) {
        console.log("page 1 and others");
        return `<button class="btn--inline pagination__btn--next" data-goto="${currPage + 1}">
        <span>Page ${currPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>`
      }

      if(numPages === currPage && numPages > 1) {
          console.log("Last Page");
          return `<button class="btn--inline pagination__btn--prev" data-goto="${currPage - 1}">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${currPage - 1}</span>
        </button>`
      }

      if(currPage < numPages) {
          console.log("There are more pages left");
          return `<button class="btn--inline pagination__btn--prev" data-goto="${currPage - 1}">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${currPage - 1}</span>
        </button>
        <button class="btn--inline pagination__btn--next" data-goto="${currPage + 1}">
          <span>Page ${currPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>`
      }

      console.log("Only 1 page");
      return "";
    //   return `<button class="btn--inline pagination__btn--prev">
    //   <svg class="search__icon">
    //     <use href="${icons}#icon-arrow-left"></use>
    //   </svg>
    //   <span>Page 1</span>
    // </button>
    // <button class="btn--inline pagination__btn--next">
    //   <span>Page 3</span>
    //   <svg class="search__icon">
    //     <use href="${icons}#icon-arrow-right"></use>
    //   </svg>
    // </button>`
  }
}


export default new PaginationView;