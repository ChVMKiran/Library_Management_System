const express = require("express");
const router = express.Router();
const memberController = require("../controllers/member.controller");

router.post("/", memberController.createMember);
router.get("/", memberController.getAllMembers);
router.get("/:id", memberController.getMemberById);
router.put("/:id", memberController.updateMember);
router.delete("/:id", memberController.deleteMember);
router.get("/:id/borrowed", memberController.getBorrowedBooks);


module.exports = router;
