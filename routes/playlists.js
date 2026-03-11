const express = require("express");
const Playlist = require("../models/Playlist");
const requireAuth = require("../middleware/requireAuth");
const router = express.Router();
// similar to likes just diiferent error status
//create playlists 
router.post("/", requireAuth, async (req, res) => {
  const userId = req.session.userId;
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Playlist name required" });
  }
  try {
    const playlist = await Playlist.create({
  		_id: "pl_" + Date.now(),
  		userId,
  		name
		});
    res.json(playlist);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Playlist already exists" });
    }
    res.status(500).json({ error: "Failed to create playlist" });
  }
});
// /me is taken by likes so use me1 to get list of playlists 
router.get("/me1", requireAuth, async (req, res) => {
  const userId = req.session.userId;
  const playlists = await Playlist.find({ userId }).lean();
  res.json(playlists);
});
//add songs to playlist 
router.post("/:playlistId/add/:songId", requireAuth, async (req, res) => {
  const { playlistId, songId } = req.params;
  const userId = req.session.userId;
  const playlist = await Playlist.findOne({ _id: playlistId, userId });
  if (!playlist) {
    return res.status(404).json({ error: "Playlist not found" });
  }
  if (!playlist.songIds.includes(songId)) {
    playlist.songIds.unshift(songId);
    await playlist.save();
  }
  res.json({ added: true });
});
//remove songs from playlist
router.delete("/:playlistId/remove/:songId", requireAuth, async (req, res) => {
  const { playlistId, songId } = req.params;
  const userId = req.session.userId;
  const playlist = await Playlist.findOne({ _id: playlistId, userId });
  if (!playlist) {
    return res.status(404).json({ error: "Playlist not found" });
  }
  playlist.songIds = playlist.songIds.filter(id => id !== songId);
  await playlist.save();
  res.json({ removed: true });
});
//delete playlists except fav
// delete entire playlist — Favourites is protected
router.delete("/:playlistId", requireAuth, async (req, res) => {
  const { playlistId } = req.params;
  const userId = req.session.userId;

  // prevent deleting the auto-created Favourites
  if (playlistId === "pl_fav_" + userId)
    return res.status(403).json({ error: "Cannot delete Favourites" });

  const result = await Playlist.deleteOne({ _id: playlistId, userId });
  if (result.deletedCount === 0)
    return res.status(404).json({ error: "Playlist not found" });

  res.json({ deleted: true });
});
module.exports = router;