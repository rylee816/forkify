import View from "./View";

class AddRecipeView extends View {
    _parentElement = document.querySelector(".upload");
    _window = document.querySelector(".add-recipe-window");
    _overlay = document.querySelector(".overlay");
    _btnOpen = document.querySelector(".nav__btn--add-recipe");
    _btnClose = document.querySelector(".btn--close-modal");
    _message = "Fuckles"

    constructor() {
        super();
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();
    }

    toggleWindow(){
        this._overlay.classList.add("hidden");
        this._window.classList.add("hidden");
    }

    _addHandlerShowWindow() {
        this._btnOpen.addEventListener("click", () => {
            this._overlay.classList.toggle("hidden");
            this._window.classList.toggle("hidden");
        });
    };

    _addHandlerHideWindow(){
        this._btnClose.addEventListener("click", () => {
            this._overlay.classList.add("hidden");
            this._window.classList.add("hidden");
        });

        this._overlay.addEventListener("click", () => {
            this._overlay.classList.toggle("hidden");
            this._window.classList.toggle("hidden");
        });
    };

    addHandlerUpload(controller){
        this._parentElement.addEventListener("submit", function(e) {
            e.preventDefault();

            const dataArr = [...new FormData(this)];
            const data = Object.fromEntries(dataArr);

            controller(data)
        })
    }
   
}

export default new AddRecipeView;