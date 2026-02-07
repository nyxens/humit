const mongoose = require("mongoose");
const LikeSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  songId: {
    type: String,
    required: true,
    index: true
  }
}, {
  timestamps: true,
  collection: "likes"
});
LikeSchema.index({ userId: 1, songId: 1 }, { unique: true });
module.exports = mongoose.model("Like", LikeSchema);