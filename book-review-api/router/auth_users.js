const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Function to check if the username is valid
const isValid = (username) => {
  return typeof username === 'string' && username.trim().length > 0;
};

// Function to check if username and password match any registered user
const authenticatedUser = (username, password) => {
  const user = users.find(u => u.username === username && u.password === password);
  return !!user;
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid login. Check username and password." });
  }

  let accessToken = jwt.sign(
    { username: username },
    "access", // secret key
    { expiresIn: 60 * 60 } // 1 hour
  );

  req.session.authorization = {
    accessToken,
    username
  };

  return res.status(200).json({ message: "User successfully logged in", token: accessToken });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(401).json({ message: "User not logged in" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review content is missing" });
  }

  // Ensure reviews object exists
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Review added/modified successfully", reviews: books[isbn].reviews });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(401).json({ message: "User not logged in" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  const reviews = books[isbn].reviews;

  if (reviews && reviews.hasOwnProperty(username)) {
    delete reviews[username];
    return res.status(200).json({ message: `Review by ${username} deleted successfully.` });
  } else {
    return res.status(404).json({ message: "Review by this user not found." });
  }
});

// Exporting modules
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
