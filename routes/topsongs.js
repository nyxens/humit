const express = require("express");
const router  = express.Router();

// Last.fm API key — add LASTFM_KEY to your .env
const LASTFM_KEY  = process.env.LASTFM_KEY;
const LASTFM_BASE = "https://ws.audioscrobbler.com/2.0/";

// ISO2 → Last.fm country name (Last.fm uses full English country names)
const ISO2_TO_LASTFM = {
  AF:"Afghanistan", AL:"Albania", DZ:"Algeria", AO:"Angola", AR:"Argentina",
  AM:"Armenia", AU:"Australia", AT:"Austria", AZ:"Azerbaijan", BH:"Bahrain",
  BD:"Bangladesh", BY:"Belarus", BE:"Belgium", BO:"Bolivia", BA:"Bosnia and Herzegovina",
  BR:"Brazil", BG:"Bulgaria", KH:"Cambodia", CM:"Cameroon", CA:"Canada",
  CL:"Chile", CN:"China", CO:"Colombia", CR:"Costa Rica", HR:"Croatia",
  CZ:"Czech Republic", DK:"Denmark", DO:"Dominican Republic", EC:"Ecuador",
  EG:"Egypt", SV:"El Salvador", EE:"Estonia", ET:"Ethiopia", FI:"Finland",
  FR:"France", GE:"Georgia", DE:"Germany", GH:"Ghana", GR:"Greece",
  GT:"Guatemala", HN:"Honduras", HK:"Hong Kong", HU:"Hungary", IS:"Iceland",
  IN:"India", ID:"Indonesia", IE:"Ireland", IL:"Israel", IT:"Italy",
  JM:"Jamaica", JP:"Japan", JO:"Jordan", KZ:"Kazakhstan", KE:"Kenya",
  KR:"Korea, Republic of", KW:"Kuwait", LV:"Latvia", LB:"Lebanon",
  LT:"Lithuania", LU:"Luxembourg", MY:"Malaysia", MX:"Mexico",
  MD:"Moldova, Republic of", MN:"Mongolia", MA:"Morocco", NL:"Netherlands",
  NZ:"New Zealand", NI:"Nicaragua", NG:"Nigeria", NO:"Norway",
  PK:"Pakistan", PA:"Panama", PY:"Paraguay", PE:"Peru", PH:"Philippines",
  PL:"Poland", PT:"Portugal", QA:"Qatar", RO:"Romania", RU:"Russia",
  SA:"Saudi Arabia", SN:"Senegal", RS:"Serbia", SG:"Singapore",
  SK:"Slovakia", SI:"Slovenia", ZA:"South Africa", ES:"Spain",
  SE:"Sweden", CH:"Switzerland", TW:"Taiwan", TH:"Thailand", TN:"Tunisia",
  TR:"Turkey", UA:"Ukraine", AE:"United Arab Emirates",
  GB:"United Kingdom", US:"United States", UY:"Uruguay", VE:"Venezuela",
  VN:"Vietnam", ZW:"Zimbabwe",
};

// GET /api/topsongs?countryCode=GB&limit=10
router.get("/", async (req, res) => {
  const { countryCode = "US", limit = 10 } = req.query;
  const iso2        = countryCode.toUpperCase();
  const countryName = ISO2_TO_LASTFM[iso2];

  if (!LASTFM_KEY) {
    return res.status(500).json({ error: "LASTFM_KEY not set in .env — get a free key at https://www.last.fm/api" });
  }

  try {
    let tracks      = [];
    let isFallback  = false;
    let usedCountry = countryName;

    // ── Step 1: geo.getTopTracks for this specific country ──
    if (countryName) {
      const url = `${LASTFM_BASE}?method=geo.gettoptracks&country=${encodeURIComponent(countryName)}&limit=${limit}&api_key=${LASTFM_KEY}&format=json`;
      const r = await fetch(url);
      if (r.ok) {
        const d = await r.json();
        tracks = d.tracks?.track || [];
      }
    }

    // ── Step 2: global fallback ──
    if (!tracks.length) {
      isFallback  = true;
      usedCountry = "Global";
      const url   = `${LASTFM_BASE}?method=chart.gettoptracks&limit=${limit}&api_key=${LASTFM_KEY}&format=json`;
      const r     = await fetch(url);
      if (r.ok) {
        const d   = await r.json();
        tracks    = d.tracks?.track || [];
      }
    }

    if (!tracks.length) return res.json({ songs: [], country: iso2, fallback: false });

    // ── Step 3: enrich with track.getInfo (artwork, tags, duration) ──
    const enriched = await Promise.all(tracks.map(async (track, i) => {
      const name   = track.name || "";
      const artist = typeof track.artist === "string" ? track.artist : (track.artist?.name || "");

      let artHD    = null;
      let duration = track.duration ? parseInt(track.duration) : null;
      let genre    = null;

      try {
        const infoUrl = `${LASTFM_BASE}?method=track.getInfo&track=${encodeURIComponent(name)}&artist=${encodeURIComponent(artist)}&api_key=${LASTFM_KEY}&format=json`;
        const ir = await fetch(infoUrl);
        if (ir.ok) {
          const id = await ir.json();
          const t  = id.track;
          if (t) {
            const imgs = t.album?.image || [];
            artHD  = imgs.find(img => img.size === "extralarge")?.["#text"]
                  || imgs.find(img => img.size === "large")?.["#text"]
                  || null;
            if (artHD === "") artHD = null;
            if (!duration && t.duration) duration = Math.round(parseInt(t.duration) / 1000);
            genre = t.toptags?.tag?.[0]?.name || null;
          }
        }
      } catch { /* skip enrichment, use base */ }

      // fallback art from the track object itself (geo.gettoptracks includes images)
      if (!artHD) {
        const imgs = track.image || [];
        const raw  = imgs.find(img => img.size === "extralarge")?.["#text"]
                  || imgs.find(img => img.size === "large")?.["#text"]
                  || null;
        if (raw && raw !== "") artHD = raw;
      }

      return {
        rank:      i + 1,
        name,
        artist,
        artHD,
        duration,
        listeners: track.listeners ? parseInt(track.listeners) : null,
        genre,
        url:       track.url || null,
      };
    }));

    res.json({
      songs:           enriched,
      country:         iso2,
      countryName:     usedCountry,
      fallback:        isFallback,
      requestedCountry: iso2,
    });

  } catch (err) {
    console.error("topsongs error:", err);
    res.status(500).json({ error: "Failed to fetch chart data" });
  }
});

module.exports = router;