const express = require("express");
const RecognitionHistory = require("../models/RecognitionHistory");
const requireAuth = require("../middleware/requireAuth");
const router = express.Router();

// get current user's recognition history, newest first
router.get("/me", requireAuth, async (req, res) => {
  try {
    const history = await RecognitionHistory.find({ userId: req.session.userId })
      .sort({ startedAt: -1 })
      .limit(50)
      .lean();
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: "Failed to load history" });
  }
});

// delete a single history entry
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    await RecognitionHistory.deleteOne({ _id: req.params.id, userId: req.session.userId });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete entry" });
  }
});

// clear all history for user
router.delete("/me/all", requireAuth, async (req, res) => {
  try {
    await RecognitionHistory.deleteMany({ userId: req.session.userId });
    res.json({ cleared: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear history" });
  }
});

module.exports = router;