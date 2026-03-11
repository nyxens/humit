const playlistWrap = document.getElementById("playlistCards");
const likedWrap    = document.getElementById("likedCards");
const usernameEl   = document.getElementById("profileUsername");
const aboutBtn     = document.getElementById("aboutBtn");
const aboutInput   = document.getElementById("aboutInput");
const avatarEl     = document.getElementById("avatarInitial");
const statPlaylists = document.getElementById("statPlaylists");
const statLiked     = document.getElementById("statLiked");

let isEditing = false;

document.addEventListener("DOMContentLoaded", () => {
  loadProfile();
  renderLibrary();
});

async function loadProfile() {
  const res = await fetch("/api/user/me");
  if (!res.ok) {
    usernameEl.textContent = "User";
    return;
  }
  const user = await res.json();

  // username
  usernameEl.textContent = user.username;

  // avatar initial — first letter of username
  if (avatarEl) {
    avatarEl.textContent = (user.username || "?")[0].toUpperCase();
  }

  // about
  aboutInput.value = user.about || "";
}

async function renderLibrary() {
  await renderPlaylists();
  await renderLikedSongs();
}

async function renderLikedSongs() {
  if (!likedWrap) return;
  likedWrap.innerHTML = "";

  const res = await fetch("/api/likes/me");
  if (!res.ok) {
    likedWrap.innerHTML = `
      <div class="library-empty error">
        <span class="empty-icon">✕</span>
        <span>Failed to load liked songs</span>
      </div>`;
    return;
  }

  const songIds = await res.json();

  // update stat pill
  if (statLiked) statLiked.textContent = songIds.length;

  if (songIds.length === 0) {
    likedWrap.innerHTML = `
      <div class="library-empty">
        <span class="empty-icon">♡</span>
        <span>No liked songs yet</span>
      </div>`;
    return;
  }

  const songRes = await fetch("/api/songs/by-ids", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ songIds })
  });
  const songs = await songRes.json();

  songs.forEach(s => {
    const card = document.createElement("div");
    card.className = "songcard";
    card.innerHTML = `
      <img class="songimage" src="${s.artwork?.large || ""}" alt="">
      <div class="songcard-info">
        <span class="song" title="${s.title}">${escapeHtml(s.title)}</span>
        <span class="artist" title="${s.artist || ""}">${escapeHtml(s.artist || "")}</span>
      </div>
    `;
    likedWrap.appendChild(card);
  });
}

async function renderPlaylists() {
  if (!playlistWrap) return;
  playlistWrap.innerHTML = "";

  const res = await fetch("/api/playlists/me1"); // fixed: was /me1
  if (!res.ok) {
    playlistWrap.innerHTML = `
      <div class="library-empty error">
        <span class="empty-icon">✕</span>
        <span>Failed to load playlists</span>
      </div>`;
    return;
  }

  const playlists = await res.json();

  // update stat pill
  if (statPlaylists) statPlaylists.textContent = playlists.length;

  if (playlists.length === 0) {
    playlistWrap.innerHTML = `
      <div class="library-empty">
        <span class="empty-icon">♪</span>
        <span>No playlists yet</span>
      </div>`;
    return;
  }

  playlists.forEach(pl => {
    const card = document.createElement("div");
    card.className = "playlist-card";
    card.innerHTML = `
      <div class="playlist-top">
        <div class="playlist-name" title="${pl.name}">${escapeHtml(pl.name)}</div>
        <div class="playlist-count">${pl.songIds.length} songs</div>
      </div>
      <div class="playlist-preview">
        ${pl.songIds.length ? "Click to view songs" : "No songs in this playlist"}
      </div>
      <div class="playlist-songs"></div>
    `;

    const box = card.querySelector(".playlist-songs");

    card.addEventListener("click", async () => {
      const isOpen = box.style.display === "block";

      // close all others
      document.querySelectorAll(".playlist-songs").forEach(b => {
        if (b !== box) b.style.display = "none";
      });

      if (isOpen) {
        box.style.display = "none";
        box.innerHTML = "";
        return;
      }

      box.style.display = "block";
      box.innerHTML = "";

      if (pl.songIds.length === 0) {
        box.innerHTML = `<div style="color:var(--gray);font-size:13px">Empty playlist</div>`;
        return;
      }

      const songRes = await fetch("/api/songs/by-ids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ songIds: pl.songIds })
      });
      const songs = await songRes.json();

      songs.forEach(s => {
        const row = document.createElement("div");
        row.className = "playlist-song-row";
        row.innerHTML = `
          <img src="${s.artwork?.small || ""}" alt="">
          <div class="playlist-song-meta">
            <div class="playlist-song-title" title="${s.title}">${escapeHtml(s.title)}</div>
            <div class="playlist-song-artist" title="${s.artist || ""}">${escapeHtml(s.artist || "")}</div>
          </div>
        `;
        box.appendChild(row);
      });
    });

    playlistWrap.appendChild(card);
  });
}

aboutBtn.addEventListener("click", async () => {
  if (!isEditing) {
    isEditing = true;
    aboutInput.disabled = false;
    aboutInput.focus();
    aboutBtn.innerHTML = `✔`;
  } else {
    const res = await fetch("/api/user/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ about: aboutInput.value })
    });
    if (res.ok) {
      isEditing = false;
      aboutInput.disabled = true;
      aboutBtn.innerHTML = `✎`;
    }
  }
});

function escapeHtml(str) {
  return String(str)
    .replaceAll("&",  "&amp;")
    .replaceAll("<",  "&lt;")
    .replaceAll(">",  "&gt;")
    .replaceAll('"',  "&quot;")
    .replaceAll("'",  "&#039;");
}