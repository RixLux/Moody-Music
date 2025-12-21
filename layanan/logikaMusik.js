const path = require('path');
const { Innertube, UniversalCache } = require('youtubei.js');

// Konfigurasi
const CONFIG = {
    CACHE_DIR: path.join(__dirname, '.cache'),
    MAX_RESULTS: 3,
    CLIENT_TYPE: 'ANDROID'
};

// Menggunakan Array untuk variasi query agar tidak monoton
const MOOD_MAP = {
    senang: ['happy upbeat pop hits', 'feel good summer hits', 'positive energy pop'],
    sedih: ['sad emotional ballad', 'melancholy piano songs', 'sad acoustic covers'],
    marah: ['aggressive metal rock', 'hardcore punk energetic', 'aggressive phonk music', 'heavy nu-metal'],
    santai: ['lofi chill beats relaxing', 'smooth jazz cafe', 'acoustic chill vibe'],
    galau: ['deep emotional heartbreak', 'slow sad indie', 'songs for broken heart'],
    semangat: ['gym motivation energetic', 'high energy phonk', 'epic workout music']
};

let yt;
let siap = false;

/**
 * Inisialisasi YouTube Instance
 */
const initYoutube = async () => {
    try {
        yt = await Innertube.create({ 
            client_type: CONFIG.CLIENT_TYPE, 
            cache: new UniversalCache(true, CONFIG.CACHE_DIR) 
        });
        siap = true;
        console.log('✅ [YouTubei.js] Recommendation Engine Ready with Randomizer');
    } catch (err) {
        console.error('❌ Gagal Inisialisasi YouTubei:', err);
    }
};

initYoutube();

/**
 * Fungsi Utama Rekomendasi
 */
const dapatkanRekomendasi = async (moodPengguna) => {
    if (!siap || !yt) {
        return { pesan: 'Bot masih pemanasan sebentar ya 🎧', daftar_lagu: [] };
    }

    const mood = moodPengguna.toLowerCase();
    
    // Pilih sub-mood secara acak dari MOOD_MAP
    let baseQuery;
    if (MOOD_MAP[mood]) {
        const subMoods = MOOD_MAP[mood];
        baseQuery = subMoods[Math.floor(Math.random() * subMoods.length)];
    } else {
        baseQuery = `${moodPengguna} music`;
    }

    // Tambahkan variasi kata kunci tambahan agar hasil pencarian berbeda
    const variasi = ['mix', 'popular', 'latest', 'trending', 'hits'];
    const randomSuffix = variasi[Math.floor(Math.random() * variasi.length)];
    const finalQuery = `${baseQuery} ${randomSuffix}`;

    try {
        const search = await yt.music.search(finalQuery, { type: 'song' });
        
        const shelf = search.contents?.find(c => c.type === 'MusicShelf') || search.contents?.[0];
        const hasil = shelf?.contents || [];

        // Map semua hasil terlebih dahulu
        let lagu = hasil
            .map(song => {
                const artistName = song.artists?.map(a => a.name).join(', ') || 'Various Artists';
                const videoId = song.id || song.videoId;

                if (!videoId) return null;

                return {
                    judul: song.title || "Unknown Title",
                    artis: artistName,
                    id_youtube: videoId,
                    url: `https://www.youtube.com/watch?v=${videoId}`
                };
            })
            .filter(Boolean);

        // STRATEGI RANDOM: Acak urutan array (Fisher-Yates Shuffle)
        for (let i = lagu.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [lagu[i], lagu[j]] = [lagu[j], lagu[i]];
        }

        // Ambil hasil sesuai limit (3 lagu)
        const laguTerpilih = lagu.slice(0, CONFIG.MAX_RESULTS);

        if (laguTerpilih.length === 0) {
            return {
                pesan: `Aku belum nemu lagu yang cocok buat mood "${mood}" 😕`,
                daftar_lagu: []
            };
        }

        return {
            pesan: `Ini ${laguTerpilih.length} lagu pilihan buat mood "${mood}" kamu (Random Mode):`,
            daftar_lagu: laguTerpilih
        };

    } catch (err) {
        console.error('[YouTubei.js ERROR]', err);
        return {
            pesan: 'Terjadi kesalahan saat mencari lagu 😢',
            daftar_lagu: []
        };
    }
};

module.exports = { dapatkanRekomendasi };
