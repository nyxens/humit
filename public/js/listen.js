let mediaRecorder;
let audioChunks = [];
let isRecording = false;

let audioCtx, analyser, source, dataArray, animationId;

const pulseDot  = document.getElementById("micPulse");
const micBtn    = document.getElementById("micBtn");
const micWrap   = document.querySelector(".mic");
const statusText = document.getElementById("recStatus");
const canvas    = document.getElementById("waveCanvas");
const matchResult = document.getElementById("matchResult");
const matchTitle  = document.getElementById("matchTitle");
const matchArtist = document.getElementById("matchArtist");
const matchNone   = document.getElementById("matchNone");

canvas.width  = canvas.offsetWidth || 500;
canvas.height = 80;
const ctx  = canvas.getContext("2d");
const base = canvas.height / 2;

// draw flat baseline on load
drawBaseline();

micBtn.addEventListener("click", () => {
  if (!isRecording) startRecording();
  else stopRecording();
});

async function startRecording() {
  // check login first
  const authRes = await fetch("/auth/status");
  const authData = await authRes.json();
  if (!authData.loggedIn) {
    statusText.textContent = "Login to use this feature";
    statusText.classList.remove("listening");
    // shake the mic button as feedback
    micWrap.style.animation = "shake 0.4s ease";
    setTimeout(() => micWrap.style.animation = "", 400);
    return;
  }
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
    micBtn.src = "images/recording.svg";
    micWrap.classList.add("recording");
    pulseDot.classList.add("active");
    statusText.textContent = "Listening…";
    statusText.classList.add("listening");

    // hide previous result
    if (matchResult) matchResult.classList.remove("visible");

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
    pulseDot.classList.remove("active");
    micWrap.classList.remove("recording");
    micBtn.src = "images/mic.svg";
    statusText.textContent = "Identifying…";
    isRecording = false;
    recognize(audioBlob);
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

async function recognize(blob) {
  const formData = new FormData();
  formData.append("audio", blob);
  try {
    const res = await fetch("/api/recognize", { method: "POST", body: formData });
    const result = await res.json();

    if (!result.match) {
      statusText.textContent = "Nothing found";
      statusText.classList.remove("listening");
      if (matchResult) {
        matchTitle && (matchTitle.style.display = "none");
        matchArtist && (matchArtist.style.display = "none");
        matchNone && (matchNone.style.display = "block");
        matchResult.classList.add("visible");
      }
    } else {
      statusText.textContent = "Match found";
      statusText.classList.add("listening");
      if (matchResult) {
        matchNone && (matchNone.style.display = "none");
        matchTitle && (matchTitle.style.display = "block");
        matchArtist && (matchArtist.style.display = "block");
        if (matchTitle)  matchTitle.textContent  = result.match.title;
        if (matchArtist) matchArtist.textContent = result.match.artist;
        matchResult.classList.add("visible");
      }
    }
  } catch (err) {
    statusText.textContent = "Recognition failed";
    statusText.classList.remove("listening");
  }
}