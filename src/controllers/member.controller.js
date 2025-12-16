const memberService = require("../services/member.service");

exports.createMember = async (req, res) => {
  try {
    const member = await memberService.createMember(req.body);
    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllMembers = async (req, res) => {
    try {
        const members = await memberService.getAllMembers();
        res.status(200).json(members);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getMemberById = async (req, res) => {
    try {
        const member = await memberService.getMemberById(req.params.id);
        res.status(200).json(member);
    } catch (err) {
        res.status(500).json({ error: err.message})
    }
}

exports.updateMember = async (req, res) => {
    try {
        const member = await memberService.updateMember(req.params.id, req.body);
        res.json({ message: "Updated Successfully" });
    } catch (err) {
        res.status({ message: err.message })
    }
}

exports.deleteMember = async (req, res) => {
  try {
    await memberService.deleteMember(req.params.id);
    res.json({ message: "Member deleted successfully" });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.getBorrowedBooks = async (req, res) => {
  try {
    const books = await memberService.getBorrowedBooks(req.params.id);
    res.json(books);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
