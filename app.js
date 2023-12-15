document.addEventListener('DOMContentLoaded', function () {
    renderBooks();

    document.getElementById('addBookForm').addEventListener('submit', function (e) {
        e.preventDefault();
    });
});

function addBook() {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const year = document.getElementById('year').value;
    const isComplete = document.getElementById('isComplete').checked;

    if (title && author && year) {
        const book = {
            id: generateId(),
            title: title,
            author: author,
            year: parseInt(year),
            isComplete: isComplete
        };

        saveBook(book);
        renderBooks();
        clearForm();
    } else {
        alert('Silakan isi semua kolom form.');
    }
}

function generateId() {
    return Date.now();
}

function saveBook(book) {
    const shelfKey = book.isComplete ? 'finishedList' : 'unfinishedList';
    let books = getBooks(shelfKey);
    books.push(book);
    localStorage.setItem(shelfKey, JSON.stringify(books));
}

function getBooks(shelfKey) {
    return JSON.parse(localStorage.getItem(shelfKey)) || [];
}

function moveBook(bookId, fromShelfKey, toShelfKey) {
    const fromBooks = getBooks(fromShelfKey);
    const toBooks = getBooks(toShelfKey);

    const movedBook = fromBooks.find(book => book.id === bookId);
    movedBook.isComplete = !movedBook.isComplete;

    saveBooks(fromShelfKey, fromBooks.filter(book => book.id !== bookId));
    saveBooks(toShelfKey, [...toBooks, movedBook]);

    renderBooks();
}

function deleteBook(bookId, shelfKey) {
    const books = getBooks(shelfKey);
    const updatedBooks = books.filter(book => book.id !== bookId);
    saveBooks(shelfKey, updatedBooks);
    renderBooks();
}

function saveBooks(shelfKey, books) {
    localStorage.setItem(shelfKey, JSON.stringify(books));
}

function renderBooks() {
    renderShelf('unfinishedList', 'unfinishedShelf');
    renderShelf('finishedList', 'finishedShelf');
}

function renderShelf(shelfKey, shelfElementId) {
    const shelfList = document.getElementById(shelfKey);
    const books = getBooks(shelfKey);
    const shelfElement = document.getElementById(shelfElementId);

    shelfList.innerHTML = '';

    books.forEach(book => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <strong>${book.title}</strong> - ${book.author} (${book.year})
            <button onclick="moveBook(${book.id}, '${shelfKey}', '${shelfKey === 'finishedList' ? 'unfinishedList' : 'finishedList'}')">
                ${book.isComplete ? 'Belum Selesai' : 'Selesai'}
            </button>
            <button onclick="deleteBook(${book.id}, '${shelfKey}')">Hapus</button>
        `;
        listItem.classList.add('list-group-item');
        shelfList.appendChild(listItem);
    });

    shelfElement.style.display = books.length > 0 ? 'block' : 'none';
}

function clearForm() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('year').value = '';
    document.getElementById('isComplete').checked = false;
}
