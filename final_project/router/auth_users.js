const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  {"username": "owais","password": 1234},
  {"username": "owaisob","password": 1234}
];


const authenticatedUser = (username,password)=>{
  return users.find(u => u.username === username && u.password === password)
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const user = authenticatedUser(username, password)
  if(!user) {
    return res.status(404).json({message: "Invalid credentials!"})
  }

  const token = jwt.sign({ username: user.username }, "hello", { expiresIn: "1h" });

  req.session.authorization = {
    accessToken: token
  };

  return res.status(200).json({
    message: "Login successful",
    token: token
  });
});

// Add a book review
regd_users.patch("/auth/review/:isbn", (req, res) => {
  const {isbn} = req.params;
  const {review} = req.query;

  const book = books[isbn];
  
  if (!book) {
    return res.status(404).json({message: "Book not found"});
  }

  if (!review) {
    return res.status(400).json({message: "Review is required"});
  }

  // Initialize reviews object if it doesn't exist
  if (!book.reviews) {
    book.reviews = {};
  }

  // Add or update review for this user
  book.reviews[req.user.username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully",
    book: book
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const {isbn} = req.params;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({message: "Book not found"});
  }

  if (!book.reviews || !book.reviews[req.user.username]) {
    return res.status(404).json({message: "No review found for this user"});
  }

  // Delete only the review by the logged in user
  delete book.reviews[req.user.username];

  return res.status(200).json({
    message: "Review deleted successfully",
    book: book
  });
});

module.exports.authenticated = regd_users;
module.exports.users = users;
