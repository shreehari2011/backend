const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

// GET current logged in user
router.get("/me", protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;