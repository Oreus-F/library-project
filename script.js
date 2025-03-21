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

const formData = document.querySelector("#formData");
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


    if (formData.title.value === "" || 
        formData.author.value === "" || 
        formData.pages.value === "")
        {checkSubmit.click();
        return;};
    
    
    let result = {};

    result.title = formData.title.value;
    result.author = formData.author.value;
    result.pages = formData.pages.value;
    if (!(formData.editor.value === "")){result.editor = formData.editor.value};
    if (!(formData.parutionDate.value === "")) {result.parutionDate = formData.parutionDate.value};
    if (!(formData.format.value === "")) {result.format = formData.format.value};
    if (!(formData.comment.value === "")) {result.comment = formData.comment.value};
    if (!(formData.rate.value === "")) {result.rate = formData.rate.value};


    if (formData.readOrNot.checked) {result.readOrNot = true};
    if (formData.favorite.checked) {result.favorite = true};
    if (!(chooseCover.value === "")) {result.cover = true};
    
    addBookToLibrary(result);
    closeForm.click();
};


function addBookToLibrary(object) {
    //Create new book
    const book = new Book(object.title, object.author, Number(object.pages));
    book.generateId();
    if (object.editor !== undefined){book.storeEditor(object.editor)};
    if (object.parutionDate !== undefined){book.storeParutionDate(object.parutionDate)};
    if (object.format !== undefined){book.storeFormat(object.format)};
    if (object.readOrNot !== undefined){book.toggleRead()};
    if (object.favorite !== undefined){book.toggleFavorite()};
    if (object.cover !== undefined){book.storeCover()};
    if (object.comment !== undefined){book.storeComment(object.comment)};
    if (object.rate !== undefined){book.storeRate(object.rate)};

    console.log(object);
    console.log(book);
    
    
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

        /* DECOUVRIR POURQUOI L'IMAGE NE S'ACTUALISE PAS */

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

    console.log(myLibrary[3]);

    
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
    newBookForm.close()});

togglePanelButton.addEventListener("click", () => {extraPanel.classList.toggle("visible")});
chooseCover.addEventListener("change", () => {getImgData();});

readCheckbox.addEventListener("change", () => {readIcon.classList.toggle("checkedRead");});
favCheckbox.addEventListener("change", () => {favIcon.classList.toggle("checkedFav")});

sendBookButton.addEventListener("click", sendBookData);



/* CONSOLE TEST  */


const book1 = new Book("1984","George Orwell", 391);
const book2 = new Book("The Lord of the Rings","J.R.R Tolkien", 1335);
const book3 = new Book("The Man in the High Castle","Philip K. Dick", 396);
book1.generateId(); book2.generateId(); book3.generateId();


myLibrary.push(book1, book2, book3);

displayArray(myLibrary);
console.log(myLibrary);