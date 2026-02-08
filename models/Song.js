const mongoose = require("mongoose");
//same schema as mdb document | collection
const SongSchema = new mongoose.Schema({
  _id: {
    type: String
  },
  source: {
    type: String,
    required: true,
    index: true
  },
  sourceId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  album: String,
  genre: String,
  artwork: {
    small: String,
    medium: String,
    large: String
  },
  previewUrl: String,
  trackViewUrl: String,
  rank: Number,
  region: {
    type: String,
    default: "IN"
  },
  durationMs: Number,
  releaseDate: Date
}, {
  timestamps: true,
  collection: "songs"
});
SongSchema.index({ source: 1, sourceId: 1 }, { unique: true });
module.exports = mongoose.model("Song", SongSchema);