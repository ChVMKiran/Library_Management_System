const fineService = require("../services/fine.service.js");

exports.payFine = async (req, res) => {
  try {
    const result = await fineService.payFine(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
