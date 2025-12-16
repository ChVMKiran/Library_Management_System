const express = require("express");
const router = express.Router();
const fineController = require("../controllers/fine.controller.js");

router.post("/:id/pay", fineController.payFine);

module.exports = router;
