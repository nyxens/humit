require("dotenv").config();
const mongoose = require("mongoose");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const fs = require("fs");
const wav = require("node-wav");
const { fft, util: fftUtil } = require("fft-js");
const Fsong = require("../models/Fsongs");
const Fingerprint = require("../models/Fingerprint");
mongoose.connect(process.env.MONGO_URI);
ffmpeg.setFfmpegPath(ffmpegPath);
async function convertToWav(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .audioChannels(1)
      .audioFrequency(44100)
      .format("wav")
      .save(outputPath)
      .on("end", resolve)
      .on("error", reject);
  });
}
function generateHashes(samples, songId) {
  const frameSize = 4096;
  const hopSize = 2048;
  const hashes = [];
  for (let i = 0; i < samples.length - frameSize; i += hopSize) {
    const frame = samples.slice(i, i + frameSize);
    const phasors = fft(frame);
    const magnitudes = fftUtil.fftMag(phasors);
    const peaks = magnitudes
      .map((mag, idx) => ({ freq: idx, mag }))
      .sort((a, b) => b.mag - a.mag)
      .slice(0, 5);
    for (let j = 0; j < peaks.length - 1; j++) {
      const hash = `${peaks[j].freq}|${peaks[j + 1].freq}`;
      hashes.push({
        songId,
        hash,
        offset: i
      });
    }
  }
  return hashes;
}
async function processSong(song) {
  console.log("Processing:", song.title);
  const wavPath = song.filePath.replace(".mp3", ".wav");
  await convertToWav(song.filePath, wavPath);
  const buffer = fs.readFileSync(wavPath);
  const result = wav.decode(buffer);
  const samples = result.channelData[0];
  const hashes = generateHashes(samples, song._id);
  await Fingerprint.insertMany(hashes);
  fs.unlinkSync(wavPath);
  console.log(`Stored ${hashes.length} hashes`);
}
async function main() {
  await Fingerprint.deleteMany();
  const songs = await Fsong.find();
  for (const song of songs) {
    await processSong(song);
  }
  console.log("All songs fingerprinted.");
  process.exit();
}
main();