const express = require("express");
const Like = require("../models/Like");
const requireAuth = require("../middleware/requireAuth");
const router = express.Router();
//liking functionality for db
//requireauth checks for login before validating
router.post("/:songId", requireAuth, async (req, res) => {
  const { songId } = req.params;
  const userId = req.session.userId;
  try {
    await Like.create({ userId, songId });
    res.json({ liked: true });
  } catch (err) {
    if (err.code === 11000) {
      return res.json({ liked: true });
    }
    res.status(500).json({ error: "Failed to like song" });
  }
});
//unlike from dm
router.delete("/:songId", requireAuth, async (req, res) => {
  const { songId } = req.params;
  const userId = req.session.userId;
  await Like.deleteOne({ userId, songId });
  res.json({ liked: false });
});
//liked songs get from db
router.get("/me", requireAuth, async (req, res) => {
  const userId = req.session.userId;
  const likes = await Like.find({ userId }).lean();
  const songIds = likes.map(l => l.songId);
  res.json(songIds);
});
module.exports = router;