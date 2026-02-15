require("dotenv").config();
const mongoose = require("mongoose");
const Fsong = require("../models/Fsongs");
mongoose.connect(process.env.MONGO_URI);

async function seed() {
  try {
    await Fsong.deleteMany();
    await Fsong.insertMany([
      {
        title: "Bag Boy",
        artist: "BrxkenBxy",
        filePath: "./songs/BagBoy.mp3"
      },
      {
        title: "Just a Boy",
        artist: "DrINsaNE",
        filePath: "./songs/JustaBoy.mp3"
      },
      {
        title: "Living Life, In The Night",
        artist: "Cheriimoya",
        filePath: "./songs/LivingLife,InTheNight.mp3"
      }
    ]);
    console.log("Fsongs seeded successfully");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
seed();