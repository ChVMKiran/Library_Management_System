

CREATE DATABASE IF NOT EXISTS library_db;
USE library_db;

CREATE TABLE books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  isbn VARCHAR(20) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  status ENUM('available', 'borrowed', 'reserved', 'maintenance') DEFAULT 'available',
  total_copies INT NOT NULL CHECK (total_copies >= 0),
  available_copies INT NOT NULL CHECK (available_copies >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  membership_number VARCHAR(50) NOT NULL UNIQUE,
  status ENUM('active', 'suspended') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  book_id INT NOT NULL,
  member_id INT NOT NULL,
  borrowed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  due_date TIMESTAMP NOT NULL,
  returned_at TIMESTAMP NULL,
  status ENUM('active', 'returned', 'overdue') DEFAULT 'active',
  CONSTRAINT fk_transactions_book
    FOREIGN KEY (book_id) REFERENCES books(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_transactions_member
    FOREIGN KEY (member_id) REFERENCES members(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE fines (
  id INT AUTO_INCREMENT PRIMARY KEY,
  member_id INT NOT NULL,
  transaction_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
  paid_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_fines_member
    FOREIGN KEY (member_id) REFERENCES members(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_fines_transaction
    FOREIGN KEY (transaction_id) REFERENCES transactions(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX idx_transactions_member_status
  ON transactions(member_id, status);

CREATE INDEX idx_transactions_due_date
  ON transactions(due_date);

CREATE INDEX idx_fines_member_paid
  ON fines(member_id, paid_at);
