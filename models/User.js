const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  about: {
    type: String,
    default: ""
  },
  theme: {
    type: String,
    default: "dark"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: "users",
  _id: false
});
module.exports = mongoose.model("User", UserSchema);