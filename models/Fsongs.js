const mongoose = require("mongoose");
const fsongSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  filePath: { type: String, required: true }
});
module.exports = mongoose.model("Fsongs", fsongSchema);