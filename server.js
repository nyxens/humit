require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//expresssession important
app.use(session({
  secret: "idk12345lol",
  resave: false,
  saveUninitialized: false
}));

//db connected from .env file url
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected DB Humit"))
  .catch(err => console.log(err));

  //api call checklist 
app.use("/auth", require("./routes/auth"));
app.use("/api/songs", require("./routes/songs"));
app.use("/api/likes", require("./routes/likes"));
app.use("/api/playlists", require("./routes/playlists"));

//navigation
const path = require("path");
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "home.html"));
});
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "signup.html"));
});
app.get("/profile", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "profile.html"));
});
app.get("/trending", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "trending.html"));
});

//check your session info 
app.get("/debugsession", (req, res) => {
  res.json({
    session: req.session,
    loggedIn: !!req.session.userId
  });
});
//port
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});