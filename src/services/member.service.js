const pool = require("../config/db");

exports.createMember = async (data) => {
  const { name, email, membership_number } = data;

  if (!name || !email || !membership_number) {
    throw new Error("Name, email, and membership_number are required");
  }

  const [result] = await pool.query(
    `INSERT INTO members (name, email, membership_number)
     VALUES (?, ?, ?)`,
    [name, email, membership_number]
  );

  return {
    id: result.insertId,
    name,
    email,
    membership_number,
    status: "active"
  };
};

exports.getAllMembers = async () => {
  const [rows] = await pool.query("SELECT * FROM members");
  return rows;
};

exports.getMemberById = async (id) => {
    const [rows] = await pool.query(
        "SELECT * FROM members WHERE id = ?",
        [id]
    );

    if (rows.length === 0) {
        throw new Error("Member not found");
    }

    return rows[0];
}

exports.updateMember = async (id, data) => {
    const { name, email } = data;
    const [result] = await pool.query(
        `UPDATE members
        SET name = ?, email = ?
        WHERE id = ?`,
        [name, email, id]
    );
    if(result.affectedRows === 0) {
        throw new Error("Member not found");
    }
    return true;
}

exports.deleteMember = async (id) => {
  const [result] = await pool.query(
    "DELETE FROM members WHERE id = ?",
    [id]
  );

  if (result.affectedRows === 0) {
    throw new Error("Member not found");
  }

  return true;
};

exports.getBorrowedBooks = async (memberId) => {
  const [members] = await pool.query(
    "SELECT id FROM members WHERE id = ?",
    [memberId]
  );

  if (members.length === 0) {
    throw new Error("Member not found");
  }

  const [rows] = await pool.query(
    `
    SELECT 
      t.id AS transaction_id,
      b.id AS book_id,
      b.title,
      b.author,
      b.category,
      t.borrowed_at,
      t.due_date
    FROM transactions t
    JOIN books b ON t.book_id = b.id
    WHERE t.member_id = ?
      AND t.status = 'active'
    `,
    [memberId]
  );

  return rows;
};
