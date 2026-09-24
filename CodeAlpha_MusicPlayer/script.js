const tracks = [
  {
    title: "Letters I Never Sent",
    artist: "Northbound Stories",
    label: "LI",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
  },
  {
    title: "Small Things",
    artist: "Mira Vale",
    label: "ST",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3"
  },
  {
    title: "Porchlight Memories",
    artist: "Marlowe & Fen",
    label: "PM",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
  },
  {
    title: "Keep Your Head Up",
    artist: "Nadia Voss",
    label: "KH",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3"
  },
  {
    title: "Home Before Morning",
    artist: "Iris Delacroix",
    label: "HM",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3"
  }
];

let currentIndex = 0;
let isPlaying = false;
let autoplay = true;
let shuffle = false;
let history = [0]; // for stepping "back" through shuffled picks
const durations = Array(tracks.length).fill(0);

const audio = new Audio();
audio.volume = 0.7;

// Elements
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const vinyl = document.getElementById('vinyl');
const tonearm = document.getElementById('tonearm');
const label = document.getElementById('label');
const trackTitle = document.getElementById('trackTitle');
const trackArtist = document.getElementById('trackArtist');
const trackCount = document.getElementById('trackCount');
const curTime = document.getElementById('curTime');
const durTime = document.getElementById('durTime');
const progressFill = document.getElementById('progressFill');
const progressKnob = document.getElementById('progressKnob');
const grooveTrack = document.getElementById('grooveTrack');
const volumeSlider = document.getElementById('volumeSlider');
const autoplayToggle = document.getElementById('autoplayToggle');
const playlistEl = document.getElementById('playlist');
const statusText = document.getElementById('statusText');
const queueSummary = document.getElementById('queueSummary');

const ICON_PLAY = '<path d="M8 5v14l11-7z"/>';
const ICON_PAUSE = '<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>';

function formatTime(sec){
  if (!isFinite(sec) || isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function updateQueueSummary(){
  const total = durations.reduce((sum, duration) => sum + duration, 0);
  const loadedCount = durations.filter(Boolean).length;
  queueSummary.textContent = `${tracks.length} records / ${loadedCount === tracks.length ? formatTime(total) : 'loading...'}`;
}

function resetProgress(){
  progressFill.style.width = '0%';
  progressKnob.style.left = '0%';
  grooveTrack.setAttribute('aria-valuenow', '0');
  curTime.textContent = '0:00';
  durTime.textContent = '0:00';
}

function renderPlaylist(){
  playlistEl.innerHTML = "";
  tracks.forEach((t, i) => {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'track' + (i === currentIndex ? ' active' : '');
    row.setAttribute('aria-label', `Play ${t.title} by ${t.artist}`);
    row.innerHTML = `
      <span class="idx">${i === currentIndex && isPlaying
        ? '<span class="bars"><span></span><span></span><span></span></span>'
        : (i + 1)}</span>
      <div class="meta">
        <div class="t">${t.title}</div>
        <div class="a">${t.artist}</div>
      </div>
      <span class="len" data-len="${i}">--:--</span>
    `;
    row.addEventListener('click', () => loadTrack(i, true, true));
    playlistEl.appendChild(row);
  });
}

function loadTrack(index, autoStart, resetHistory){
  currentIndex = (index + tracks.length) % tracks.length;
  if (resetHistory) history = [currentIndex];
  const t = tracks[currentIndex];
  audio.src = t.src;
  trackTitle.textContent = t.title;
  trackArtist.textContent = t.artist;
  label.innerHTML = t.label.slice(0,2).toUpperCase() + "<br>45";
  trackCount.textContent = `${currentIndex + 1} / ${tracks.length}`;
  resetProgress();
  renderPlaylist();
  if (autoStart) {
    audio.play().catch(() => {});
  }
}

function goNext(){
  if (shuffle && tracks.length > 1) {
    let next;
    do { next = Math.floor(Math.random() * tracks.length); } while (next === currentIndex);
    history.push(next);
    loadTrack(next, true, false);
  } else {
    loadTrack(currentIndex + 1, true, true);
  }
}

function goPrev(){
  if (shuffle && history.length > 1) {
    history.pop();
    const back = history[history.length - 1];
    loadTrack(back, true, false);
  } else {
    loadTrack(currentIndex - 1, true, true);
  }
}

function setPlayingState(playing){
  isPlaying = playing;
  playIcon.innerHTML = playing ? ICON_PAUSE : ICON_PLAY;
  playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
  statusText.textContent = playing ? 'now playing' : 'ready to listen';
  vinyl.classList.toggle('spinning', playing);
  tonearm.classList.toggle('down', playing);
  renderPlaylist();
}

playBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play().catch(() => {});
  } else {
    audio.pause();
  }
});

prevBtn.addEventListener('click', goPrev);
nextBtn.addEventListener('click', goNext);

shuffleBtn.addEventListener('click', () => {
  shuffle = !shuffle;
  shuffleBtn.classList.toggle('on', shuffle);
  shuffleBtn.setAttribute('aria-pressed', shuffle);
  history = [currentIndex];
});

audio.addEventListener('play', () => setPlayingState(true));
audio.addEventListener('pause', () => setPlayingState(false));

audio.addEventListener('loadedmetadata', () => {
  durations[currentIndex] = audio.duration;
  durTime.textContent = formatTime(audio.duration);
  const lenEl = playlistEl.querySelector(`[data-len="${currentIndex}"]`);
  if (lenEl) lenEl.textContent = formatTime(audio.duration);
  updateQueueSummary();
});

audio.addEventListener('error', () => {
  setPlayingState(false);
  statusText.textContent = 'audio unavailable';
});

audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  updateProgress(pct / 100);
  curTime.textContent = formatTime(audio.currentTime);
});

audio.addEventListener('ended', () => {
  if (autoplay) {
    goNext();
  } else {
    setPlayingState(false);
  }
});

// Seek by clicking/dragging the groove track
function seekFromEvent(e){
  const rect = grooveTrack.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const pct = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  if (audio.duration) {
    audio.currentTime = pct * audio.duration;
    updateProgress(pct);
  }
}

function updateProgress(pct){
  const percentage = pct * 100;
  progressFill.style.width = percentage + '%';
  progressKnob.style.left = percentage + '%';
  grooveTrack.setAttribute('aria-valuenow', Math.round(percentage));
}

grooveTrack.addEventListener('keydown', (e) => {
  if (!audio.duration || !['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
  e.preventDefault();
  const step = e.key === 'ArrowRight' ? 5 : -5;
  const pct = Math.min(100, Math.max(0, Number(grooveTrack.getAttribute('aria-valuenow')) + step));
  audio.currentTime = (pct / 100) * audio.duration;
  updateProgress(pct / 100);
});

let seeking = false;
grooveTrack.addEventListener('mousedown', (e) => { seeking = true; seekFromEvent(e); });
window.addEventListener('mousemove', (e) => { if (seeking) seekFromEvent(e); });
window.addEventListener('mouseup', () => seeking = false);
grooveTrack.addEventListener('touchstart', (e) => { seeking = true; seekFromEvent(e); });
window.addEventListener('touchmove', (e) => { if (seeking) seekFromEvent(e); });
window.addEventListener('touchend', () => seeking = false);

// Volume
function setVolume(v){
  v = Math.min(100, Math.max(0, Number(v)));
  volumeSlider.value = v;
  audio.volume = v / 100;
  volumeSlider.style.background = `linear-gradient(90deg, var(--gold) 0%, var(--gold) ${v}%, var(--panel-edge) ${v}%, var(--panel-edge) 100%)`;
}
volumeSlider.addEventListener('input', (e) => setVolume(e.target.value));

// Autoplay toggle
autoplayToggle.addEventListener('click', () => {
  autoplay = !autoplay;
  autoplayToggle.classList.toggle('on', autoplay);
  autoplayToggle.setAttribute('aria-pressed', autoplay);
});

// Keyboard shortcuts
window.addEventListener('keydown', (e) => {
  // Ignore shortcuts while typing in a form field
  if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName) || document.activeElement === grooveTrack) return;

  switch (e.code) {
    case 'Space':
      e.preventDefault();
      audio.paused ? audio.play().catch(() => {}) : audio.pause();
      break;
    case 'ArrowRight':
      goNext();
      break;
    case 'ArrowLeft':
      goPrev();
      break;
    case 'ArrowUp':
      e.preventDefault();
      setVolume(Number(volumeSlider.value) + 5);
      break;
    case 'ArrowDown':
      e.preventDefault();
      setVolume(Number(volumeSlider.value) - 5);
      break;
    case 'KeyS':
      shuffleBtn.click();
      break;
  }
});

// Preload durations for playlist display
tracks.forEach((t, i) => {
  const probe = new Audio();
  probe.preload = "metadata";
  probe.src = t.src;
  probe.addEventListener('loadedmetadata', () => {
    durations[i] = probe.duration;
    const lenEl = playlistEl.querySelector(`[data-len="${i}"]`);
    if (lenEl) lenEl.textContent = formatTime(probe.duration);
    updateQueueSummary();
  });
});

// Init
loadTrack(0, false, true);
updateQueueSummary();
