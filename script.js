const libraryDisplay = document.querySelector("#libraryDisplay");
const newBookButton = document.querySelector("#createNewBook");


myLibrary = [];

const Book = function(title, author, pages){
    this.title = title;
    this.author = author;
    this.pages = pages;
}

function addBookToLibrary() {
    // take parameters
    let title = prompt("Title ?");
    let author = prompt("Author ?");
    let pages = prompt("Pages ?");

    //Create new book
    const book = new Book(title, author, pages);
    
    //add it to library
    myLibrary.push(book);
}

function displayArray(array){
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
        author.textContent = item.author;
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

newBookButton.addEventListener("click", addBookToLibrary);

const book1 = new Book("1984","George Orwell", 391);
const book2 = new Book("The Lord of the Rings","J.R.R Tolkien", 1335);
const book3 = new Book("The Man in the High Castle","Philip K. Dick", 396);

myLibrary.push(book1, book2, book3);

/* addBookToLibrary(); */
console.log(myLibrary);