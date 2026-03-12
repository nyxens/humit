const express = require("express");
const multer = require("multer");
//takes file from frontend and save it in upload folder temproraily
const fs = require("fs");//file system
const ffmpegPath = require("ffmpeg-static");//ffmpeg main
const ffmpeg = require("fluent-ffmpeg"); //wrap ffmpeg for node
ffmpeg.setFfmpegPath(ffmpegPath);

const wav = require("node-wav"); //handle wav files
const { fft, util: fftUtil } = require("fft-js"); //fast fourier trans (signal process)
const Fingerprint = require("../models/Fingerprint");
const Fsong = require("../models/Fsongs");

const router = express.Router();
const upload = multer({ dest: "uploads/" });
const RecognitionHistory = require("../models/RecognitionHistory");

function generateHashes(samples) {
  const frameSize = 4096;//per frame size used for hash
  const hopSize = 2048;//shift
  const hashes = [];
  for (let i = 0; i < samples.length - frameSize; i += hopSize) {
    const frame = samples.slice(i, i + frameSize);
    const phasors = fft(frame);//time domain to freq spectrum
    const magnitudes = fftUtil.fftMag(phasors);
    const peaks = magnitudes
      .map((mag, idx) => ({ freq: idx, mag }))
      .sort((a, b) => b.mag - a.mag)
      .slice(0, 5);
    for (let j = 0; j < peaks.length - 1; j++) {
      const hash = `${peaks[j].freq}|${peaks[j + 1].freq}`;//the freq change b/w 2 peaks is our hash
      hashes.push(hash);
    }
  }
  return hashes;
}
async function convertToWav(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .audioChannels(1)//mono
      .audioFrequency(44100)//standard
      .format("wav")//wav to decode later
      .save(outputPath)//save to outpuypath
      .on("end", resolve)
      .on("error", reject);
  });
}
router.use((req, res, next) => {
  req.startedAt = new Date();
  next();
});
router.post("/", upload.single("audio"), async (req, res) => {
  try {
    const inputPath = req.file.path;
    const wavPath = inputPath + ".wav"; //original + wav
    await convertToWav(inputPath, wavPath);
    const buffer = fs.readFileSync(wavPath);
    const result = wav.decode(buffer); // wav to raw data
    const samples = result.channelData[0]; //32 bit array for timedomain audio
    const hashes = generateHashes(samples);
    const matchCounts = {};
    for(const hash of hashes){
      const matches = await Fingerprint.find({ hash }).limit(50);
      matches.forEach(m => {
        matchCounts[m.songId] = (matchCounts[m.songId] || 0) + 1;//increment for each matched pair 
      });
    }
    // cleanup temp files
    fs.unlinkSync(inputPath);
    fs.unlinkSync(wavPath);
    const endedAt = new Date();
    const userId = req.session?.userId || null;
    if (Object.keys(matchCounts).length === 0) {
      // save no_match to history
      if (userId) {
        await RecognitionHistory.create({
          _id: "recog_" + Date.now(),
          userId,
          status: "no_match",
          startedAt: req.startedAt,
          endedAt
        });
      }
      return res.json({ match: null });
    }
    const bestSongId = Object.keys(matchCounts)
      .sort((a, b) => matchCounts[b] - matchCounts[a])[0];
    const totalHashes = hashes.length;
    const confidence  = Math.min(matchCounts[bestSongId] / Math.max(totalHashes * 0.1, 1), 1);
    const song = await Fsong.findById(bestSongId);
    // save matched result to history
    if (userId) {
      await RecognitionHistory.create({
        _id: "recog_" + Date.now(),
        userId,
        status: "matched",
        matchedSongId:  song?._id   || null,
        matchedTitle:   song?.title  || null,
        matchedArtist:  song?.artist || null,
        confidence:     parseFloat(confidence.toFixed(2)),
        startedAt: req.startedAt,
        endedAt
      });
    }
    res.json({ match: song, score: matchCounts[bestSongId], confidence });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Recognition failed" });
  }
});
module.exports = router;