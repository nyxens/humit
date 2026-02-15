const mongoose = require("mongoose");
const fingerprintSchema = new mongoose.Schema({
  songId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Fsong",
    required: true
  },
  hash: { type: String, required: true },
  offset: { type: Number, required: true }
});
fingerprintSchema.index({ hash: 1 });
module.exports = mongoose.model("Fingerprint", fingerprintSchema);