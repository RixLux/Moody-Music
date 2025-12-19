function randomPick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

const pembuka = [
    "Hmm… aku nangkep vibes-nya 🎧",
    "Oke, denger ini ya 👀",
    "Mood kamu kedengeran banget sih",
    "Kalau lagi kayak gini… aku punya sesuatu 🎶",
    "Ini cocok sama perasaan kamu sekarang"
];

const penutup = [
    "Semoga sedikit nemenin ya.",
    "Pelan-pelan aja, gak apa-apa.",
    "Dengerin sambil tarik napas.",
    "Kalau mau cerita lagi, aku di sini kok.",
    "Kadang musik lebih jujur dari kata-kata."
];

const gayaMood = {
    sedih: [
        "Kayaknya lagi berat ya hari ini.",
        "Lagi pengen diem tapi ditemenin musik?",
    ],
    senang: [
        "Kelihatan lagi cerah nih 🌤️",
        "Wah, energinya kerasa!",
    ],
    default: [
        "Mood itu unik sih.",
        "Perasaan kamu valid kok.",
    ]
};

function buatResponChat(mood, kutipan) {
    const moodKey =
        mood.toLowerCase().includes("sad") || mood.toLowerCase().includes("sedih")
            ? "sedih"
            : mood.toLowerCase().includes("happy") || mood.toLowerCase().includes("senang")
            ? "senang"
            : "default";

    return `
${randomPick(gayaMood[moodKey])}

${randomPick(pembuka)}
Ini lagu yang mungkin nyambung sama mood **"${mood}"** kamu 🎶

💡 ${kutipan}

${randomPick(penutup)}
`.trim();
}

module.exports = { buatResponChat };

