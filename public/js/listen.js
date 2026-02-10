let mediaRecorder;
let audioChunks = [];
let isRecording = false;
let audioCtx;
let analyser;
let source;
let dataArray;
let animationId;
const pulseDot = document.getElementById("micPulse");
const micBtn = document.getElementById("micBtn");
const statusText = document.getElementById("recStatus");
const canvas = document.getElementById("waveCanvas");
const base = canvas.height / 2;
const ctx = canvas.getContext("2d");
micBtn.addEventListener("click", () => {
  if(!isRecording) 
    startRecording();
  else 
    stopRecording();
});
async function startRecording(){
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
    pulseDot.classList.add("active");
    statusText.textContent = "Listening…";
    mediaRecorder.start();
    drawFrequencyBars();
    setTimeout(() => {
      if (isRecording) stopRecording();
    }, 10000);
  } catch (err) {
    console.error("Mic error:", err);
    statusText.textContent = "Microphone access denied";
  }
}
function drawBaseline() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.strokeStyle = "#C10206";
  ctx.lineWidth = 2;
  ctx.moveTo(0,base);
  ctx.lineTo(canvas.width,base);
  ctx.stroke();
}
drawBaseline();
function stopRecording() {
  if (!mediaRecorder) 
    return;
  mediaRecorder.onstop = () => {
    const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
    cancelAnimationFrame(animationId);
    clearCanvas();
    drawBaseline();
    pulseDot.classList.remove("active");
    micBtn.src = "images/mic.svg";
    statusText.textContent = "Audio captured";
    isRecording = false;
    console.log("Recorded audio blob:", audioBlob);
    playback(audioBlob);
  };
  mediaRecorder.stop();
  audioCtx.close();
}
function drawFrequencyBars() {
  animationId = requestAnimationFrame(drawFrequencyBars);
  analyser.getByteFrequencyData(dataArray);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const barCount = 48;
  const barWidth = canvas.width / barCount;
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#ee142d");
  gradient.addColorStop(1, "#C10206");
  ctx.fillStyle = gradient;
  for (let i = 0; i < barCount; i++) {
    const value = dataArray[i];
    const barHeight = (value / 255) * (canvas.height / 2);
    const x = i * barWidth;
    const y = base - barHeight;
    ctx.fillRect(
      x + 2,
      y,
      barWidth - 4,
      barHeight
    );
  }
}
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function playback(blob) {
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  audio.volume = 0.5;
  audio.play();
}