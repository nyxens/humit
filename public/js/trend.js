const grid = document.getElementById("grid");
const resultsWrap = document.getElementById("searchresults");
const navSearchInput = document.getElementById("navsearchinput");
const navSearchBtn = document.getElementById("navsearchbtn");
async function fetchTrendingSongs() {
  try {
    const res = await fetch("/api/songs/trending");
    if (!res.ok) 
      throw new Error("Failed to fetch trending songs");
    const songs = await res.json();
    await loadMyLikes();
    renderTrending(songs);
  } catch (err) {
    console.error(err);
  }
}
if (grid) 
  fetchTrendingSongs();
let likedSet = new Set();
async function loadMyLikes() {
  const res = await fetch("/api/likes/me");
  if (res.ok) {
    const ids = await res.json();
    likedSet = new Set(ids);
  }
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
      </div>
    `;
    grid.appendChild(card);
  });
  wireLikeButtons(grid);
  wirePlaylistButtons(grid);
  wirePlayButtons(grid);
}
function wireLikeButtons(scope) {
  scope.querySelectorAll(".likebtn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const songId = btn.dataset.id;
      const liked = btn.classList.toggle("liked");
      if (liked) 
        likedSet.add(songId);
      else 
        likedSet.delete(songId);
      await fetch(`/api/likes/${songId}`, {
        method: liked ? "POST" : "DELETE"
      });
    });
  });
}
function wirePlaylistButtons(scope) {
  scope.querySelectorAll(".plbtn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const songId = btn.dataset.id;
      const wrap = btn.closest(".plwrap");
      const menu = wrap.querySelector(".plmenu");
      document.querySelectorAll(".plmenu.open")
        .forEach(m => m.classList.remove("open"));
      const res = await fetch("/api/playlists/me");
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
      <span class="plaction">${isInPlaylist ? "×" : "+"}</span>
    `;
    item.addEventListener("click", async (e) => {
      e.stopPropagation();
      if (isInPlaylist) {
        await fetch(`/api/playlists/${pl._id}/remove/${songId}`, {
          method: "DELETE"
        });
      } else {
        await fetch(`/api/playlists/${pl._id}/add/${songId}`, {
          method: "POST"
        });
      }
      pl.songIds = isInPlaylist
        ? pl.songIds.filter(id => id !== songId)
        : [songId, ...pl.songIds];
      renderPlaylistMenu(menuEl, playlists, songId);
    });
    menuEl.appendChild(item);
  });
}
document.addEventListener("click", () => {
  document.querySelectorAll(".plmenu.open")
    .forEach(m => m.classList.remove("open"));
});
let currentAudio = null;
function wirePlayButtons(scope) {
  scope.querySelectorAll(".playbtn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const songDbId = btn.dataset.id;
      const itunesId = songDbId.replace("song_itunes_", "");
      if (!/^\d+$/.test(itunesId)) 
        return;
      let audio = btn._audio;
      if (!audio) {
        const res = await fetch(`https://itunes.apple.com/lookup?id=${itunesId}`);
        const data = await res.json();
        const previewUrl = data.results?.[0]?.previewUrl;
        if (!previewUrl) {
          btn.textContent = "×";
          return;
        }
        audio = new Audio(previewUrl);
        audio.volume = 0.6;
        btn._audio = audio;
      }
      if (currentAudio && currentAudio !== audio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
      currentAudio = audio;
      if (audio.paused) {
        await audio.play();
        btn.textContent = "⏸";
      } else {
        audio.pause();
        btn.textContent = "▶";
      }
      audio.onended = () => (btn.textContent = "▶");
    });
  });
}
NavSearch();
function NavSearch() {
  if (!navSearchInput || !navSearchBtn) return;
  navSearchBtn.addEventListener("click", runSearch);
  navSearchInput.addEventListener("keydown", e => {
    if (e.key === "Enter") runSearch();
  });
}
async function runSearch() {
  const q = navSearchInput.value.trim();
  if (!q) 
    return;
  resultsWrap.innerHTML = "Searching…";
  try {
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=song&limit=5`
    );
    const data = await res.json();
    renderSearchResults(data.results || []);
  } catch {
    resultsWrap.innerHTML = "Search failed.";
  }
}
function renderSearchResults(tracks) {
  resultsWrap.innerHTML = "";
  tracks.forEach(track => {
    const card = document.createElement("div");
    card.className = "search-card";
    card.innerHTML = `
      <img src="${track.artworkUrl100}">
      <div>
        <div class="search-title">${escapeHtml(track.trackName)}</div>
        <div class="search-artist">${escapeHtml(track.artistName)}</div>
      </div>
      <div class="empty">
      </div>
      <div class="search-actions">
        ${track.previewUrl ? `<audio controls src="${track.previewUrl}"></audio>` : ""}
        <a href="${track.trackViewUrl}" target="_blank">Open in iTunes</a>
      </div>
    `;
    resultsWrap.appendChild(card);
  });
}
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}