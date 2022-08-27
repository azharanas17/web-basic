const books = [];
const RENDER_EVENT = 'render-book',
        STORAGE_KEY = 'BOOKSHELF_APPS',
        SAVED_EVENT = 'saved-book';

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

function addBook() {
    const textTitle = document.getElementById("inputBookTitle").value;
    const textAuthor = document.getElementById("inputBookAuthor").value;
    const numberYear = document.getElementById("inputBookYear").value;
    const checkCompleted = document.getElementById("inputBookIsComplete").checked;
    console.log(checkCompleted);
    const generateID = generateId();

    const bookObject = generateBookObject(generateID, textTitle, textAuthor, numberYear, checkCompleted);
    books.push(bookObject);

    console.log(books);
    window.alert("Buku telah ditambahkan");
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function searchBook() {
    const bookSearch = document.getElementById('searchBookTitle').value.toLowerCase();
    const bookList = document.querySelectorAll('.inner');
    for (const book of bookList) {
        if (book.innerText.toLowerCase().includes(bookSearch)){
            book.parentElement.style.display = "block";
        } else {
            book.parentElement.style.display = "none";
        }
    }
    window.alert("Buku telah ditemukan");
}

function makeBook(bookObject) {
    const inTitle = document.createElement('h2');
    inTitle.innerText = bookObject.title;

    const inAuthor = document.createElement('p');
    inAuthor.innerText = bookObject.author;

    const inYear = document.createElement('p');
    inYear.innerText = bookObject.year;

    const inContainer = document.createElement('div');
    inContainer.classList.add('inner');
    inContainer.append(inTitle, inAuthor, inYear);

    const container = document.createElement('div');
    container.append(inContainer);
    container.setAttribute('id', 'book-${bookObject.id}');

    if (bookObject.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');
        undoButton.innerText = "Belum selesai dibaca";

        undoButton.addEventListener('click', function() {
            undoBookFromCompleted(bookObject.id);
        });

        const xButton = document.createElement('button');
        xButton.classList.add('x-button');
        xButton.innerText = "Hapus buku";

        xButton.addEventListener('click', function() {
            removeBookFromCompleted(bookObject.id);
        });

        container.append(undoButton, xButton);
    } else {
        const yButton = document.createElement('button');
        yButton.classList.add('y-button');
        yButton.innerText = "Sudah selesai dibaca";

        yButton.addEventListener('click', function() {
            addBookToCompleted(bookObject.id);
        });

        const xButton = document.createElement('button');
        xButton.classList.add('x-button');
        xButton.innerText = "Hapus buku";
        
        xButton.addEventListener('click', function() {
            removeBookFromCompleted(bookObject.id);
        });
        container.append(yButton, xButton);
    }

    return container;
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId)
            return bookItem;
    }
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId)
            return index;
    }
    return -1;
}

function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;
    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    window.alert("Buku dipindahkan ke rak belum dibaca");
}

function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    if(bookTarget === -1) return;
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    window.alert("Buku telah dihapus");
}

function addBookToCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    window.alert("Buku telah selesai dibaca");
}

document.addEventListener(RENDER_EVENT, function() {
    const completedBookList = document.getElementById('completeBookshelfList');
    completedBookList.innerHTML = "";

    const uncompletedBookList = document.getElementById('uncompletedBookshelfList');
    uncompletedBookList.innerHTML = "";

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);

        if (!bookItem.isCompleted)
            uncompletedBookList.append(bookElement);
        else
            completedBookList.append(bookElement);
    }
});

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser tidak mendukung local storage');
        return false;
    }
    return true;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

document.addEventListener(SAVED_EVENT, function() {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener('DOMContentLoaded', function() {
    const submitFormInput = document.getElementById('inputBook');
    submitFormInput.addEventListener('submit', function(event) {
        event.preventDefault();
        addBook();
    });

    const submitFormSearch = document.getElementById('searchBook');
    submitFormSearch.addEventListener('submit', function(event) {
        event.preventDefault();
        searchBook();
    })
    if (isStorageExist) {
        loadDataFromStorage();
    }
});
