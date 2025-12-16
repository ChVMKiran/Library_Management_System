const pool = require("../config/db");

exports.borrowBook = async (data) => {
  const { member_id, book_id } = data;

  if (!member_id || !book_id) {
    throw new Error("member_id and book_id are required");
  }

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const [members] = await conn.query(
      "SELECT * FROM members WHERE id = ?",
      [member_id]
    );

    if (members.length === 0) {
      throw new Error("Member does not exist");
    }

    const member = members[0];

    if (member.status !== "active") {
      throw new Error("Member is suspended");
    }

    const [unpaidFines] = await conn.query(
      "SELECT id FROM fines WHERE member_id = ? AND paid_at IS NULL",
      [member_id]
    );

    if (unpaidFines.length > 0) {
      throw new Error("Member has unpaid fines");
    }

    const [activeBorrows] = await conn.query(
      "SELECT COUNT(*) AS count FROM transactions WHERE member_id = ? AND status = 'active'",
      [member_id]
    );

    if (activeBorrows[0].count >= 3) {
      throw new Error("Borrow limit exceeded (max 3 books)");
    }

    const [books] = await conn.query(
      "SELECT * FROM books WHERE id = ? FOR UPDATE",
      [book_id]
    );

    if (books.length === 0) {
      throw new Error("Book does not exist");
    }

    const book = books[0];

    if (book.available_copies <= 0) {
      throw new Error("Book is not available");
    }

    const borrowedAt = new Date();
    const dueDate = new Date(borrowedAt);
    dueDate.setDate(dueDate.getDate() + 14);

    const [transactionResult] = await conn.query(
      `INSERT INTO transactions
       (book_id, member_id, borrowed_at, due_date, status)
       VALUES (?, ?, ?, ?, 'active')`,
      [book_id, member_id, borrowedAt, dueDate]
    );

    await conn.query(
      "UPDATE books SET available_copies = available_copies - 1 WHERE id = ? AND available_copies > 0",
      [book_id]
    );

    await conn.commit();

    return {
      message: "Book borrowed successfully",
      transaction_id: transactionResult.insertId,
      due_date: dueDate
    };

  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

exports.returnBook = async (transactionId) => {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const [transactions] = await conn.query(
      "SELECT * FROM transactions WHERE id = ? FOR UPDATE",
      [transactionId]
    );

    if (transactions.length === 0) {
      throw new Error("Transaction not found");
    }

    const transaction = transactions[0];

    if (transaction.status !== "active") {
      throw new Error("Book already returned");
    }

    const now = new Date();
    const dueDate = new Date(transaction.due_date);

    let status = "returned";
    let fineAmount = 0;

    if (now > dueDate) {
      status = "overdue";

      const diffTime = now - dueDate;
      const overdueDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      fineAmount = overdueDays * 0.5;
    }

    await conn.query(
      `UPDATE transactions
       SET returned_at = ?, status = ?
       WHERE id = ?`,
      [now, status, transactionId]
    );

    await conn.query(
      "UPDATE books SET available_copies = available_copies + 1 WHERE id = ?",
      [transaction.book_id]
    );

    if (fineAmount > 0) {
      await conn.query(
        `INSERT INTO fines (member_id, transaction_id, amount)
         VALUES (?, ?, ?)`,
        [transaction.member_id, transactionId, fineAmount]
      );
    }

    await suspendMemberIfNeeded(conn, transaction.member_id);

    await conn.commit();

    return {
      message: "Book returned successfully",
      status,
      fine: fineAmount
    };

  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

exports.getOverdueTransactions = async () => {
  const conn = await pool.getConnection();

  try {
    const [rows] = await conn.query(
      `
      SELECT
        t.id AS transaction_id,
        m.id AS member_id,
        m.name AS member_name,
        b.title AS book_title,
        t.borrowed_at,
        t.due_date,
        DATEDIFF(NOW(), t.due_date) AS overdue_days
      FROM transactions t
      JOIN members m ON t.member_id = m.id
      JOIN books b ON t.book_id = b.id
      WHERE t.status = 'active'
        AND t.due_date < NOW()
      `
    );

    const memberIds = [...new Set(rows.map(r => r.member_id))];

    for (const memberId of memberIds) {
      await suspendMemberIfNeeded(conn, memberId);
    }

    return rows;
  } finally {
    conn.release();
  }
};


const suspendMemberIfNeeded = async (conn, memberId) => {
  const [rows] = await conn.query(
    `
    SELECT COUNT(*) AS overdue_count
    FROM transactions
    WHERE member_id = ?
      AND status = 'active'
      AND due_date < NOW()
    `,
    [memberId]
  );

  if (rows[0].overdue_count >= 3) {
    await conn.query(
      "UPDATE members SET status = 'suspended' WHERE id = ? AND status != 'suspended'",
      [memberId]
    );

  }
};
