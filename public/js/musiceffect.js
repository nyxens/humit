const container = document.getElementById("musiceffect");
const notes = ["♪", "♫", "♩", "♬"];

function createMusicNote() {
  if (!container) return;

  // avoid the centre 40% of the screen where the mic and orbits live
  const safeZoneLeft  = window.innerWidth  * 0.30;
  const safeZoneRight = window.innerWidth  * 0.70;
  const safeZoneTop   = window.innerHeight * 0.20;
  const safeZoneBott  = window.innerHeight * 0.85;

  let x, y, attempts = 0;
  do {
    x = Math.random() * window.innerWidth;
    y = Math.random() * window.innerHeight;
    attempts++;
  } while (
    x > safeZoneLeft && x < safeZoneRight &&
    y > safeZoneTop  && y < safeZoneBott  &&
    attempts < 20
  );

  const note = document.createElement("div");
  note.className = "musicnote";
  note.textContent = notes[Math.floor(Math.random() * notes.length)];
  note.style.left     = `${x}px`;
  note.style.top      = `${y}px`;
  note.style.fontSize = `${24 + Math.random() * 16}px`;

  container.appendChild(note);
  setTimeout(() => note.remove(), 2500);
}

setInterval(createMusicNote, 600);