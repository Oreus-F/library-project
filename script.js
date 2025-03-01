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
};


const book1 = new Book("1984","George Orwell", 391);
const book2 = new Book("The Lord of the Rings","J.R.R Tolkien", 1335);
const book3 = new Book("The Man in the High Castle","Philip K. Dick", 396);

myLibrary.push(book1, book2, book3);

/* addBookToLibrary(); */
console.log(myLibrary);