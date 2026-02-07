const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const router = express.Router();

router.post("/signup", async (req, res) => {
  console.log("Signup request body:", req.body);
  const{ username, email, password } = req.body;
  try{
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      _id: "user_" + Date.now(),
      username,
      email,
      passwordHash,
      createdAt: new Date()
    });
    console.log("User saved to DB:", user);
    req.session.userId = user._id;
    res.redirect("/login");
  }catch(err){
    console.error("Signup error:", err);
    res.send("Signup failed");
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt:", email);
  const user = await User.findOne({ email });
  console.log("User found:", !!user);
  if(!user) 
    return res.send("Invalid credentials");
  const match = await bcrypt.compare(password,user.passwordHash);
  console.log("Password match:",match);
  if(!match) 
    return res.send("Invalid credentials");
  req.session.userId = user._id;
  console.log("Session userId AFTER set:", req.session.userId);
  res.redirect("/profile");
});
router.get("/status", (req, res) => {
  res.json({
    loggedIn: !!req.session.userId
  });
});
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});
module.exports = router;