const grid          = document.getElementById("grid");
const resultsWrap   = document.getElementById("searchresults");
const navSearchInput = document.getElementById("navsearchinput");
const navSearchBtn  = document.getElementById("navsearchbtn");

// ── auth status ──
let userLoggedIn = false;
fetch("/auth/status").then(r => r.json()).then(d => { userLoggedIn = d.loggedIn; });

// ── trending ──
async function fetchTrendingSongs() {
  try {
    const res = await fetch("/api/songs/trending");
    if (!res.ok) throw new Error("Failed to fetch trending songs");
    const songs = await res.json();
    await loadMyLikes();
    renderTrending(songs);
  } catch (err) { console.error(err); }
}
if (grid) fetchTrendingSongs();

let likedSet = new Set();
async function loadMyLikes() {
  const res = await fetch("/api/likes/me");
  if (res.ok) { const ids = await res.json(); likedSet = new Set(ids); }
}

function renderTrending(songs) {
  grid.innerHTML = "";
  songs.forEach(song => {
    const card = document.createElement("div");
    card.className = "songcard";
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">
          <img class="songimage" src="${song.artwork?.large || ""}">
          <div class="buttons">
            <button class="likebtn ${likedSet.has(song._id) ? "liked" : ""}" data-id="${song._id}" title="Like">♥</button>
            <button class="playbtn" data-id="${song._id}" title="Play preview">▶</button>
            <div class="plwrap">
              <button class="plbtn" data-id="${song._id}" title="Add to playlist">+</button>
              <div class="plmenu"></div>
            </div>
          </div>
          <div class="songrank">
            <span class="song">${escapeHtml(song.title)}</span>
            <span class="rank">${song.rank}</span>
          </div>
        </div>
      </div>`;
    grid.appendChild(card);
  });
  wireLikeButtons(grid);
  wirePlaylistButtons(grid);
  wirePlayButtons(grid);
}

// ── like buttons ──
function wireLikeButtons(scope) {
  scope.querySelectorAll(".likebtn").forEach(btn => {
    btn.addEventListener("click", async e => {
      e.stopPropagation();
      if (!userLoggedIn) { showAuthToast(); return; }
      const songId = btn.dataset.id;
      const liked = btn.classList.toggle("liked");
      if (liked) likedSet.add(songId); else likedSet.delete(songId);
      await fetch(`/api/likes/${songId}`, { method: liked ? "POST" : "DELETE" });
    });
  });
}

function showAuthToast() {
  let toast = document.getElementById("authToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "authToast";
    toast.textContent = "Please log in first";
    document.body.appendChild(toast);
  }
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

// ── playlist buttons ──
function wirePlaylistButtons(scope) {
  scope.querySelectorAll(".plbtn").forEach(btn => {
    btn.addEventListener("click", async e => {
      e.stopPropagation();
      if (!userLoggedIn) { showAuthToast(); return; }
      const songId = btn.dataset.id;
      const wrap   = btn.closest(".plwrap");
      const menu   = wrap.querySelector(".plmenu");
      document.querySelectorAll(".plmenu.open").forEach(m => m.classList.remove("open"));
      const res = await fetch("/api/playlists/me1");
      const playlists = await res.json();
      renderPlaylistMenu(menu, playlists, songId);
      menu.classList.toggle("open");
    });
  });
}

function renderPlaylistMenu(menuEl, playlists, songId) {
  menuEl.innerHTML = "";
  playlists.forEach(pl => {
    const isInPlaylist = pl.songIds.includes(songId);
    const item = document.createElement("div");
    item.className = "plitem";
    item.innerHTML = `
      <span class="padd">${escapeHtml(pl.name)}</span>
      <span class="plaction">${isInPlaylist ? "×" : "+"}</span>`;
    item.addEventListener("click", async e => {
      e.stopPropagation();
      if (isInPlaylist) {
        await fetch(`/api/playlists/${pl._id}/remove/${songId}`, { method: "DELETE" });
      } else {
        await fetch(`/api/playlists/${pl._id}/add/${songId}`, { method: "POST" });
      }
      pl.songIds = isInPlaylist ? pl.songIds.filter(id => id !== songId) : [songId, ...pl.songIds];
      renderPlaylistMenu(menuEl, playlists, songId);
    });
    menuEl.appendChild(item);
  });
}

document.addEventListener("click", () => {
  document.querySelectorAll(".plmenu.open").forEach(m => m.classList.remove("open"));
});

// ── play buttons (trending cards) ──
let currentAudio = null;
let currentBtn   = null;

function wirePlayButtons(scope) {
  scope.querySelectorAll(".playbtn").forEach(btn => {
    btn.addEventListener("click", async e => {
      e.stopPropagation();
      const songDbId = btn.dataset.id;
      const itunesId = songDbId.replace("song_itunes_", "");
      if (!/^\d+$/.test(itunesId)) return;

      let audio = btn._audio;
      if (!audio) {
        const res  = await fetch(`https://itunes.apple.com/lookup?id=${itunesId}`);
        const data = await res.json();
        const url  = data.results?.[0]?.previewUrl;
        if (!url) { btn.textContent = "×"; return; }
        audio = new Audio(url);
        audio.volume = 0.6;
        btn._audio = audio;
      }

      if (currentAudio && currentAudio !== audio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        if (currentBtn) currentBtn.textContent = "▶";
      }
      currentAudio = audio;
      currentBtn   = btn;

      if (audio.paused) {
        await audio.play();
        btn.textContent = "⏸";
      } else {
        audio.pause();
        btn.textContent = "▶";
      }
      audio.onended = () => { btn.textContent = "▶"; currentAudio = null; currentBtn = null; };
    });
  });
}

// ── nav search ──
NavSearch();
function NavSearch() {
  if (!navSearchInput || !navSearchBtn) return;
  navSearchBtn.addEventListener("click", runSearch);
  navSearchInput.addEventListener("keydown", e => { if (e.key === "Enter") runSearch(); });
}

async function runSearch() {
  const q = navSearchInput.value.trim();
  if (!q) return;

  // show skeleton while loading
  resultsWrap.innerHTML = `
    <div class="search-results-label">Search results</div>
    ${Array.from({length: 3}, () => `
      <div class="search-card" style="pointer-events:none">
        <div style="width:56px;height:56px;border-radius:10px;background:rgba(255,255,255,0.05);flex-shrink:0"></div>
        <div style="flex:1;display:flex;flex-direction:column;gap:8px">
          <div style="height:12px;width:55%;border-radius:4px;background:rgba(255,255,255,0.06)"></div>
          <div style="height:10px;width:35%;border-radius:4px;background:rgba(255,255,255,0.04)"></div>
        </div>
      </div>`).join("")}`;

  try {
    const res  = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=song&limit=6`);
    const data = await res.json();
    renderSearchResults(data.results || []);
  } catch {
    resultsWrap.innerHTML = `<div class="search-empty">Search failed — try again.</div>`;
  }
}

// ── search preview audio ──
let searchAudio    = null;
let searchAudioBtn = null;

function renderSearchResults(tracks) {
  resultsWrap.innerHTML = "";

  if (!tracks.length) {
    resultsWrap.innerHTML = `<div class="search-empty">No results found.</div>`;
    return;
  }

  const header = document.createElement("div");
  header.className = "search-results-header";
  header.innerHTML = `
    <span class="search-results-label">${tracks.length} result${tracks.length !== 1 ? "s" : ""}</span>
    <button class="search-clear-btn" id="searchClearBtn">✕ Clear</button>
  `;
  resultsWrap.appendChild(header);

  document.getElementById("searchClearBtn").addEventListener("click", () => {
    resultsWrap.innerHTML = "";
    navSearchInput.value = "";
    if (searchAudio) { searchAudio.pause(); searchAudio = null; searchAudioBtn = null; }
  });

  tracks.forEach(track => {
    const card = document.createElement("div");
    card.className = "search-card";
    card.innerHTML = `
      <img src="${track.artworkUrl100}" alt="${escapeHtml(track.trackName)}">
      <div class="search-card-info">
        <div class="search-title">${escapeHtml(track.trackName)}</div>
        <div class="search-artist">${escapeHtml(track.artistName)}</div>
      </div>
      <div class="search-actions">
        ${track.previewUrl ? `<button class="search-preview-btn" data-preview="${track.previewUrl}" title="Preview">▶</button>` : ""}
        <a class="search-itunes-btn" href="${track.trackViewUrl}" target="_blank" rel="noopener">iTunes</a>
      </div>`;
    resultsWrap.appendChild(card);
  });

  // wire preview buttons
  resultsWrap.querySelectorAll(".search-preview-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const url = btn.dataset.preview;

      // toggle same track
      if (searchAudio && searchAudioBtn === btn) {
        if (searchAudio.paused) {
          searchAudio.play();
          btn.textContent = "⏸";
          btn.classList.add("playing");
        } else {
          searchAudio.pause();
          btn.textContent = "▶";
          btn.classList.remove("playing");
        }
        return;
      }

      // stop previous
      if (searchAudio) {
        searchAudio.pause();
        searchAudio.currentTime = 0;
        if (searchAudioBtn) { searchAudioBtn.textContent = "▶"; searchAudioBtn.classList.remove("playing"); }
      }

      searchAudio    = new Audio(url);
      searchAudioBtn = btn;
      searchAudio.volume = 0.7;
      searchAudio.play();
      btn.textContent = "⏸";
      btn.classList.add("playing");

      searchAudio.onended = () => {
        btn.textContent = "▶";
        btn.classList.remove("playing");
        searchAudio    = null;
        searchAudioBtn = null;
      };
    });
  });
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&","&amp;").replaceAll("<","&lt;")
    .replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
}