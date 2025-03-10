const libraryDisplay = document.querySelector("#libraryDisplay");

const newBookButton = document.querySelector("#createNewBook");
const togglePanelButton = document.querySelector("#toggle-panel");

const newBookForm = document.querySelector("#newBookForm");
const extraPanel = document.querySelector(".extraInfoPanel");


const previewCover = document.querySelector("#preview");
const chooseCover = document.querySelector("#chooseCover");

const readCheckbox = document.querySelector("#readOrNot");
const favCheckbox = document.querySelector("#favorite");
const readIcon = document.querySelector("#readIcon");
const favIcon = document.querySelector("#favIcon");


myLibrary = [];

newBookForm.showModal();

const Book = function(title, author, pages){
    this.title = title;
    this.author = author;
    this.pages = pages;
}

Book.prototype.id = undefined;

Book.prototype.generateId = function () {
    if(this.id ===undefined) {this.id = crypto.randomUUID()};
};


function addBookToLibrary() {
    // take parameters
    let title = prompt("Title ?");
    let author = prompt("Author ?");
    let pages = prompt("Pages ?");

    //Create new book
    const book = new Book(title, author, pages);
    book.generateId();
    
    //add it to library
    myLibrary.push(book);

    displayArray(myLibrary);
}

function displayArray(array){

    libraryDisplay.replaceChildren();

    array.forEach(item => {

        const bookCard = document.createElement("div");
        bookCard.classList.add("card");

        const img = document.createElement("img");
        img.setAttribute("src", "assets/images/No-Image-Placeholder.svg.png");
        img.setAttribute("alt", "No cover founded");
        bookCard.appendChild(img);

        const title = document.createElement("p");
        title.textContent = item.title;
        bookCard.appendChild(title);

        const author = document.createElement("p");
        author.textContent = "by " + item.author;
        bookCard.appendChild(author);

        const pages = document.createElement("p");
        pages.textContent = item.pages + " pages";
        bookCard.appendChild(pages);

        const pRead = document.createElement("p");

        const label = document.createElement("label");
        label.textContent = "Read : ";
        label.setAttribute("for", "read");
        pRead.appendChild(label);

        const checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("name", "read");
        checkbox.setAttribute("id", "read");
        pRead.appendChild(checkbox);
        bookCard.appendChild(pRead);

        libraryDisplay.appendChild(bookCard);
    });


};


function getImgData(){
    const files = chooseCover.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(files);
    fileReader.addEventListener("load", (e) => {
        previewCover.replaceChildren();
        const image = document.createElement("img");
        image.src = e.target.result;
        image.alt = "book cover";
        image.height = 100
        previewCover.appendChild(image);
    });
};

const book1 = new Book("1984","George Orwell", 391);
const book2 = new Book("The Lord of the Rings","J.R.R Tolkien", 1335);
const book3 = new Book("The Man in the High Castle","Philip K. Dick", 396);
book1.generateId(); book2.generateId(); book3.generateId();

myLibrary.push(book1, book2, book3);

newBookButton.addEventListener("click", addBookToLibrary);
togglePanelButton.addEventListener("click", () => {extraPanel.classList.toggle("visible")});

readCheckbox.addEventListener("change", () => {readIcon.classList.toggle("checkedRead");})
favCheckbox.addEventListener("change", () => {favIcon.classList.toggle("checkedFav")})



chooseCover.addEventListener("change", () => {getImgData();})








/* CONSOLE TEST  */
displayArray(myLibrary);
console.log(myLibrary);