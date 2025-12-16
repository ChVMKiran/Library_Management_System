const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transaction.controller");

router.post("/borrow", transactionController.borrowBook);
router.post("/:id/return", transactionController.returnBook);
router.get("/overdue", transactionController.getOverdueTransactions);


module.exports = router;
