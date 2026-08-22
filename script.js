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
  const audio = new AudioContext();
  const now = audio.currentTime;
  const notes = [261.63, 329.63, 392.0, 523.25, 392.0, 329.63, 261.63];

  notes.forEach((freq, i) => {
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, now + i * 0.18);
    gain.gain.linearRampToValueAtTime(0.12, now + i * 0.18 + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.18 + 0.42);
    osc.connect(gain);
    gain.connect(audio.destination);
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

const portrait = document.getElementById("subaru-portrait");
const theme = document.getElementById("theme");

portrait.addEventListener("click", async () => {
  portrait.classList.add("playing");
  showToast("You truly are an amazing guy, Natsuki Subaru");

  try {
    theme.currentTime = 0;
    await theme.play();
  } catch {
    playSynth();
  }

  window.setTimeout(() => portrait.classList.remove("playing"), 1600);
});

const audio = document.getElementById('bg-music');

// Set volume (0.0 is silent, 1.0 is max; 0.15 is roughly 15% volume)
audio.volume = 0.5;

// Function to handle play attempt
function playAudio() {
  audio.play().then(() => {
    // Autoplay started successfully
    document.removeEventListener('click', playAudio);
    document.removeEventListener('keydown', playAudio);
  }).catch((error) => {
    // Autoplay was blocked by the browser
    console.log("Autoplay blocked. Waiting for user interaction.");
  });
}

// Attempt to play immediately
playAudio();

// Fallback: If blocked, play as soon as the user clicks or presses a key anywhere
document.addEventListener('click', playAudio, { once: true });
document.addEventListener('keydown', playAudio, { once: true });

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

castNav.addEventListener('wheel', (e) => {
  // If the user is scrolling vertically, prevent default vertical scroll
  // and scroll the container horizontally instead
  if (e.deltaY !== 0) {
    e.preventDefault();
    castNav.scrollLeft += e.deltaY;
  }
}, { passive: false });