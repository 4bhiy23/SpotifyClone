const playlists = [
  { id: 'late-night', name: 'Late Night Radio', songs: [
    { title: 'Afterglow', artist: 'Mila Gray', file: 'songs/late-night/afterglow.mp3', art: 'art-orange', duration: '3:42' },
    { title: 'Window Seat', artist: 'Orion Vale', file: 'songs/late-night/window-seat.mp3', art: 'art-indigo', duration: '4:08' },
    { title: 'Blue Hour', artist: 'Novi', file: 'songs/late-night/blue-hour.mp3', art: 'art-blue', duration: '3:18' },
    { title: 'Low Lights', artist: 'The Sunday Club', file: 'songs/late-night/low-lights.mp3', art: 'art-green', duration: '3:56' },
  ] },
  { id: 'focus', name: 'Focus, quietly', songs: [
    { title: 'Still Moving', artist: 'Northline', file: 'songs/focus/still-moving.mp3', art: 'art-blue', duration: '4:21' },
    { title: 'Paper Planes', artist: 'Mina Park', file: 'songs/focus/paper-planes.mp3', art: 'art-indigo', duration: '3:37' },
    { title: 'Small Hours', artist: 'Elliot Green', file: 'songs/focus/small-hours.mp3', art: 'art-green', duration: '4:02' },
  ] },
  { id: 'sunday', name: 'Sunday in June', songs: [
    { title: 'Peach Trees', artist: 'Honey Atlas', file: 'songs/sunday/peach-trees.mp3', art: 'art-orange', duration: '3:51' },
    { title: 'Easy Street', artist: 'Kite Season', file: 'songs/sunday/easy-street.mp3', art: 'art-green', duration: '3:12' },
    { title: 'Open Windows', artist: 'Lemon Parade', file: 'songs/sunday/open-windows.mp3', art: 'art-blue', duration: '4:16' },
  ] },
  { id: 'morning', name: 'Morning, again', songs: [
    { title: 'First Light', artist: 'Mara Bloom', file: 'songs/morning/first-light.mp3', art: 'art-green', duration: '3:26' },
    { title: 'Good News', artist: 'Sage Avenue', file: 'songs/morning/good-news.mp3', art: 'art-orange', duration: '3:44' },
  ] },
  { id: 'instrumental', name: 'Instrumental study', songs: [
    { title: 'Northbound', artist: 'Taro Fields', file: 'songs/instrumental/northbound.mp3', art: 'art-blue', duration: '5:10' },
    { title: 'Orbit', artist: 'Lumen Park', file: 'songs/instrumental/orbit.mp3', art: 'art-indigo', duration: '4:35' },
  ] },
  { id: 'old-favorites', name: 'Old favorites', songs: [
    { title: 'Golden Days', artist: 'The Coastline', file: 'songs/old-favorites/golden-days.mp3', art: 'art-orange', duration: '3:58' },
    { title: 'Cedar', artist: 'June on Film', file: 'songs/old-favorites/cedar.mp3', art: 'art-green', duration: '4:12' },
  ] },
];

const audio = document.querySelector('#audio-player');
const playlistList = document.querySelector('#playlist-list');
const trackList = document.querySelector('#track-list');
const playlistTitle = document.querySelector('#playlist-title');
const trackCount = document.querySelector('#track-count');
const playButton = document.querySelector('#play-button');
const heroPlay = document.querySelector('#hero-play');
const nowTitle = document.querySelector('#now-title');
const nowArtist = document.querySelector('#now-artist');
const nowArt = document.querySelector('#now-art');
const progressBar = document.querySelector('#progress-bar');
const currentTime = document.querySelector('#current-time');
const duration = document.querySelector('#duration');
let activePlaylist = playlists[0];
let currentIndex = 0;

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00';
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
}

function renderPlaylists() {
  playlistList.innerHTML = playlists.map((playlist) => `
    <button class="playlist-button ${playlist.id === activePlaylist.id ? 'selected' : ''}" type="button" data-playlist="${playlist.id}">
      <span class="playlist-dot" style="--playlist-color: ${playlist.color}"></span>${playlist.name}
    </button>
  `).join('');
}

function renderTracks() {
  playlistTitle.textContent = activePlaylist.name;
  trackCount.textContent = `${activePlaylist.songs.length} tracks`;
  trackList.innerHTML = activePlaylist.songs.map((song, index) => `
    <article class="track-row">
      <span class="track-number">${String(index + 1).padStart(2, '0')}</span>
      <div class="track-info">
        <div class="track-art ${song.art}">♪</div>
        <div><strong>${song.title}</strong><span>${song.artist}</span></div>
      </div>
      <span class="track-duration">${song.duration}</span>
      <button class="row-play" type="button" data-track="${index}" aria-label="Play ${song.title}">▶</button>
    </article>
  `).join('');
}

function loadTrack(index, shouldPlay = false) {
  currentIndex = (index + activePlaylist.songs.length) % activePlaylist.songs.length;
  const song = activePlaylist.songs[currentIndex];
  audio.src = song.file;
  nowTitle.textContent = song.title;
  nowArtist.textContent = song.artist;
  nowArt.className = `mini-art ${song.art}`;
  nowArt.textContent = '♪';
  progressBar.value = 0;
  currentTime.textContent = '0:00';
  duration.textContent = song.duration;
  if (shouldPlay) audio.play().catch(() => {});
  updatePlayButton();
}

function updatePlayButton() {
  const isPlaying = !audio.paused;
  playButton.textContent = isPlaying ? 'Ⅱ' : '▶';
  playButton.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
  heroPlay.innerHTML = isPlaying ? '<span>Ⅱ</span>' : '<span>▶</span>';
}

function togglePlay() {
  if (!audio.src) loadTrack(currentIndex);
  if (audio.paused) audio.play().catch(() => {}); else audio.pause();
}

playlistList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-playlist]');
  if (!button) return;
  activePlaylist = playlists.find((playlist) => playlist.id === button.dataset.playlist);
  renderPlaylists();
  renderTracks();
  loadTrack(0);
});

trackList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-track]');
  if (button) loadTrack(Number(button.dataset.track), true);
});

playButton.addEventListener('click', togglePlay);
heroPlay.addEventListener('click', togglePlay);
document.querySelector('#previous-button').addEventListener('click', () => loadTrack(currentIndex - 1, true));
document.querySelector('#next-button').addEventListener('click', () => loadTrack(currentIndex + 1, true));
audio.addEventListener('play', updatePlayButton);
audio.addEventListener('pause', updatePlayButton);
audio.addEventListener('ended', () => loadTrack(currentIndex + 1, true));
audio.addEventListener('timeupdate', () => {
  progressBar.value = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
  currentTime.textContent = formatTime(audio.currentTime);
});
audio.addEventListener('loadedmetadata', () => { duration.textContent = formatTime(audio.duration); });
progressBar.addEventListener('input', () => { if (audio.duration) audio.currentTime = (progressBar.value / 100) * audio.duration; });
document.querySelector('.volume-control input').addEventListener('input', (event) => { audio.volume = event.target.value / 100; });

renderPlaylists();
renderTracks();
loadTrack(0);

// ponytail: one browser self-check is enough for this teaching demo; add a test runner if the app grows.
console.assert(activePlaylist.songs.length > 0 && document.querySelectorAll('.playlist-button').length === playlists.length, 'Playlist setup should render.');
