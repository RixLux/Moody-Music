const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Gunakan model ini, biasanya paling stabil
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash" 
});

async function prosesChat(pesanMood) {
    try {
        // Pindahkan systemInstruction ke dalam prompt jika model lama bermasalah dengan systemInstruction
	const prompt = `
	Sistem: Kamu adalah teman curhat musik yang empati. 
	instruksi:
	1.gunakan bahasa gaul
	2.setiap pesan dari user kamu langsung respon dengan nyariin lagunya



	User: ${pesanMood}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let teks = response.text().trim();
        
       
        const kataKunciMusik = ["lagu", "musik", "dengerin", "nyanyi", "song"];
        if (kataKunciMusik.some(kata => teks.toLowerCase().includes(kata)) && !teks.includes("###REKOMENDASI###")) {
            teks += "\n\n###REKOMENDASI###";
        }

        return teks;
        
    } catch (error) {
        console.error("❌ Gemini Error:", error);
        return "Aku dengerin kamu kok. Cerita aja lagi kalau masih ada yang ganjel...";
    }
}

module.exports = { prosesChat };
