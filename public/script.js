const audio = document.getElementById('audioElement');
let songQueue = [];
let currentSongIndex = -1;
let isShuffle = false;
let isRepeat = false;
let isFullscreen = false;

// --- CORE FUNCTIONS ---

async function searchMusic() {
    const query = document.getElementById('searchInput').value;
    if(!query) return;

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<p class="col-span-full text-center">Mencari...</p>';

    try {
        const res = await fetch(`/api/search?q=${query}`);
        const data = await res.json();
        songQueue = data;
        
        resultsDiv.innerHTML = data.map((song, index) => `
            <div class="bg-zinc-800/50 p-4 rounded-lg hover:bg-zinc-800 transition cursor-pointer group" 
                 onclick="playSongByIndex(${index})">
                <div class="relative mb-4">
                    <img src="${song.thumbnails[0].url}" class="w-full aspect-square object-cover rounded shadow-md">
                    <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div class="bg-red-600 p-3 rounded-full shadow-xl">
                            <i class="fas fa-play text-white"></i>
                        </div>
                    </div>
                </div>
                <h3 class="font-bold truncate text-sm">${song.name}</h3>
                <p class="text-xs text-zinc-400 mt-1">${song.artist.name}</p>
            </div>
        `).join('');
    } catch (err) {
        resultsDiv.innerHTML = '<p class="col-span-full text-center text-red-500">Gagal memuat data.</p>';
    }
}

async function playSongByIndex(index) {
    if (index < 0 || index >= songQueue.length) return;
    currentSongIndex = index;
    const song = songQueue[index];
    
    // Update UI Desktop
    document.getElementById('currentTitle').innerText = song.name;
    document.getElementById('currentArtist').innerText = song.artist.name;
    document.getElementById('currentThumb').src = song.thumbnails[0].url;
    
    // Update UI Fullscreen
    document.getElementById('fsTitle').innerText = song.name;
    document.getElementById('fsArtist').innerText = song.artist.name;
    document.getElementById('fsThumb').src = song.thumbnails[0].url;

    try {
        const response = await fetch(`/api/stream?id=${song.videoId}`);
        const data = await response.json();

        if (data.url) {
            audio.src = data.url;
            audio.play();
            updatePlayIcons(true);
        } else {
            alert("Gagal memutar stream.");
        }
    } catch (err) {
        console.error("Fetch error:", err);
    }
}

function togglePlay(e) {
    if (e) e.stopPropagation();
    if (!audio.src) return;
    if (audio.paused) {
        audio.play();
        updatePlayIcons(true);
    } else {
        audio.pause();
        updatePlayIcons(false);
    }
}

function updatePlayIcons(isPlaying) {
    const icon = isPlaying ? 'fas fa-pause' : 'fas fa-play ml-1';
    const mobIcon = isPlaying ? 'fas fa-pause' : 'fas fa-play';
    document.getElementById('playIcon').className = icon;
    document.getElementById('mobPlayIcon').className = mobIcon;
    document.getElementById('fsPlayIcon').className = isPlaying ? 'fas fa-pause' : 'fas fa-play ml-1';
}

// --- NAVIGATION ---

function nextSong(e) {
    if (e) e.stopPropagation();
    if (isRepeat) {
        playSongByIndex(currentSongIndex);
    } else if (isShuffle) {
        playSongByIndex(Math.floor(Math.random() * songQueue.length));
    } else {
        if (currentSongIndex < songQueue.length - 1) playSongByIndex(currentSongIndex + 1);
    }
}

function prevSong(e) {
    if (e) e.stopPropagation();
    if (currentSongIndex > 0) playSongByIndex(currentSongIndex - 1);
}

function toggleShuffle(e) {
    if (e) e.stopPropagation();
    isShuffle = !isShuffle;
    const color = isShuffle ? 'text-red-500' : 'text-zinc-400';
    document.getElementById('shuffleBtn').className = `${color} transition`;
    document.getElementById('fsShuffleBtn').className = `text-xl ${color}`;
}

function toggleRepeat(e) {
    if (e) e.stopPropagation();
    isRepeat = !isRepeat;
    const color = isRepeat ? 'text-red-500' : 'text-zinc-400';
    document.getElementById('repeatBtn').className = `${color} transition`;
    document.getElementById('fsRepeatBtn').className = `text-xl ${color}`;
}

// --- FULLSCREEN LOGIC ---

function toggleFullscreen() {
    const fs = document.getElementById('fullscreenPlayer');
    const bottomNav = document.querySelector('nav.md\\:hidden'); 
    
    isFullscreen = !isFullscreen;
    
    if (isFullscreen) {
        fs.classList.remove('translate-y-full');
        if(bottomNav) bottomNav.classList.add('hidden');
    } else {
        fs.classList.add('translate-y-full');
        if(bottomNav) bottomNav.classList.remove('hidden');
    }
}

window.onpopstate = function(event) {
    if (isFullscreen) {
        toggleFullscreen();
    }
};

function handleFooterClick(e) {
    if (window.innerWidth < 768) {
        if (!e.target.closest('button') && !e.target.closest('input')) {
            toggleFullscreen();
        }
    }
}

// --- PROGRESS & VOLUME ---

audio.ontimeupdate = () => {
    if (!audio.duration) return;
    const progress = (audio.currentTime / audio.duration) * 100;
    
    document.getElementById('progressBar').value = progress;
    document.getElementById('fsProgressBar').value = progress;
    
    const current = formatTime(audio.currentTime);
    const duration = formatTime(audio.duration);
    
    document.getElementById('currTime').innerText = current;
    document.getElementById('durTime').innerText = duration;
    document.getElementById('fsCurrTime').innerText = current;
    document.getElementById('fsDurTime').innerText = duration;
};

function handleSeek(e) {
    const seekTime = (e.target.value / 100) * audio.duration;
    audio.currentTime = seekTime;
}

document.getElementById('progressBar').oninput = handleSeek;
document.getElementById('fsProgressBar').oninput = handleSeek;

const volSlider = document.getElementById('volSlider');
volSlider.oninput = (e) => audio.volume = e.target.value;

audio.onended = () => nextSong();

function formatTime(secs) {
    if (isNaN(secs)) return "0:00";
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
}

// Keyboard & Search Events
document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchMusic();
});

window.addEventListener('keydown', (e) => {
    const isTyping = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';
    if (isTyping) return;

    if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
    } else if (e.code === "ArrowRight") {
        nextSong();
    } else if (e.code === "ArrowLeft") {
        prevSong();
    }
});

if ('mediaSession' in navigator) {
    navigator.mediaSession.setActionHandler('play', () => togglePlay());
    navigator.mediaSession.setActionHandler('pause', () => togglePlay());
    navigator.mediaSession.setActionHandler('nexttrack', () => nextSong());
    navigator.mediaSession.setActionHandler('previoustrack', () => prevSong());
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const showBtn = document.getElementById('showSidebarBtn');
    
    if (sidebar.classList.contains('md:flex')) {
        sidebar.classList.remove('md:flex');
        sidebar.classList.add('hidden');
        showBtn.classList.remove('hidden');
        showBtn.classList.add('md:block');
    } else {
        sidebar.classList.remove('hidden');
        sidebar.classList.add('md:flex');
        showBtn.classList.remove('md:block');
        showBtn.classList.add('hidden');
    }
}

// --- RESET ON REFRESH ---

window.addEventListener('load', () => {
    // Reset Input Pencarian
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }

    // Reset Progress Bar (Desktop & Fullscreen)
    const progressBar = document.getElementById('progressBar');
    const fsProgressBar = document.getElementById('fsProgressBar');
    
    if (progressBar) progressBar.value = 0;
    if (fsProgressBar) fsProgressBar.value = 0;

    // Reset teks waktu (Opsional)
    const timeElements = ['currTime', 'durTime', 'fsCurrTime', 'fsDurTime'];
    timeElements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = (id.includes('dur')) ? '0:00' : '0:00';
    });
});
