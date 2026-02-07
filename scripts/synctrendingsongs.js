require("dotenv").config();
const mongoose = require("mongoose");
const Song = require("../models/Song");

mongoose.connect(process.env.MONGO_URI);

function extractSourceId(item) {
  const idUrl = item?.id?.label || "";
  const match = idUrl.match(/i=(\d+)/);
  return match ? match[1] : null;
}

(async function syncTrending() {
  try {
    const res = await fetch("https://itunes.apple.com/in/rss/topsongs/limit=90/json");
    const data = await res.json();

    const entries = data.feed.entry;

    for (let i = 0; i < entries.length; i++) {
      const item = entries[i];
      const sourceId = extractSourceId(item);
      if (!sourceId) continue;

      const songDoc = {
        _id: `song_itunes_${sourceId}`,
        source: "itunes",
        sourceId,
        title: item["im:name"].label,
        artist: item["im:artist"].label,
        album: item["im:collection"]?.["im:name"]?.label,
        genre: item.category?.attributes?.label,
        artwork: {
          small: item["im:image"]?.[0]?.label,
          medium: item["im:image"]?.[1]?.label,
          large: item["im:image"]?.[2]?.label
        },
        rank: i + 1,
        region: "IN"
      };

      await Song.updateOne(
        { source: "itunes", sourceId },
        { $set: songDoc },
        { upsert: true }
      );
    }

    console.log("Trending songs synced successfully");
  } catch (err) {
    console.error("Failed to sync trending songs", err);
  } finally {
    process.exit();
  }
})();