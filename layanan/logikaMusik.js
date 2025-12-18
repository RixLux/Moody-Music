const YTMusic = require('ytmusic-api');

const ytmusic = new YTMusic();
let siap = false;

(async () => {
  await ytmusic.initialize();
  siap = true;
  console.log('[YTMusic] ready');
})();

// mapping mood → keyword (opsional tapi penting)
const keywordMood = {
  senang: 'happy upbeat song',
  sedih: 'sad emotional song',
  marah: 'angry rock song',
  santai: 'chill relaxing song'
};

const dapatkanRekomendasi = async (moodPengguna) => {
  if (!siap) {
    return {
      pesan: 'Bot masih pemanasan sebentar ya 🎧',
      daftar_lagu: []
    };
  }

  const mood = moodPengguna.toLowerCase();
  const query = keywordMood[mood] || mood;

  try {
    const hasil = await ytmusic.search(query, 'song');

    const lagu = hasil
      .filter(l => l.videoId)
      .slice(0, 3)
      .map(l => ({
        judul: `${l.name} - ${l.artist?.name || 'Unknown'}`,
        id_youtube: l.videoId
      }));

    if (lagu.length === 0) {
      return {
        pesan: `Aku belum nemu lagu yang cocok buat mood "${mood}" 😕`,
        daftar_lagu: []
      };
    }

    return {
      pesan: `Ini lagu yang cocok buat mood "${mood}" kamu 🎶`,
      daftar_lagu: lagu
    };

  } catch (err) {
    console.error('[YTMusic ERROR]', err);
    return {
      pesan: 'Terjadi kesalahan saat mencari lagu 😢',
      daftar_lagu: []
    };
  }
};

module.exports = { dapatkanRekomendasi };

