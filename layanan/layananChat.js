/**
 * Fungsi bantu untuk mengambil item acak dari array
 */
function randomPick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

const pembuka = [
    "Hmm… aku nangkep vibes-nya 🎧",
    "Oke, dengerin ini ya 👀",
    "Mood kamu kedengeran banget sih, coba ini:",
    "Kalau lagi kayak gini… aku punya sesuatu 🎶",
    "Ini cocok banget sama perasaan kamu sekarang.",
    "Biar lagunya yang bicara ya..."
];

const penutup = [
    "Semoga sedikit nemenin ya.",
    "Pelan-pelan aja, gak apa-apa.",
    "Dengerin sambil tarik napas dalam-dalam.",
    "Kalau mau cerita lagi, aku di sini kok.",
    "Kadang musik lebih jujur dari kata-kata.",
    "Enjoy the music, you deserve it."
];

const gayaMood = {
    sedih: [
        "Kayaknya lagi berat ya hari ini? Gapapa, keluarin aja.",
        "Lagi pengen diem tapi ditemenin musik? Aku ngerti kok.",
        "Dunia kadang emang gitu, musik ini buat kamu."
    ],
    senang: [
        "Kelihatan lagi cerah banget nih hari kamu! 🌤️",
        "Wah, energinya nular sampe sini! Let's go!",
        "Momen kayak gini emang paling pas dirayain pake lagu."
    ],
    marah: [
        "Lagi pengen meledak ya? Keluarin lewat musik ini biar lega.",
        "Gas pol aja, jangan dipendam sendiri. 💥",
        "Kadang distorsi gitar emang obat paling ampuh buat kesel."
    ],
    santai: [
        "Chill dulu sebentar, dunia nggak bakal lari kok. ☕",
        "Vibes-nya udah dapet banget, tinggal tambah lagu ini.",
        "Tarik napas, santai, dan nikmati momennya."
    ],
    galau: [
        "Lagi terjebak di antara masa lalu ya? Hehe.",
        "Emang paling enak galau ditemenin lagu yang 'kena' banget.",
        "Nggak apa-apa mellow dikit, asal jangan kelamaan ya."
    ],
    default: [
        "Mood itu unik, dinikmati aja prosesnya.",
        "Perasaan kamu valid kok, tenang aja.",
        "Apapun rasanya, musik selalu punya tempat."
    ]
};

/**
 * Fungsi Utama Pembuat Pesan Chat
 * @param {string} mood - Input mood dari user
 * @param {string} kutipan - Quote yang ingin ditampilkan
 * @param {Array} daftarLagu - Array berisi objek lagu dari fungsi rekomendasi
 */
function buatResponChat(mood, kutipan,daftarLagu = []) {
    const m = mood.toLowerCase();
    
// Logika penentuan mood key
    let moodKey = "default";
    if (m.includes("sedih") || m.includes("sad") || m.includes("nangis")) moodKey = "sedih";
    else if (m.includes("senang") || m.includes("happy") || m.includes("ceria")) moodKey = "senang";
    else if (m.includes("marah") || m.includes("kesel") || m.includes("emosi")) moodKey = "marah";
    else if (m.includes("santai") || m.includes("chill") || m.includes("relax")) moodKey = "santai";
    else if (m.includes("galau") || m.includes("broken")) moodKey = "galau";

    // 1. Format daftar lagu menjadi string berderet dengan emoji 🎵
    const listLaguTeks = daftarLagu.length > 0 
        ? daftarLagu.map(lagu => `🎵 ${lagu.judul} - ${lagu.artis}`).join('\n')
        : "Maaf, aku gagal narik daftar lagunya 😅";

    // 2. Susun pesan akhir
    return `
${randomPick(gayaMood[moodKey])}

${randomPick(pembuka)}
Aku nemu beberapa lagu buat mood **"${mood}"** kamu:

${listLaguTeks}

💡 *"${kutipan}"*

${randomPick(penutup)}
`.trim();
}

module.exports = { buatResponChat };
