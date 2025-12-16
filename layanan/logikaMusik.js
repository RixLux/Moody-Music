// Data musik dengan ID Youtube
// ID adalah kode unik di belakang link youtube (misal: v=y6Sxv-sUYtM)
const daftarMusik = {
    "senang": [
        { judul: "Pharrell Williams - Happy", id_youtube: "ZbZSe6N_HXs" },
        { judul: "Mark Ronson - Uptown Funk", id_youtube: "OPf0YbXqDm0" },
        { judul: "Justin Timberlake - Can't Stop the Feeling", id_youtube: "ru0K8uYEZWw" }
    ],
    "sedih": [
        { judul: "Adele - Someone Like You", id_youtube: "hLQl3WQQoQ0" },
        { judul: "Coldplay - Fix You", id_youtube: "k4V3Mo61fJM" },
        { judul: "Sam Smith - Stay With Me", id_youtube: "pB-5XG-DbAA" }
    ],
    "marah": [
        { judul: "Linkin Park - In the End", id_youtube: "eVTXPUF4Oz4" },
        { judul: "Avenged Sevenfold - Nightmare", id_youtube: "94bGzWyHbu0" },
        { judul: "Limp Bizkit - Break Stuff", id_youtube: "ZpUYjpKg9KY" }
    ],
    "santai": [
        { judul: "Lofi Hip Hop - Beats to Relax", id_youtube: "jfKfPfyJRdk" },
        { judul: "Payung Teduh - Akad", id_youtube: "viW0M5R2BLo" },
        { judul: "Jason Mraz - I'm Yours", id_youtube: "EkHTsc9PU2A" }
    ]
};

// Fungsi untuk mendapatkan rekomendasi
const dapatkanRekomendasi = (moodPengguna) => {
    const moodNormal = moodPengguna.toLowerCase();
    
    if (daftarMusik[moodNormal]) {
        return {
            pesan: `Berikut adalah lagu yang pas untuk mood '${moodNormal}' kamu:`,
            daftar_lagu: daftarMusik[moodNormal]
        };
    } else {
        return {
            pesan: "Maaf, saya belum mengerti mood itu. Coba: senang, sedih, marah, atau santai.",
            daftar_lagu: []
        };
    }
};

module.exports = { dapatkanRekomendasi };