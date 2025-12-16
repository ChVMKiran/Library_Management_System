const transactionService = require("../services/transaction.service");

exports.borrowBook = async (req, res) => {
  try {
    const result = await transactionService.borrowBook(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const result = await transactionService.returnBook(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getOverdueTransactions = async (req, res) => {
  try {
    const transactions = await transactionService.getOverdueTransactions();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
