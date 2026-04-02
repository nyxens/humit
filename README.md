# HumiT 🎵
> A full-stack music discovery and audio fingerprinting web app built with Node.js, Express, and MongoDB.

---

## What is HumiT?

HumiT lets users identify songs by listening to audio, browse trending tracks, explore live concerts and top charts by country on an interactive globe, and manage personal playlists and likes — all in one place.

---

## Features

- **Song Recognition** — records audio from a browser tab, generates a fingerprint, and matches it against a local database of hashed songs
- **Trending Songs** — pulls top tracks from iTunes RSS (region: IN) and displays them in a ranked card grid
- **World Page** — an interactive 3D globe powered by Three.js; click any country to see top songs (Last.fm) or live concerts (Ticketmaster)
- **Search** — search any song via iTunes Search API with inline audio previews
- **Likes & Playlists** — authenticated users can like songs and manage custom playlists (a Favourites playlist is created automatically on signup)
- **Recognition History** — stores past recognition sessions per user
- **User Profiles** — editable profile with liked songs and playlist management

---

## Tech Stack

| Layer | Technology |
|---|---|
| Server | Node.js + Express v5 |
| Database | MongoDB + Mongoose |
| Auth | express-session + bcryptjs |
| Audio | Web Audio API, FFmpeg, FFT-JS |
| Frontend | Vanilla JS, HTML, CSS (Inter font) |
| Templating | EJS (for error pages) |

---

## Why MongoDB?

MongoDB was chosen over a relational database for several reasons specific to this project's data model:

- **Array fields in playlists** — a single document query replaces what would require two tables and multiple joins in SQL
- **Inconsistent song schema** — some songs have complete metadata, others don't; MongoDB's optional fields handle this cleanly without nullable columns
- **Nested objects** — native support avoids creating extra tables or storing JSON strings
- **Fingerprint storage** — built-in horizontal scaling (sharding) suits the fingerprint collection
- **Rapid prototyping** — schema changes are zero-downtime; no migrations required
- **Single-document queries** — the data model maps naturally to MongoDB collections without forced normalization

---

## External APIs

### Last.fm
Used for country-specific top song charts on the World page.
- `geo.getTopTracks` — top tracks for a specific country
- `chart.getTopTracks` — global fallback
- `track.getInfo` — album art, duration, and genre tags
- Rate limit: 5 req/sec (free tier) — keep `limit` at 10 or below

### Ticketmaster Discovery API
Used for live concert listings by country on the World page.
- `GET /discovery/v2/events` — filtered by `countryCode`, sorted by date
- Rate limit: 5,000 req/day (free tier)

### iTunes RSS + Search API
Used for trending songs and the search feature.
- `https://itunes.apple.com/rss/topsongs/...` — RSS chart feed
- `https://itunes.apple.com/search` — song search with preview URLs

### GeoJSON (Country Borders)
Used for globe rendering and click detection.
- Source: `https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson`
- No API key required

---

## Project Structure

```
humit/
├── server.js              # Express app entry point
├── .env                   # Private keys (never commit this)
├── middleware/
│   └── requireAuth.js     # Session + Bearer token auth guard
├── models/                # Mongoose schemas (User, Song, Playlist, Like, Fingerprint, etc.)
├── routes/
│   ├── auth.js            # Signup, login, logout, status
│   ├── songs.js           # Trending + song lookup
│   ├── likes.js           # Like / unlike
│   ├── playlists.js       # CRUD + add/remove songs
│   ├── user.js            # Profile get/update
│   ├── recognize.js       # Audio fingerprint matching
│   ├── history.js         # Recognition history
│   ├── concerts.js        # Ticketmaster proxy
│   └── topsongs.js        # Last.fm proxy
├── public/
│   ├── css/               # style.css, home.css, trend.css, profile.css, globe.css
│   └── js/                # main.js, listen.js, trend.js, profile.js, globe.js, musiceffect.js
├── views/                 # HTML pages + EJS error template
├── scripts/               # Utility scripts (sync songs, generate fingerprints)
└── uploads/               # Temporary audio recordings (auto-cleared)
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server (auto-restarts on file changes)
npm run dev

# Stop server
Ctrl+C
```

Server runs at `http://localhost:3000`

---

## Useful Scripts

```bash
# Sync trending songs from iTunes RSS into MongoDB
node scripts/syncTrendingSongs.js

# Generate audio fingerprints for songs in the /songs folder
node scripts/generateFingerprints.js
```

To add songs for recognition: place `.mp3` files in the `songs/` folder, update the seed file, then run `generateFingerprints`.

---

## API Testing (Thunder Client / Postman)

Because the app uses cookie-based sessions, API clients need a workaround to authenticate.

**Step 1 — Login and get your userId:**
```
POST http://localhost:3000/auth/login
Content-Type: application/json

{ "email": "test@test.com", "password": "123456789!aD" }
```
Response includes `userId`.

**Step 2 — Add this header to all protected requests:**
```
Authorization: Bearer humit_dev_only:<userId>
```

**Step 3 — Check auth status:**
```
GET http://localhost:3000/auth/status
Authorization: Bearer humit_dev_only:<userId>
```

**Common test requests:**

| Action | Method | URL |
|---|---|---|
| Login | POST | `/auth/login` |
| Auth status | GET | `/auth/status` |
| Get trending | GET | `/api/songs/trending` |
| Create playlist | POST | `/api/playlists` |
| Add song to playlist | POST | `/api/playlists/:playlistId/add/:songId` |
| Like a song | POST | `/api/likes/:songId` |
| Recognition history | GET | `/api/history/me` |

Debug session info: `http://localhost:3000/debugsession`

---

## Test Accounts

| Purpose | Email | Password |
|---|---|---|
| General testing | test@test.com | 123456789!aD |
| API testing | test1@test.com | 123456789!aD |

---

## Dependencies

| Package | Purpose |
|---|---|
| `express` | HTTP server framework |
| `mongoose` | MongoDB ODM |
| `express-session` | Session management |
| `bcryptjs` | Password hashing |
| `dotenv` | Environment variable loading |
| `ejs` | HTML templating for error pages |
| `multer` | Multipart audio upload handling |
| `fluent-ffmpeg` + `ffmpeg-static` | Audio conversion pipeline |
| `fft-js` | Fast Fourier Transform for fingerprinting |
| `node-wav` | WAV file parsing |
| `nodemon` *(dev)* | Auto-restart on file changes |

---

## References

- [Web Audio API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Audio Fingerprinting — University of Rochester ECE Paper](https://hajim.rochester.edu/ece/sites/zduan/teaching/ece472/projects/2019/AudioFingerprinting.pdf)
- [Last.fm API Docs](https://www.last.fm/api)
- [Ticketmaster Discovery API](https://developer.ticketmaster.com)
- [iTunes Search API](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI)