require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const app = express();
app.set("view engine", "ejs");
app.set("views", "views");

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
app.use("/api/user", require("./routes/user"));
app.use("/api/recognize",require("./routes/recognize"));
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
app.get("/error", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "error.html"));
});
//error
app.use((req, res) => {
  res.status(404).render("error", {
    status: 404,
    message: "Page not found"
  });
});
app.use((err, req, res, next) => {
  console.error(err);

  const status = err.status || 500;

  res.status(status).render("error", {
    status: status,
    message: err.message || "Something went wrong"
  });
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