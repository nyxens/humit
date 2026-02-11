const express = require("express");
const User = require("../models/User");
const requireAuth = require("../middleware/requireAuth");
const router = express.Router();

router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId)
      .select("username about");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
router.put("/me", requireAuth, async (req, res) => {
  try {
    const { about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.session.userId,
      { about },
      { new: true }
    ).select("username about");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});
module.exports = router;