const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can log in." });
});


// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found with the given ISBN." });
  }
});

  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();
  const matchingBooks = [];

  for (const key in books) {
    if (books[key].author.toLowerCase() === author) {
      matchingBooks.push({ isbn: key, ...books[key] });
    }
  }

  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "No books found by the given author." });
  }
});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();
  const matchingBooks = [];

  for (const key in books) {
    if (books[key].title.toLowerCase() === title) {
      matchingBooks.push({ isbn: key, ...books[key] });
    }
  }

  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "No books found with the given title." });
  }
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json({ reviews: books[isbn].reviews });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});


module.exports.general = public_users;

const axios = require('axios');

async function getAllBooks() {
  try {
    const response = await axios.get('http://localhost:5000/');
    console.log("All books:", response.data);
  } catch (error) {
    console.error("Error fetching books:", error.message);
  }
}

getAllBooks(); 

async function getBookByISBN(isbn) {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    console.log(`Book with ISBN ${isbn}:`, response.data);
  } catch (error) {
    console.error(`Error fetching book with ISBN ${isbn}:`, error.message);
  }
}

getBookByISBN(3); 

async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    console.log(`Books by ${author}:`, response.data);
  } catch (error) {
    console.error(`Error fetching books by ${author}:`, error.message);
  }
}

getBooksByAuthor("Hans Christian Andersen"); 

async function getBooksByTitle(title) {
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    console.log(`Books with title "${title}":`, response.data);
  } catch (error) {
    console.error(`Error fetching books with title "${title}":`, error.message);
  }
}

getBooksByTitle("Le Père Goriot"); 

