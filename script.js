const snow = document.getElementById("snow");
const ctx = snow.getContext("2d");
const flakes = Array.from({ length: 70 }, () => ({
  x: Math.random(),
  y: Math.random(),
  r: Math.random() * 1.6 + 0.4,
  s: Math.random() * 0.35 + 0.12,
  a: Math.random() * 0.4 + 0.15,
}));

function sizeCanvas() {
  snow.width = window.innerWidth;
  snow.height = window.innerHeight;
}

function drawSnow() {
  ctx.clearRect(0, 0, snow.width, snow.height);
  flakes.forEach((f) => {
    f.y += f.s / 180;
    f.x += Math.sin(f.y * 8) * 0.0004;
    if (f.y > 1) f.y = 0;
    ctx.beginPath();
    ctx.fillStyle = `rgba(230, 225, 255, ${f.a})`;
    ctx.arc(f.x * snow.width, f.y * snow.height, f.r, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(drawSnow);
}

sizeCanvas();
window.addEventListener("resize", sizeCanvas);
drawSnow();

document.querySelectorAll(".portrait img").forEach((img) => {
  img.addEventListener("error", () => {
    img.style.display = "none";
    img.parentElement.classList.add("no-art");
  });
});

function playSynth() {
  const audioCtx = new AudioContext();
  const now = audioCtx.currentTime;
  const notes = [261.63, 329.63, 392.0, 523.25, 392.0, 329.63, 261.63];

  notes.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, now + i * 0.18);
    gain.gain.linearRampToValueAtTime(0.12, now + i * 0.18 + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.18 + 0.42);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now + i * 0.18);
    osc.stop(now + i * 0.18 + 0.45);
  });
}

function showToast(text) {
  const toast = document.getElementById("toast");
  toast.textContent = text;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2800);
}

// Audio Elements
const bgMusic = document.getElementById('bg-music');
const theme = document.getElementById("theme");
const portrait = document.getElementById("subaru-portrait");

// Set background volume
bgMusic.volume = 0.5;

// Function to handle background music play attempt
function playAudio() {
  bgMusic.play().then(() => {
    document.removeEventListener('click', playAudio);
    document.removeEventListener('keydown', playAudio);
  }).catch((error) => {
    console.log("Autoplay blocked. Waiting for user interaction.");
  });
}

// Attempt to play background music immediately or on first click/key press
playAudio();
document.addEventListener('click', playAudio, { once: true });
document.addEventListener('keydown', playAudio, { once: true });

// Subaru Portrait Click Event (Pauses bg-music while playing theme)
portrait.addEventListener("click", async () => {
  portrait.classList.add("playing");
  showToast("You truly are an amazing guy, Natsuki Subaru");

  // Pause background music if playing
  if (!bgMusic.paused) {
    bgMusic.pause();
  }

  try {
    theme.currentTime = 0;
    await theme.play();
  } catch {
    playSynth();
  }

  window.setTimeout(() => portrait.classList.remove("playing"), 1600);
});

// Resume background music when theme finishes playing
theme.addEventListener("ended", () => {
  bgMusic.play().catch(err => console.log(err));
});

function filterCards() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const cards = document.querySelectorAll('.card');

  cards.forEach(card => {
    const text = card.textContent.toLowerCase();
    if (text.includes(query)) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

const castNav = document.querySelector('.cast-nav');

if (castNav) {
  castNav.addEventListener('wheel', (e) => {
    if (e.deltaY !== 0) {
      e.preventDefault();
      castNav.scrollLeft += e.deltaY;
    }
  }, { passive: false });
}
