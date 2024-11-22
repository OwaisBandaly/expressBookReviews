const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.get('/books-async', async function (req, res) {
  try {
    const getBooks = await new Promise((resolve) => {
      resolve(books);
    });
    res.status(200).json(getBooks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error });
  }
});

public_users.get('/books-isbn-async/:isbn', async function (req, res) {
  try {
    const {isbn} = req.params;
    const getBooks = await new Promise((resolve) => {
      resolve(books[isbn]);
    });
    res.status(200).json(getBooks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error });
  }
});

public_users.get('/books-author-async/:author', async function (req, res) {
  try {
    const {author} = req.params;
    const getBooks = await new Promise((resolve) => {
      resolve(Object.values(books).filter(book => book.author === author));
    });
    res.status(200).json(getBooks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error });
  }
});

public_users.get('/books-title-async/:title', async function (req, res) {
  try {
    const {title} = req.params;
    const getBooks = await new Promise((resolve) => {
      resolve(Object.values(books).filter(book => book.title === title));
    });
    res.status(200).json(getBooks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error });
  }
});


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (users.find(user => user.username === username)) {
    return res.status(409).json({
      message: "Username already exists" 
    });
  }

  users.push({ username, password });
  console.log(users);
  
  return res.status(300).json({message: "User registerd successfully"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 4));
  return res.status(300).json({message: "Fetched All books."});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const {isbn} = req.params;
  res.send(JSON.stringify(books[isbn], null, 4))
  return res.status(300).json({message: "Fetched book via ISBN."});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const {author} = req.params;
  const matchingBooks = Object.values(books).filter(book => book.author === author);
  
  if (matchingBooks.length > 0) {
    res.send(JSON.stringify(matchingBooks, null, 4));
  } else {
    res.status(404).json({message: "No books found for this author"});
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const {title} = req.params;
  const matchingTitle = Object.values(books).filter(book => book.title === title);
  
  if (matchingTitle.length > 0) {
    res.send(JSON.stringify(matchingTitle, null, 4));
  } else {
    res.status(404).json({message: "No books found for this title"});
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const {isbn} = req.params;
  if(isbn) {
    res.send(JSON.stringify(books[isbn].reviews), null, 4)
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
