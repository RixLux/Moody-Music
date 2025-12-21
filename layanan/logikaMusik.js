const path = require('path');
const { Innertube, UniversalCache } = require('youtubei.js');

let yt;
let siap = false;

// Inisialisasi menggunakan logika YouTubei.js yang kamu kirim
(async () => {
    try {
        yt = await Innertube.create({ 
            client_type: 'ANDROID',
            cache: new UniversalCache(true, path.join(__dirname, '.cache'))
        });
        siap = true;
        console.log('✅ [YouTubei.js] Recommendation Engine Ready');
    } catch (err) {
        console.error('❌ Gagal Inisialisasi YouTubei:', err);
    }
})();

const keywordMood = {
    senang: 'happy upbeat song',
    sedih: 'sad emotional song',
    marah: 'angry rock song',
    santai: 'chill relaxing song'
};

const dapatkanRekomendasi = async (moodAtauJudul) => {
    if (!siap || !yt) {
        return { pesan: 'Bot masih pemanasan... 🎧', daftar_lagu: [] };
    }

    
    const moodClean = moodAtauJudul.toLowerCase();
    
    let queryPencarian;
    if (keywordMood[moodClean]) {
        // Jika input adalah mood (senang, sedih, dll)
        queryPencarian = keywordMood[moodClean];
    } else {
        // Jika input adalah permintaan spesifik (misal: "Aimer", "Lagu Rock", dll)
        // Kita tambahkan kata "song" agar hasilnya bukan video durasi panjang/playlist
        queryPencarian = `${moodAtauJudul}`;
    }

    try {
        console.log(`🔎 Mencari di YouTube Music: ${queryPencarian}`);
        
        const search = await yt.music.search(queryPencarian, { type: 'song' });
        
        // YouTubei.js terkadang mengembalikan struktur berbeda, kita buat lebih aman
        const hasil = search.contents[0]?.contents || [];

        const lagu = hasil
            .slice(0, 3)
            .map(song => ({
                judul: `${song.title} - ${song.artists?.[0]?.name || 'Artist Unknown'}`,
                id_youtube: song.id || song.videoId
            }))
            .filter(l => l.id_youtube); // Pastikan ada ID-nya

        return {
            pesan: `Ini beberapa lagu yang cocok buat kamu 🎶`,
            daftar_lagu: lagu
        };

    } catch (err) {
        console.error('[YouTubei.js ERROR]', err);
        return { pesan: 'Gagal mencari lagu 😢', daftar_lagu: [] };
    }
};

module.exports = { dapatkanRekomendasi };
