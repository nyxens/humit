const express = require("express");
const router  = express.Router();

// GET /api/concerts?countryCode=GB&size=10
router.get("/", async (req, res) => {
  const { countryCode = "US", size = 8 } = req.query;
  const apiKey = process.env.TM_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Ticketmaster API key not configured" });
  }

  try {
    const url = new URL("https://app.ticketmaster.com/discovery/v2/events.json");
    url.searchParams.set("apikey",             apiKey);
    url.searchParams.set("classificationName", "music");
    url.searchParams.set("countryCode",        countryCode.toUpperCase());
    url.searchParams.set("size",               String(size));
    url.searchParams.set("sort",               "date,asc");
    url.searchParams.set("startDateTime",      new Date().toISOString().split(".")[0] + "Z");

    const response = await fetch(url.toString());

    if (!response.ok) {
      const errText = await response.text();
      console.error("Ticketmaster error:", response.status, errText);
      return res.status(response.status).json({ error: "Ticketmaster request failed" });
    }

    const data   = await response.json();
    const events = (data._embedded?.events || []).map(ev => ({
      id:          ev.id,
      name:        ev.name,
      type:        "concert",
      url:         ev.url,
      date:        ev.dates?.start?.localDate   || null,
      time:        ev.dates?.start?.localTime   || null,
      venue:       ev._embedded?.venues?.[0]?.name || "Unknown Venue",
      city:        ev._embedded?.venues?.[0]?.city?.name || "",
      country:     ev._embedded?.venues?.[0]?.country?.countryCode || countryCode,
      countryName: ev._embedded?.venues?.[0]?.country?.name || "",
      lat:         parseFloat(ev._embedded?.venues?.[0]?.location?.latitude)  || null,
      lng:         parseFloat(ev._embedded?.venues?.[0]?.location?.longitude) || null,
      genre:       ev.classifications?.[0]?.genre?.name || "",
      subGenre:    ev.classifications?.[0]?.subGenre?.name || "",
      image:       ev.images?.find(i => i.ratio === "16_9" && i.width > 500)?.url
                || ev.images?.[0]?.url || null,
      priceMin:    ev.priceRanges?.[0]?.min || null,
      priceMax:    ev.priceRanges?.[0]?.max || null,
      currency:    ev.priceRanges?.[0]?.currency || null,
    }));

    res.json({ events, total: data.page?.totalElements || events.length });
  } catch (err) {
    console.error("concerts route error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;