const pool = require("../config/db");

exports.payFine = async (fineId) => {
  const [fines] = await pool.query(
    "SELECT * FROM fines WHERE id = ?",
    [fineId]
  );

  if (fines.length === 0) {
    throw new Error("Fine not found");
  }

  const fine = fines[0];

  if (fine.paid_at !== null) {
    throw new Error("Fine already paid");
  }

  await pool.query(
    "UPDATE fines SET paid_at = NOW() WHERE id = ?",
    [fineId]
  );

  return {
    message: "Fine paid successfully",
    fine_id: fineId,
    amount: fine.amount
  };
};
