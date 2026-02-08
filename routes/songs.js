const express = require("express");
const Song = require("../models/Song");
const router = express.Router();

//fetch /trending page 
router.get("/trending", async (req, res) => {
  const songs = await Song.find({ source: "itunes", region: "IN" })
    .sort({ rank: 1 })
    .limit(90)
    .lean();
  res.json(songs);
});
router.post("/by-ids", async (req, res) => {
  const { songIds } = req.body;
  if (!Array.isArray(songIds)) {
    return res.status(400).json({ error: "songIds must be an array" });
  }
  const songs = await Song.find({ _id: { $in: songIds } }).lean();
  res.json(songs);
});
module.exports = router;