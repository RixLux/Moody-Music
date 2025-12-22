const { GoogleGenerativeAI } = require("@google/generative-ai");

// Inisialisasi Gemini (Pastikan simpan API Key di .env)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/**
 * Fungsi baru menggunakan Gemini untuk menghasilkan respon chatbot
 */
async function buatResponGemini(userInput, daftarLagu = []) {
    // Kita buat prompt yang kuat agar Gemini tahu perannya
    const prompt = `
    Kamu adalah asisten musik yang sangat empatik dan puitis.
    User sedang merasa: "${userInput}"
    Lagu yang direkomendasikan: ${daftarLagu.map(l => `${l.judul} oleh ${l.artis}`).join(", ")}

    Tugas kamu:
    1. Analisis perasaan user dari input tersebut.
    2. Berikan tanggapan yang hangat, tidak kaku, dan relate dengan perasaannya.
    3. Hubungkan perasaan tersebut dengan daftar lagu yang diberikan.
    4. Berikan satu kutipan (quote) penyemangat yang original dan relevan.
    5. Gunakan bahasa Indonesia yang santai tapi bermakna (pake 'aku-kamu').

    Format output (Gunakan Markdown):
        *Analisis Singkat*
        [Isi tanggapan empati kamu]
    
        *Rekomendasi Lagu untukmu:*
        - 🎵 [Judul] - [Artis] ([Alasan singkat kenapa cocok])
        - ...
    
        > [Quote dalam bahasa Indonesia]
    
        [Kalimat penutup]
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Error:", error);
        return "Aduh, kepalaku lagi agak pusing, tapi dengerin lagu ini dulu ya...";
    }
}

module.exports = { buatResponGemini };