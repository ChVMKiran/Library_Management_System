const pool = require("../config/db");

exports.createBook = async (data) => {
  const {
    isbn,
    title,
    author,
    category,
    total_copies
  } = data;

  if (!title || !total_copies) {
    throw new Error("Title and total_copies are required");
  }

  const available_copies = total_copies;

  const [result] = await pool.query(
    `INSERT INTO books 
     (isbn, title, author, category, total_copies, available_copies)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [isbn, title, author, category, total_copies, available_copies]
  );

  return {
    id: result.insertId,
    isbn,
    title,
    author,
    category,
    total_copies,
    available_copies,
    status: "available"
  };
};

exports.getAllBooks = async () => {
  const [rows] = await pool.query("SELECT * FROM books");
  return rows;
};

exports.getAvailableBooks = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM books WHERE available_copies > 0"
  );
  return rows;
};

exports.getBookById = async (id) => {
  const [rows] = await pool.query(
    "SELECT * FROM books WHERE id = ?",
    [id]
  );

  if (rows.length === 0) {
    throw new Error("Book not found");
  }

  return rows[0];
};

exports.updateBook = async (id, data) => {
  const { title, author, category } = data;

  const [result] = await pool.query(
    `UPDATE books
     SET title = ?, author = ?, category = ?
     WHERE id = ?`,
    [title, author, category, id]
  );

  if (result.affectedRows === 0) {
    throw new Error("Book not found");
  }

  return true;
};

exports.deleteBook = async (id) => {
  const [result] = await pool.query(
    "DELETE FROM books WHERE id = ?",
    [id]
  );

  if (result.affectedRows === 0) {
    throw new Error("Book not found");
  }

  return true;
};
