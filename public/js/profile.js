let isEditing = false;

document.addEventListener("DOMContentLoaded", () => {
  // ── element refs (safe to grab now) ──
  const playlistWrap       = document.getElementById("playlistCards");
  const likedWrap          = document.getElementById("likedCards");
  const usernameEl         = document.getElementById("profileUsername");
  const aboutBtn           = document.getElementById("aboutBtn");
  const aboutInput         = document.getElementById("aboutInput");
  const avatarEl           = document.getElementById("avatarInitial");
  const statPlaylists      = document.getElementById("statPlaylists");
  const statLiked          = document.getElementById("statLiked");
  const createPlaylistBtn  = document.getElementById("createPlaylistBtn");
  const createPlaylistForm = document.getElementById("createPlaylistForm");
  const newPlaylistInput   = document.getElementById("newPlaylistName");
  const confirmCreateBtn   = document.getElementById("confirmCreateBtn");
  const cancelCreateBtn    = document.getElementById("cancelCreateBtn");
  const historyWrap        = document.getElementById("historyCards");
  const clearHistoryBtn    = document.getElementById("clearHistoryBtn");

  loadProfile();
  renderLibrary();
  renderHistory();

  // ── PROFILE ────────────────────────────────────────
  async function loadProfile() {
    const res = await fetch("/api/user/me");
    if (!res.ok) { usernameEl.textContent = "User"; return; }
    const user = await res.json();
    usernameEl.textContent = user.username;
    if (avatarEl) avatarEl.textContent = (user.username || "?")[0].toUpperCase();
    aboutInput.value = user.about || "";
  }

  async function renderLibrary() {
    await renderPlaylists();
    await renderLikedSongs();
  }

  // ── LIKED SONGS ────────────────────────────────────
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

  // ── PLAYLISTS ──────────────────────────────────────
  async function renderPlaylists() {
    if (!playlistWrap) return;
    playlistWrap.innerHTML = "";

    const res = await fetch("/api/playlists/me1");
    if (!res.ok) {
      playlistWrap.innerHTML = `
        <div class="library-empty error">
          <span class="empty-icon">✕</span>
          <span>Failed to load playlists</span>
        </div>`;
      return;
    }

    const playlists = await res.json();
    if (statPlaylists) statPlaylists.textContent = playlists.length;

    if (playlists.length === 0) {
      playlistWrap.innerHTML = `
        <div class="library-empty">
          <span class="empty-icon">♪</span>
          <span>No playlists yet</span>
        </div>`;
      return;
    }

    playlists.forEach(pl => renderPlaylistCard(pl));
  }

  function renderPlaylistCard(pl) {
    const card = document.createElement("div");
    card.className = "playlist-card";
    card.dataset.id = pl._id;

    const isFavourites = pl.name === "Favourites";

    card.innerHTML = `
      <div class="playlist-top">
        <div class="playlist-name" title="${pl.name}">${escapeHtml(pl.name)}</div>
        <div class="playlist-top-right">
          <div class="playlist-count">${pl.songIds.length} songs</div>
          ${!isFavourites ? `<button class="playlist-delete-btn" title="Delete playlist">✕</button>` : ""}
        </div>
      </div>
      <div class="playlist-preview">
        ${pl.songIds.length ? "Click to view songs" : "No songs in this playlist"}
      </div>
      <div class="playlist-songs"></div>
    `;

    // delete
    const delBtn = card.querySelector(".playlist-delete-btn");
    if (delBtn) {
      delBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        if (!confirm(`Delete playlist "${pl.name}"?`)) return;
        const res = await fetch(`/api/playlists/${pl._id}`, { method: "DELETE" });
        if (res.ok) {
          card.remove();
          const current = parseInt(statPlaylists?.textContent || "0");
          if (statPlaylists) statPlaylists.textContent = Math.max(0, current - 1);
        }
      });
    }

    // expand songs
    const box = card.querySelector(".playlist-songs");
    card.addEventListener("click", async (e) => {
      if (e.target.classList.contains("playlist-delete-btn")) return;
      const isOpen = box.style.display === "block";
      document.querySelectorAll(".playlist-songs").forEach(b => {
        if (b !== box) b.style.display = "none";
      });
      if (isOpen) { box.style.display = "none"; box.innerHTML = ""; return; }

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
          <button class="song-remove-btn" title="Remove from playlist">✕</button>
        `;
        row.querySelector(".song-remove-btn").addEventListener("click", async (e) => {
          e.stopPropagation();
          const res = await fetch(`/api/playlists/${pl._id}/remove/${s._id}`, { method: "DELETE" });
          if (res.ok) {
            row.remove();
            pl.songIds = pl.songIds.filter(id => id !== s._id);
            card.querySelector(".playlist-count").textContent = `${pl.songIds.length} songs`;
            card.querySelector(".playlist-preview").textContent =
              pl.songIds.length ? "Click to view songs" : "No songs in this playlist";
            if (pl.songIds.length === 0)
              box.innerHTML = `<div style="color:var(--gray);font-size:13px">Empty playlist</div>`;
          }
        });
        box.appendChild(row);
      });
    });

    playlistWrap.appendChild(card);
  }

  // ── CREATE PLAYLIST ────────────────────────────────
  createPlaylistBtn.addEventListener("click", () => {
    createPlaylistForm.style.display = "flex";
    newPlaylistInput.focus();
  });

  cancelCreateBtn.addEventListener("click", () => {
    createPlaylistForm.style.display = "none";
    newPlaylistInput.value = "";
  });

  confirmCreateBtn.addEventListener("click", async () => {
    const name = newPlaylistInput.value.trim();
    if (!name) return;

    const res = await fetch("/api/playlists/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });

    if (res.ok) {
      const pl = await res.json();
      createPlaylistForm.style.display = "none";
      newPlaylistInput.value = "";
      const empty = playlistWrap.querySelector(".library-empty");
      if (empty) empty.remove();
      renderPlaylistCard(pl);
      const current = parseInt(statPlaylists?.textContent || "0");
      if (statPlaylists) statPlaylists.textContent = current + 1;
    } else {
      const err = await res.json();
      alert(err.error || "Failed to create playlist");
    }
  });

  newPlaylistInput.addEventListener("keydown", e => {
    if (e.key === "Enter") confirmCreateBtn.click();
    if (e.key === "Escape") cancelCreateBtn.click();
  });

  // ── ABOUT ME ───────────────────────────────────────
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


  // ── RECOGNITION HISTORY ────────────────────────────
  async function renderHistory() {
    if (!historyWrap) return;
    historyWrap.innerHTML = "";

    const res = await fetch("/api/history/me");
    if (!res.ok) {
      historyWrap.innerHTML = `
        <div class="library-empty error">
          <span class="empty-icon">✕</span>
          <span>Failed to load history</span>
        </div>`;
      return;
    }

    const history = await res.json();

    // show/hide clear button
    if (clearHistoryBtn) {
      clearHistoryBtn.style.display = history.length > 0 ? "inline-flex" : "none";
    }

    if (history.length === 0) {
      historyWrap.innerHTML = `
        <div class="library-empty">
          <span class="empty-icon">◎</span>
          <span>No recognition history yet</span>
        </div>`;
      return;
    }

    history.forEach(entry => renderHistoryEntry(entry));
  }

  function renderHistoryEntry(entry) {
    const row = document.createElement("div");
    row.className = "history-row " + (entry.status === "matched" ? "matched" : "unmatched");
    row.dataset.id = entry._id;

    const startDate = new Date(entry.startedAt);
    const dateStr   = startDate.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
    const timeStr   = startDate.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

    const duration  = entry.endedAt
      ? Math.round((new Date(entry.endedAt) - startDate) / 1000)
      : null;

    row.innerHTML = `
      <div class="history-icon">${entry.status === "matched" ? "♪" : "◎"}</div>
      <div class="history-meta">
        ${entry.status === "matched"
          ? `<div class="history-title">${escapeHtml(entry.matchedTitle || "Unknown")}</div>
             <div class="history-artist">${escapeHtml(entry.matchedArtist || "")}</div>`
          : `<div class="history-title no-match">No match found</div>`
        }
        <div class="history-time">${dateStr} · ${timeStr}${duration !== null ? ` · ${duration}s` : ""}${entry.confidence != null ? ` · ${Math.round(entry.confidence * 100)}% confidence` : ""}</div>
      </div>
      <button class="history-delete-btn" title="Delete entry">✕</button>
    `;

    row.querySelector(".history-delete-btn").addEventListener("click", async (e) => {
      e.stopPropagation();
      const res = await fetch(`/api/history/${entry._id}`, { method: "DELETE" });
      if (res.ok) {
        row.remove();
        // if no more entries show empty state
        if (historyWrap.children.length === 0) {
          historyWrap.innerHTML = `
            <div class="library-empty">
              <span class="empty-icon">◎</span>
              <span>No recognition history yet</span>
            </div>`;
          if (clearHistoryBtn) clearHistoryBtn.style.display = "none";
        }
      }
    });

    historyWrap.appendChild(row);
  }

  // clear all history
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener("click", async () => {
      if (!confirm("Clear all recognition history?")) return;
      const res = await fetch("/api/history/me/all", { method: "DELETE" });
      if (res.ok) {
        historyWrap.innerHTML = `
          <div class="library-empty">
            <span class="empty-icon">◎</span>
            <span>No recognition history yet</span>
          </div>`;
        clearHistoryBtn.style.display = "none";
      }
    });
  }

  // ── UTILS ──────────────────────────────────────────
  function escapeHtml(str) {
    return String(str)
      .replaceAll("&",  "&amp;")
      .replaceAll("<",  "&lt;")
      .replaceAll(">",  "&gt;")
      .replaceAll('"',  "&quot;")
      .replaceAll("'",  "&#039;");
  }
});