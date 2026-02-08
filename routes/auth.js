const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const router = express.Router();
//navigate through url /signup page
router.post("/signup", async (req, res) => {
  const{ username, email, password } = req.body;
  try{
    //save hashed password for safety with salt seed
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      _id: "user_" + Date.now(),
      username,
      email,
      passwordHash,
      createdAt: new Date()
    });
    req.session.userId = user._id;
    res.redirect("/login");
    //GOTO login after signup
  }catch(err){
    console.error("Signup error:", err);
    res.send("Signup failed");
  }
});
//login form navigate from navbar url or rediret from signup
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("Login attempt:", email);  //debugging and verification 1
  const user = await User.findOne({ email });

  console.log("User found:", !!user);     //debugging and verification 2 btw !!can do falsy check conversion
  if(!user) 
    return res.send("Invalid credentials");
  const match = await bcrypt.compare(password,user.passwordHash);//compare password from db using compare method 
  console.log("Password match:",match);    //debugging and verification 3
  if(!match) 
    return res.send("Invalid credentials");
  req.session.userId = user._id;
  console.log("Session userId AFTER set:", req.session.userId);    //debugging and verification 4
  res.redirect("/profile");
  //goto profile after login
});
// can do /status or /debugsession to check login session
router.get("/status", (req, res) => {
  res.json({
    loggedIn: !!req.session.userId
  });
});
// as it says
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});
module.exports = router;