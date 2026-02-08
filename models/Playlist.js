const mongoose = require("mongoose");
//same type collection from mongoDB
const PlaylistSchema = new mongoose.Schema({
  _id: {
    type: String
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  songIds: {
    type: [String],
    default: []
  }
}, {
  timestamps: true,
  collection: "playlists",
  _id: false
});
//primary keys??
PlaylistSchema.index({ userId: 1, name: 1 }, { unique: true });
module.exports = mongoose.model("Playlist", PlaylistSchema);