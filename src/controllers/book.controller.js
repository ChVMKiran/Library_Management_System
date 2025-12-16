const bookService = require("../services/book.service");

exports.createBook = async (req, res) => {
  try {
    const book = await bookService.createBook(req.body);
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const books = await bookService.getAllBooks();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAvailableBooks = async (req, res) => {
  try {
    const books = await bookService.getAvailableBooks();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await bookService.getBookById(req.params.id);
    res.json(book);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    await bookService.updateBook(req.params.id, req.body);
    res.json({ message: "Book updated successfully" });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    await bookService.deleteBook(req.params.id);
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};
