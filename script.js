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

const filter = document.querySelector("#filter");
const filterOption = document.querySelector("#order");
const search = document.querySelector("#search");
const searchForm = document.querySelector("#searchBarForm");

const counterBook = document.querySelector("#counterBook");
const counterRead = document.querySelector("#counterRead");
const counterFav = document.querySelector("#counterFav");


const myLibrary = [];



// LES IMAGES SONT TROP GRANDES MODIFIE UNIQUEMENT SUR CSS ELLES PRENNENT TROP DE PLACES DANS LE DOM A MODIFIER

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
                    if (book.favorite !== true) {book.toggleFavorite()};
                } else if (book[index] !== object[index]) {
                    // check if a data exist
                    if (object[index] !== ""){book[index] = object[index]}
                };
            });

            // Check if read of fav has been turned off
            if (object.readOrNot === undefined && book.read === true){book.toggleRead()};
            if (object.favorite === undefined && book.favorite === true){book.toggleFavorite()};
            

        };
    });


    displayArray(array);
};


function displayArray(array){

    libraryDisplay.replaceChildren();

    
    // ONCE SPECIAL OPTION CREATED - PUT ALL FILTER
    if (filterOption.checked === false){
        if (filter.value === "title") {array = array.slice().sort((a, b) => a.title.localeCompare(b.title))};
        if (filter.value === "author") {array = array.slice().sort((a, b) => a.author.localeCompare(b.author))};
        if (filter.value === "pages") {array = array.slice().sort((a, b) => a.pages - b.pages)};
        if (filter.value === "parution") {array = array.slice().sort((a, b) => a.parutionDate - b.parutionDate)};

        // read and fav not working cannot use sort that way
        if (filter.value === "read") {
            array = array.slice().filter((book) => book.read);
            myLibrary.forEach((book) => {
                if (book.read !== true){
                    array.push(book);
                };
            });
        };
        if (filter.value === "favorite") {
            array = array.slice().filter((book) => book.favorite);
            myLibrary.forEach((book) => {
                if (book.favorite !== true){array.push(book);};
            });
        };


        if (filter.value === "rate") {array = array.slice().filter((book) => book.rate).sort((a, b) => a.rate + b.rate);}

    } else {
        if (filter.value === "title") {array = array.slice().sort((a, b) => b.title.localeCompare(a.title))};
        if (filter.value === "author") {array = array.slice().sort((a, b) => b.author.localeCompare(a.author))};
        if (filter.value === "pages") {array = array.slice().sort((a, b) => b.pages - a.pages)};
        if (filter.value === "parution") {array = array.slice().sort((a, b) => b.parutionDate - a.parutionDate)};

        if (filter.value === "read") {
            array = array.slice().filter((book) => book.read !== true);
            myLibrary.forEach((book) => {
                if (book.read){
                    array.push(book);
                };
            });
        };

        if (filter.value === "favorite") {
            array = array.slice().filter((book) => book.favorite !== true);
            myLibrary.forEach((book) => {
                if (book.favorite){
                    array.push(book);
                };
            });
        };

        if (filter.value === "rate") {array = array.slice().filter((book) => book.rate).sort((a, b) => a.rate - b.rate);}
    }


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
        const labelRead = elements[4].firstElementChild;
        const svgRead = labelRead.firstElementChild;
        const checkRead = elements[4].lastElementChild;

        labelRead.setAttribute(`for`, `read-${id}`);
        checkRead.id = `read-${id}`;

        if (item.read) {
            checkRead.checked = true
            svgRead.classList.toggle("checkedRead")
        };
        
        checkRead.addEventListener("change", () => {
            changeReadStatus(myLibrary, id);
            displayArray(myLibrary);
        });

        checkRead.addEventListener("change", () => {svgRead.classList.toggle("checkedRead");});
        
        // fav checkbox
        const labelFav = elements[5].firstElementChild;
        const svgFav = labelFav.firstElementChild;
        const checkFav = elements[5].lastElementChild;
        
        labelFav.setAttribute(`for`, `fav-${id}`);
        checkFav.id = `fav-${id}`;
        
        if (item.favorite) {
            checkFav.checked = true
            svgFav.classList.toggle("checkedFav")
        };
        
        checkFav.addEventListener("change", () => {
            changeFavStatus(myLibrary, id);
            displayArray(myLibrary);
        })
        
        checkFav.addEventListener("change", () => {svgFav.classList.toggle("checkedFav")});


        // DIV with ICON
        const editIcon = elements[6].firstElementChild;
        const deleteIcon = elements[6].lastElementChild;

        editIcon.addEventListener("click", () => {
            showEditBookData(id, myLibrary);
            editBookForm.showModal();
        });

        deleteIcon.addEventListener("click", () => {
            if (window.confirm(`Do you really want to delete this book from your library ?`)){
                deleteFromLibrary(myLibrary, id);
                displayArray(myLibrary)
            }
        })


        libraryDisplay.appendChild(bookCard);
    });

    editCounter(array);    
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
    array.forEach((item, index) => {
        if (id === item.id){
            array.splice(index, 1);
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


function changeFavStatus(array, id){
    array.forEach((item) => {
        if (id === item.id) {
            item.toggleFavorite();
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

                if (book.rate === "5") rate[1].click();
                if (book.rate === "4") rate[3].click();
                if (book.rate === "3") rate[5].click();
                if (book.rate === "2") rate[7].click();
                if (book.rate === "1") rate[9].click();
            }
        }
    })
}


function getSpecificBook(array){
    let request = search.value.toLowerCase();



    let result = array.filter((book) => {

        return book.title
        .toLowerCase()
        .includes(request);
    })

    displayArray(result);
};


function editCounter(array){
    let totalBook = 0;
    let totalRead = 0;
    let totalFav = 0;

    array.forEach((book) => {
        totalBook++; 
        if (book.read === true) totalRead++;
        if (book.favorite === true) totalFav++;
    });

    counterBook.textContent = totalBook;
    counterRead.textContent = totalRead;
    counterFav.textContent = totalFav;
};


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
    editBookForm.close()
});


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


// Display Books with filter
filter.addEventListener("change", () => {displayArray(myLibrary)});


// unlocked order option after choosing a filter (only once)
filter.addEventListener("change", () => {filterOption.disabled = false, once=true})


// Display book after selecting Option 
filterOption.addEventListener("change", () => {displayArray(myLibrary)});


// Searching Zone
searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    getSpecificBook(myLibrary);
});


// 

/* CONSOLE TEST  */


const book1 = new Book("1984","George Orwell", 391);
const book2 = new Book("The Lord of the Rings","J.R.R Tolkien", 1335);
const book3 = new Book("The Man in the High Castle","Philip K. Dick", 396);
const book4 = new Book("Brave New World", "Aldous Huxley", 317)
const book5 = new Book("Le Petit Prince", "Antoine de Saint-Exupéry", 128)
const book6 = new Book("Conquering the Impossible", "Mike Horn", 461)
const book7 = new Book("Acid Summer", "Christophe Lambert", 226)
const book8 = new Book("Waylander", "David Gemmel", 355);
const book9 = new Book("Moby Dick", "Herman Melville", 635);
const book10 = new Book("Ubik", "Philip K. Dick", 288);
const book11 = new Book("Flash ou le Grand Voyage", "Charles Duchaussois", 427);
const book12 = new Book("Azteca", "Gary Jennings", 1047);


book1.generateId();
book2.generateId(); 
book3.generateId();
book4.generateId();
book5.generateId();
book6.generateId();
book7.generateId();
book8.generateId();
book9.generateId();
book10.generateId();
book11.generateId();
book12.generateId();


book1.cover = "assets/images/1984_cover.jpg";
book2.cover = "assets/images/LOTR_cover.jpg";
book3.cover = "assets/images/theManInTheHighCastle.jpg";
book4.cover = "assets/images/braveNewWorld.jpg";
book5.cover = "assets/images/lePetitPrince.jpg";
book6.cover = "assets/images/conqueringTheImpossible.jpg";
book7.cover = "assets/images/acidSummer.jpg";
book8.cover = "assets/images/Waylander.jpg";
book9.cover = "assets/images/mobyDick.jpeg";
book10.cover = "assets/images/ubik.jpg";
book11.cover = "assets/images/flashGrandVoyage.jpeg";
book12.cover = "assets/images/azteca.jpg";


book1.toggleRead();
book5.toggleRead();
book6.toggleRead();
book7.toggleRead();
book8.toggleRead();

book5.toggleFavorite();
book6.toggleFavorite();

book2.storeEditor("CHRISTIAN BOURGOIS EDITEUR");
book5.storeEditor("LIVRARIA LELLO")
book6.storeEditor("XO EDITION")
book7.storeEditor("MILAN");
book8.storeEditor("BRAGELONNE");
book12.storeEditor("HACHETTE");

book1.storeFormat("audiobook");
book3.storeFormat("connected");
book4.storeFormat("kindle");
book5.storeFormat("connected");
book6.storeFormat("connected");
book7.storeFormat("connected");
book8.storeFormat("connected");
book11.storeFormat("kindle");
book12.storeFormat("connected");

book1.storeParutionDate(1949);
book2.storeParutionDate(1954);
book3.storeParutionDate(1962);
book4.storeParutionDate(1932);
book5.storeParutionDate(1943);
book7.storeParutionDate(2019);
book10.storeParutionDate(1969);
book12.storeParutionDate(1991);


book2.storeComment("Yes i know i didnt read it yet and it's rated 5 stars ... I know, what are you gonna do about it ? ")
book5.storeComment("Easy to read, different layers of lecture, for kids and adult who forgot they're still kids")
book6.storeComment("I mean, i like bouldering but alpinism it's kinda impressive from here ... Warm in my bed")
book7.storeComment("One of my old teacher's book, enjoy it one day, it's french, if you're brave enough");
book8.storeComment("It's an OK fantasy book, the whole saga Gemmel created it's kinda cool to read though, you should look");


book1.storeRate('4');
book2.storeRate('5');
book5.storeRate('4');
book7.storeRate('3');
book8.storeRate('3');



myLibrary.push(book3, book1, book2, book4, book5, book6, book7, book8, book9, book10, book11, book12);

displayArray(myLibrary);
console.log(myLibrary);
