/* VARIABLES */

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

const closeForm = document.querySelector("#closeForm");

const formDataPanel = document.querySelector("#formData");
const sendBookButton = document.querySelector("#sendBookButton");
const checkSubmit = document.querySelector("#submit");


const myLibrary = [];

/* OBJECT AND PROTOTYPE */

const Book = function(title, author, pages){
    this.title = title;
    this.author = author;
    this.pages = pages;
}

Book.prototype.generateId = function () {
    if(this.id === undefined) {this.id = crypto.randomUUID()};
};

Book.prototype.toggleRead = function () {
    if(this.read) {this.read = false} 
    else {this.read = true};
};

Book.prototype.toggleFavorite = function () {
    if (this.favorite){this.favorite = false}
    else {this.favorite = true};
};

Book.prototype.storeEditor = function(editor){
    this.editor = editor;
};

Book.prototype.storeParutionDate = function(date){
    this.parutionDate = date;
};

Book.prototype.storeFormat = function(format){
    this.format = format;
};

Book.prototype.storeComment = function(comment){
    this.comment = comment;
};

Book.prototype.storeRate = function(value){
    this.rate = value;
};

Book.prototype.storeCover = function(){
    const previewImg = document.querySelector(".previewImg");
    this.cover = previewImg.src;
};

/* FUNCTIONS PART */


const sendBookData = function(event){

    event.preventDefault();


    if (formDataPanel.title.value === "" || 
        formDataPanel.author.value === "" || 
        formDataPanel.pages.value === "")
        {checkSubmit.click();
        return;
    };
    

    let formData = new FormData(event.target);
    formData = Object.fromEntries(formData.entries())
    

    addBookToLibrary(formData);
    closeForm.click();
};


function addBookToLibrary(object) {
    //Create new book
    const book = new Book(object.title, object.author, Number(object.pages));
    book.generateId();

    if (object.editor > 0){book.storeEditor(object.editor)};
    if (object.parutionDate > 0){book.storeParutionDate(object.parutionDate)};
    if (object.format > 0){book.storeFormat(object.format)};
    if (object.readOrNot > 0){book.toggleRead()};
    if (object.favorite > 0){book.toggleFavorite()};
    if (object.cover !== undefined){book.storeCover()};
    if (object.comment > 0){book.storeComment(object.comment)};
    if (object.rate > 0){book.storeRate(object.rate)};
    
    
    //add it to library
    myLibrary.push(book);
    displayArray(myLibrary)

}

function displayArray(array){

    libraryDisplay.replaceChildren();

    array.forEach((item) => {

        const bookCard = document.createElement("div");
        bookCard.classList.add("card");

        const img = new Image();

        if (item.cover !== undefined){
            img.src = item.cover;
            img.alt = "book cover"
            bookCard.appendChild(img);
        } else {
            img.src = "assets/images/No-Image-Placeholder.svg.png";
            img.alt = "No cover founded";
            bookCard.appendChild(img);
        };

        // créer le titre
        const title = document.createElement("p");
        title.textContent = item.title;
        bookCard.appendChild(title);

        // créer l'auteur
        const author = document.createElement("p");
        author.textContent = "by " + item.author;
        bookCard.appendChild(author);

        // créer le nombre de pages
        const pages = document.createElement("p");
        pages.textContent = item.pages + " pages";
        bookCard.appendChild(pages);

        // créer checkbox for read
        // NEED TO BE CHANGED TO BE AN UNIQUE ONE
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

        // Associate Card with Item ID
        bookCard.setAttribute("data-id", item.id);

        libraryDisplay.appendChild(bookCard);
    });

    
};

function getImgData(){
    const files = chooseCover.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(files);
    fileReader.addEventListener("load", (e) => {
        previewCover.replaceChildren();
        const image = new Image();
        image.src = e.target.result;
        image.alt = "book cover";
        image.classList.toggle("previewImg");
        previewCover.appendChild(image);
    });
};


function resetForm() {
    if (readIcon.classList.value === "checkedRead"){readIcon.classList.toggle("checkedRead")};
    if (favIcon.classList.value === "checkedFav") {favIcon.classList.toggle("checkedFav")};
    previewCover.replaceChildren();
    const image = new Image();
    image.src = "assets/images/No-Image-Placeholder.svg.png";
    image.alt = "no book cover found";
    image.classList.toggle("previewImg");
    previewCover.appendChild(image);
}

/* EVENT LISTENER PART */

newBookButton.addEventListener("click", () => {newBookForm.showModal()})
closeForm.addEventListener("click", () => {
    resetForm();
    newBookForm.close()
});

togglePanelButton.addEventListener("click", () => {extraPanel.classList.toggle("visible")});
chooseCover.addEventListener("change", () => {getImgData();});

readCheckbox.addEventListener("change", () => {readIcon.classList.toggle("checkedRead");});
favCheckbox.addEventListener("change", () => {favIcon.classList.toggle("checkedFav")});

formDataPanel.addEventListener("submit", sendBookData);



/* CONSOLE TEST  */


const book1 = new Book("1984","George Orwell", 391);
const book2 = new Book("The Lord of the Rings","J.R.R Tolkien", 1335);
const book3 = new Book("The Man in the High Castle","Philip K. Dick", 396);
book1.generateId();
book2.generateId(); 
book3.generateId();
book1.cover = "assets/images/1984_cover.jpg";
book2.cover = "assets/images/LOTR_cover.jpg";
book3.cover = "assets/images/theManInTheHighCastle.jpg";



myLibrary.push(book1, book2, book3);

displayArray(myLibrary);
console.log(myLibrary);



