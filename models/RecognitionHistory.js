const mongoose = require("mongoose");
const RecognitionHistorySchema = new mongoose.Schema({
  _id:        { type: String },
  userId:     { type: String, required: true, index: true },
  status:     { type: String, enum: ["matched", "no_match", "failed"], required: true },
  matchedSongId:    { type: String, default: null },
  matchedTitle:     { type: String, default: null },
  matchedArtist:    { type: String, default: null },
  confidence:       { type: Number, default: null },
  startedAt:        { type: Date, required: true },
  endedAt:          { type: Date, required: true }
}, {
  collection: "recognition_history",
  _id: false
});
module.exports = mongoose.model("RecognitionHistory", RecognitionHistorySchema);