const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Playlist = require("../models/Playlist");
const router = express.Router();

// helper — reads userId from session OR Bearer token (for API testing)
function getUserId(req) {
  if (req.session.userId) return req.session.userId;

  const auth = req.headers["authorization"] || "";
  if (auth.startsWith("Bearer ") && process.env.API_TEST_SECRET) {
    const token = auth.slice(7);
    const colonIdx = token.indexOf(":");
    const secret = token.slice(0, colonIdx);
    const userId = token.slice(colonIdx + 1);
    if (secret === process.env.API_TEST_SECRET && userId) return userId;
  }
  return null;
}

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      _id: "user_" + Date.now(),
      username,
      email,
      passwordHash,
      createdAt: new Date()
    });
    await Playlist.create({
      _id: "pl_fav_" + user._id,
      userId: user._id,
      name: "Favourites"
    });
    req.session.userId = user._id;

    // API clients get JSON instead of redirect
    if (req.headers["authorization"]) {
      return res.json({ success: true, userId: user._id, message: "Signup successful" });
    }
    res.redirect("/login");
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Signup failed", detail: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt:", email);
  const user = await User.findOne({ email });
  console.log("User found:", !!user);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.passwordHash);
  console.log("Password match:", match);
  if (!match) return res.status(401).json({ error: "Invalid credentials" });

  req.session.userId = user._id;
  console.log("Session userId set:", req.session.userId);

  // API clients get JSON with userId so they can use Bearer token next
  if (req.headers["authorization"] || req.headers["content-type"]?.includes("application/json")) {
    return res.json({ success: true, userId: user._id, message: "Login successful — use this userId in your Bearer token" });
  }
  res.redirect("/profile");
});

// status — works with session OR Bearer token
router.get("/status", (req, res) => {
  const userId = getUserId(req);
  res.json({ loggedIn: !!userId, userId: userId || null });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

module.exports = router;