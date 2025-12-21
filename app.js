const express = require('express');
const cors = require('cors');
const YTMusicApi = require('ytmusic-api');

const app = express();
app.use(cors());
app.use(express.json());

// Penanganan import yang lebih aman
const YTMusic = YTMusicApi.default || YTMusicApi;
const ytmusic = new YTMusic();

let isInitialized = false;

// Inisialisasi API dengan penanganan error
async function init() {
    try {
        await ytmusic.initialize();
        isInitialized = true;
        console.log('✅ YT Music API berhasil diinisialisasi');
    } catch (err) {
        console.error('❌ Gagal inisialisasi API:', err);
    }
}
init();

// Middleware untuk memastikan API siap
app.use((req, res, next) => {
    if (!isInitialized) {
        return res.status(503).send("API sedang bersiap, coba lagi nanti.");
    }
    next();
});

app.get('/api/search', async (req, res) => {
    const { q } = req.query;
    try {
        const results = await ytmusic.searchSongs(q);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: "Gagal mencari lagu" });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server berjalan di http://localhost:${PORT}`));
