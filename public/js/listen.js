let mediaRecorder;
let audioChunks = [];
let isRecording = false;
let sessionStartedAt = null;

let audioCtx, analyser, source, dataArray, animationId;

const micBtn    = document.getElementById("micBtn");
const micWrap   = document.querySelector(".mic");
const statusText = document.getElementById("recStatus");
const canvas    = document.getElementById("waveCanvas");
const matchOverlay = document.getElementById("matchOverlay");
const matchResult  = document.getElementById("matchResult");
const matchTitle   = document.getElementById("matchTitle");
const matchArtist  = document.getElementById("matchArtist");
const matchNone    = document.getElementById("matchNone");
const matchBadge   = document.getElementById("matchBadge");
const matchInfo    = document.getElementById("matchInfo");
const matchDivider = document.getElementById("matchDivider");
const matchClose   = document.getElementById("matchClose");
const matchRetry   = document.getElementById("matchRetry");

// close modal
function closeModal() {
  if (matchOverlay) matchOverlay.classList.remove("visible");
}
if (matchClose)  matchClose.addEventListener("click", closeModal);
if (matchRetry)  matchRetry.addEventListener("click", () => { closeModal(); });
if (matchOverlay) matchOverlay.addEventListener("click", e => { if (e.target === matchOverlay) closeModal(); });

canvas.width  = canvas.offsetWidth || 500;
canvas.height = 80;
const ctx  = canvas.getContext("2d");
const base = canvas.height / 2;

// draw flat baseline on load
drawBaseline();

// ── auth check ──
let userLoggedIn = false;
fetch("/auth/status")
  .then(r => r.json())
  .then(d => { userLoggedIn = d.loggedIn; });

function showAuthToast() {
  let toast = document.getElementById("authToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "authToast";
    toast.textContent = "Please log in to use this feature";
    toast.style.cssText = `
      position:fixed; bottom:32px; left:50%;
      transform:translateX(-50%) translateY(20px);
      background:#1a1a1c; border:1px solid rgba(193,2,6,0.5);
      color:#fff; font-size:13px; font-weight:500;
      padding:10px 22px; border-radius:999px;
      opacity:0; pointer-events:none;
      transition:opacity 0.25s, transform 0.25s;
      z-index:9999; font-family:Inter,sans-serif;
    `;
    document.body.appendChild(toast);
  }
  toast.style.opacity = "1";
  toast.style.transform = "translateX(-50%) translateY(0)";
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(20px)";
  }, 2500);
}

micBtn.addEventListener("click", () => {
  if (!userLoggedIn) {
    showAuthToast();
    // still shake so the button feels responsive
    micWrap.classList.remove("shake");
    void micWrap.offsetWidth;
    micWrap.classList.add("shake");
    micWrap.addEventListener("animationend", () => micWrap.classList.remove("shake"), { once: true });
    return;
  }
  // shake on every tap
  micWrap.classList.remove("shake");
  void micWrap.offsetWidth; // force reflow to restart animation
  micWrap.classList.add("shake");
  micWrap.addEventListener("animationend", () => micWrap.classList.remove("shake"), { once: true });

  if (!isRecording) startRecording();
  else stopRecording();
});

async function startRecording() {
  try {
    const displayStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true
    });

    const audioTracks = displayStream.getAudioTracks();
    if (!audioTracks.length) {
      alert("Select a tab and enable 'Share tab audio'");
      return;
    }

    const stream = new MediaStream([audioTracks[0]]);
    audioChunks = [];
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = e => audioChunks.push(e.data);

    audioCtx = new window.AudioContext();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.85;
    source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);
    dataArray = new Uint8Array(analyser.frequencyBinCount);

    isRecording = true;
    sessionStartedAt = new Date().toISOString();
    micBtn.src = "images/recording.svg";
    micWrap.classList.add("recording");
    statusText.textContent = "Listening…";
    statusText.classList.add("listening");

    // hide previous result
    if (matchOverlay) matchOverlay.classList.remove("visible");

    mediaRecorder.start();
    drawFrequencyBars();

    setTimeout(() => { if (isRecording) stopRecording(); }, 10000);
  } catch (err) {
    console.error("Capture error:", err);
    statusText.textContent = "Audio capture denied";
    statusText.classList.remove("listening");
  }
}

function stopRecording() {
  if (!mediaRecorder) return;
  mediaRecorder.onstop = () => {
    const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
    cancelAnimationFrame(animationId);
    clearCanvas();
    drawBaseline();
    micWrap.classList.remove("recording");
    micBtn.src = "images/mic.svg";
    statusText.textContent = "Identifying…";
    isRecording = false;
    recognize(audioBlob, sessionStartedAt);
  };
  mediaRecorder.stop();
  audioCtx.close();
}

function drawBaseline() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.strokeStyle = "rgba(193,2,6,0.3)";
  ctx.lineWidth = 1.5;
  ctx.moveTo(0, base);
  ctx.lineTo(canvas.width, base);
  ctx.stroke();
}

function drawFrequencyBars() {
  animationId = requestAnimationFrame(drawFrequencyBars);
  analyser.getByteFrequencyData(dataArray);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const barCount = 48;
  const barWidth = canvas.width / barCount;

  for (let i = 0; i < barCount; i++) {
    const value = dataArray[i];
    const barHeight = (value / 255) * (canvas.height * 0.85);
    const x = i * barWidth;

    // mirror: bar above and below baseline
    const alpha = 0.5 + (value / 255) * 0.5;
    ctx.fillStyle = `rgba(193, 2, 6, ${alpha})`;
    ctx.beginPath();
    ctx.roundRect(x + 2, base - barHeight, barWidth - 4, barHeight, 2);
    ctx.fill();

    // reflection below
    ctx.fillStyle = `rgba(193, 2, 6, ${alpha * 0.25})`;
    ctx.beginPath();
    ctx.roundRect(x + 2, base, barWidth - 4, barHeight * 0.4, 2);
    ctx.fill();
  }
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

async function recognize(blob, startedAt) {
  const formData = new FormData();
  formData.append("audio", blob);
  if (startedAt) formData.append("startedAt", startedAt);
  try {
    const res = await fetch("/api/recognize", { method: "POST", body: formData });
    const result = await res.json();

    if (!result.match) {
      statusText.textContent = "Nothing found";
      statusText.classList.remove("listening");
      if (matchOverlay) {
        matchBadge.textContent = "No Match";
        matchBadge.className = "match-badge none";
        matchTitle.style.display = "none";
        matchArtist.style.display = "none";
        matchDivider.style.display = "none";
        matchInfo.style.display = "none";
        matchNone.style.display = "block";
        matchOverlay.classList.add("visible");
      }
    } else {
      statusText.textContent = "Match found";
      statusText.classList.add("listening");
      if (matchOverlay) {
        const m = result.match;
        matchBadge.textContent = "Match Found";
        matchBadge.className = "match-badge found";
        matchNone.style.display = "none";
        matchTitle.style.display = "block";
        matchArtist.style.display = "block";
        matchDivider.style.display = "block";
        matchInfo.style.display = "flex";
        matchTitle.textContent  = m.title  || "Unknown Title";
        matchArtist.textContent = m.artist || "Unknown Artist";
        matchInfo.innerHTML = "";
        const rows = [
          ["Album",      m.album      || null],
          ["Genre",      m.genre      || null],
          ["Released",   m.releaseDate ? m.releaseDate.slice(0,4) : null],
          ["Confidence", m.confidence ? Math.round(m.confidence * 100) + "%" : null],
        ];
        rows.forEach(([label, val]) => {
          if (!val) return;
          const row = document.createElement("div");
          row.className = "match-info-row";
          row.innerHTML = `<span class="match-info-label">${label}</span><span class="match-info-value">${val}</span>`;
          matchInfo.appendChild(row);
        });
        matchOverlay.classList.add("visible");
      }
    }
  } catch (err) {
    statusText.textContent = "Recognition failed";
    statusText.classList.remove("listening");
  }
}