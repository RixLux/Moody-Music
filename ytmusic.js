const express = require('express');
const path = require('path');
const cors = require('cors');
const { Innertube,UniversalCache } = require('youtubei.js');

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

let yt;

// Inisialisasi YouTubei.js
async function initYT() {
    try {
        yt = await Innertube.create({ 
            client_type: 'ANDROID',
            // Tambahkan bagian cache ini:
            cache: new UniversalCache(true, path.join(__dirname, '.cache'))
        });
        console.log('✅ YouTubei.js Ready (Cache stored in .cache/)');
    } catch (err) {
        console.error('❌ Gagal Inisialisasi YouTubei:', err);
    }
}
initYT();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint Search menggunakan YouTubei (Mode Music)
app.get('/api/search', async (req, res) => {
    const { q } = req.query;
    if (!yt) return res.status(503).send("Server belum siap");
    
    try {
        // Mencari khusus di kategori Music
        const search = await yt.music.search(q, { type: 'song' });
        
        // Format agar sesuai dengan frontend lama kita
        const results = search.contents[0].contents.map(song => ({
            videoId: song.id,
            name: song.title,
            artist: { name: song.artists[0]?.name || 'Unknown Artist' },
            thumbnails: [{ url: song.thumbnails[0]?.url }]
        }));
        
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Gagal mencari lagu" });
    }
});

// Endpoint Stream menggunakan YouTubei
app.get('/api/stream', async (req, res) => {
    const { id } = req.query;
    if (!yt) return res.status(503).send("Server belum siap");

    try {
        console.log(`[Stream] Mengambil info untuk: ${id}`);
        const info = await yt.getBasicInfo(id);
        
        // Memilih format audio saja dengan filter yang lebih spesifik
        const format = info.chooseFormat({ 
            type: 'audio', 
            quality: 'best',
            format: 'mp4' // mp4 biasanya lebih stabil untuk decipher
        });

        if (!format) {
            throw new Error("Format audio tidak ditemukan");
        }

        // YouTubei.js: Cek apakah perlu decipher atau URL sudah ada
        // Menggunakan metode yang lebih aman untuk mengambil URL
        let url;
        if (format.signature_cipher || format.cipher) {
            url = format.decipher(yt.session.player);
        } else {
            url = format.url;
        }

        if (!url) throw new Error("Gagal mendapatkan URL audio");

        console.log(`[Stream] URL berhasil dikirim`);
        res.json({ url });
    } catch (err) {
        console.error('❌ Streaming Error:', err.message);
        // Kirim error JSON agar frontend tidak bingung, dan jangan biarkan server crash
        res.status(500).json({ error: "Gagal ambil stream", message: err.message });
    }
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Moody Music running at http://localhost:${PORT}`);
});
