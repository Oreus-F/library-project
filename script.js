/* VARIABLES */

const libraryDisplay = document.querySelector("#libraryDisplay");

const newBookButton = document.querySelector("#createNewBook");
const togglePanelButton = document.querySelector("#toggle-panel");
const toggleEditPanelButton = document.querySelector("#toggle-EditPanel");

const newBookForm = document.querySelector("#newBookForm");
const extraPanel = document.querySelector(".extraInfoPanel");
const editBookForm = document.querySelector("#editBookForm");
const extraEditPanel = document.querySelector(".edit");


const previewCover = document.querySelector("#preview");
const previewEditCover = document.querySelector("#editPreview");
const chooseCover = document.querySelector("#chooseCover");
const editCover = document.querySelector("#editCover");

const readCheckbox = document.querySelector("#readOrNot");
const favCheckbox = document.querySelector("#favorite");
const readIcon = document.querySelector("#readIcon");
const favIcon = document.querySelector("#favIcon");

const readEditCheckbox = document.querySelector("#readEdit");
const favEditCheckbox = document.querySelector("#favoriteEdit");
const readEditIcon = document.querySelector("#readEditIcon");
const favEditIcon = document.querySelector("#favEditIcon");

const closeForm = document.querySelector("#closeForm");
const closeEditForm = document.querySelector("#closeEditForm");

const formDataPanel = document.querySelector("#formData");
const sendBookButton = document.querySelector("#sendBookButton");
const checkSubmit = document.querySelector("#submit");
const editFormData = document.querySelector("#editFormData");
const editBookButton = document.querySelector("#editBookButton");

const template = document.querySelector(".template");


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


    if (event.target.id === "formData"){
        let formData = new FormData(event.target);
        formData = Object.fromEntries(formData.entries())
        
    
        addBookToLibrary(formData);
        closeForm.click();

    } else {
        // editBookData
        let formData = new FormData(event.target);
        formData = Object.fromEntries(formData.entries())

        
        editBookFromLibrary(formData, myLibrary);
        closeEditForm.click();
    }

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


function editBookFromLibrary(object, array) {
    

    let id = editFormData.id;
    
    array.forEach((book) => {

        // select the right book
        if (id === book.id){

            // Setup useful var
            let editProp = Object.keys(object);

            // loop through object OBJ properties
            editProp.forEach((index) => {

                if (index === "pages" || index === "parutionDate") {
                    // check if pages and parutionDate numbers are the same
                    let pages = Number(object[index]);
                    if (book[index] !== pages &&  pages > 0){
                        book[index] = pages;
                    };
                } else if (index === "cover"){
                    // check if preview's different
                    let editPreview = document.querySelector("#editPreview").firstChild.getAttribute("src");
                    if (editPreview !== book[index]){book[index] = editPreview};
                } else if (index === "readOrNot") {
                    if (book.read !== true) {book.toggleRead()};
                } else if (index === "favorite") {
                    // Check if fav is turned on
                    if (book[index] !== true) {book[index] = true;}
                } else if (book[index] !== object[index]) {
                    // check if a data exist
                    if (object[index] !== ""){book[index] = object[index]}
                };
            });

            // Check if read of fav has been turned off
            if (object.readOrNot === undefined && book.read === true){book.toggleRead()};
            if (object.favorite === undefined && book.read === true){book.toggleFavorite()};
            

        };
    });


    displayArray(array);
};


function displayArray(array){

    libraryDisplay.replaceChildren();

    array.forEach((item) => {

        const bookCard = template.cloneNode(true);
        bookCard.setAttribute("data-id", item.id);
        const id = item.id;

        bookCard.classList.toggle("template");
        
        const elements = bookCard.children;

        // cover
        elements[0].src = item.cover;
        elements[0].alt = `${item.title} book cover`;

        // title
        elements[1].textContent = item.title;

        // author
        elements[2].textContent = `by ${item.author}`;

        // pages
        elements[3].textContent = `${item.pages} pages`;

        // read checkbok
        const checkRead = elements[4].lastElementChild;

        if (item.read) {checkRead.checked = true};
        
        checkRead.addEventListener("change", () => {
            changeReadStatus(myLibrary, id);
        });

        // DIV with ICON
        const editIcon = elements[5].firstElementChild;
        const deleteIcon = elements[5].lastElementChild;

        editIcon.addEventListener("click", () => {
            showEditBookData(id, myLibrary);
            editBookForm.showModal();
        });

        deleteIcon.addEventListener("click", () => {
            if (window.confirm(`Do you really want to delete this book from your library ?`)){
                libraryDisplay.removeChild(bookCard);
                deleteFromLibrary(myLibrary, id);
            }
        })


        libraryDisplay.appendChild(bookCard);
    });

    
};


function getImgData(location){


    if (location === chooseCover){

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
    } else {
        // Dialog to edit book
        const files = editCover.files[0];
        const fileReader = new FileReader();
        fileReader.readAsDataURL(files);


        fileReader.addEventListener("load", (e) => {
            previewEditCover.replaceChildren();
            const image = new Image();
            image.src = e.target.result;
            image.alt = "book cover";
            image.classList.toggle("previewImg");
            previewEditCover.appendChild(image);
        });
    }
};


function resetForm(location) {

    if (location === newBookForm){
        if (readIcon.classList.value === "checkedRead"){readIcon.classList.toggle("checkedRead")};
        if (favIcon.classList.value === "checkedFav") {favIcon.classList.toggle("checkedFav")};

        previewCover.replaceChildren();
        const image = new Image();
        image.src = "assets/images/No-Image-Placeholder.svg.png";
        image.alt = "no book cover found";
        image.classList.toggle("previewImg");
        previewCover.appendChild(image);

    } else {
        if (readEditIcon.classList.value === "checkedRead"){readEditIcon.classList.toggle("checkedRead")};
        if (favEditIcon.classList.value === "checkedFav") {favEditIcon.classList.toggle("checkedFav")};

        previewEditCover.replaceChildren();
        const image = new Image();
        image.src = "assets/images/No-Image-Placeholder.svg.png";
        image.alt = "no book cover found";
        image.classList.toggle("previewImg");
        previewEditCover.appendChild(image);

    }
    




}


function deleteFromLibrary(array, id){
    array.forEach((item) => {
        if (id === item.id){
            array.splice(item, 1);
        };
    });
};


function changeReadStatus(array, id){
    array.forEach((item) => {
        if (id === item.id){
            item.toggleRead();
        };
    });
};


function showEditBookData(id, array){

    const values = editFormData.children;
    const panelValue = extraEditPanel.children;
    editFormData.id = id;

    array.forEach((book) => {
        if (id === book.id){

            // title
            values[1].lastElementChild.value = book.title;

            // author
            values[2].lastElementChild.value = book.author;

            // pages
            values[3].lastElementChild.value = book.pages;

            // editor
            if (book.editor !== undefined){values[4].lastElementChild.value = book.editor};

            // Parution Date
            if (book.parutionDate !== undefined){panelValue[0].lastElementChild.value = book.parutionDate};

            // format
            if (book.format !== undefined){panelValue[1].lastElementChild.value = book.format};

            // Read 
            if (book.read) {
                panelValue[2].lastElementChild.checked = true;
                readEditIcon.classList.toggle("checkedRead");
            };
            
            
            // Favorite
            if (book.favorite) {
                panelValue[3].lastElementChild.checked = true;
                favEditIcon.classList.toggle("checkedFav");
            };

            // PreviewImg
            if (book.cover) {
                previewEditCover.replaceChildren();
                const image = new Image();
                image.src = book.cover;
                image.alt = `${book.title} book cover`;
                image.classList.toggle("previewImg");
                previewEditCover.appendChild(image);
            };

            // Comment
            if (book.comment){values[7].lastElementChild.value = book.comment}

            // Rate
            if (book.rate){
                const rate = values[6].children;
                const rateValue = {
                    '5' : rate[1],
                    '4' : rate[3],
                    '3' : rate[5],
                    '2' : rate[7],
                    '1' : rate[9]
                };

                for (const value in rateValue){
                    if (book.rate === value){rate[value].click()}
                }

            }
        }
    })
}


/* EVENT LISTENER PART */

// Open window for new book
newBookButton.addEventListener("click", () => {newBookForm.showModal()})


// Close window for new book && edit book
closeForm.addEventListener("click", () => {
    resetForm(newBookForm);
    newBookForm.close()
});


closeEditForm.addEventListener("click", () => {
    // need checkpoint if values changes
    resetForm(editBookForm);
    editBookForm.close()});


// Open panel for more information inside Edit/NewBook window
togglePanelButton.addEventListener("click", () => {extraPanel.classList.toggle("visible")});
toggleEditPanelButton.addEventListener("click", () => extraEditPanel.classList.toggle("visible"))

// Display the preview of selected cover for both new/edit window
chooseCover.addEventListener("change", () => {getImgData(chooseCover)});
editCover.addEventListener("change", () => {getImgData(editCover)});

// fill the color of svg label for read and favorite status
readCheckbox.addEventListener("change", () => {readIcon.classList.toggle("checkedRead");});
favCheckbox.addEventListener("change", () => {favIcon.classList.toggle("checkedFav")});

readEditCheckbox.addEventListener("change", () => {readEditIcon.classList.toggle("checkedRead");});
favEditCheckbox.addEventListener("change", () => {favEditIcon.classList.toggle("checkedFav")});

// activate new book process
formDataPanel.addEventListener("submit", sendBookData);

// activate edit book process
editFormData.addEventListener("submit", sendBookData);



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
book1.toggleRead();
book2.storeEditor("CHRISTIAN BOURGOIS EDITEUR");
book3.storeFormat("pin");




myLibrary.push(book1, book2, book3);

displayArray(myLibrary);
console.log(myLibrary);



