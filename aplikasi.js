//aplikasi.js
require('dotenv').config()
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios'); 

const ruteApi = require('./rute/apiRute');
const basisData = require('./konfigurasi/firebaseInit');
const pengirimEmail = require('./konfigurasi/transporterEmail');
const { dapatkanRekomendasi } = require('./layanan/logikaMusik');
const { buatResponChat } = require('./layanan/layananChat');
const { prosesChat } = require('./layanan/layananChat');

const aplikasi = express();
const server = http.createServer(aplikasi);
const io = socketIo(server);

// ================= MIDDLEWARE =================
aplikasi.use(bodyParser.json());
aplikasi.use(express.static(path.join(__dirname, 'publik')));
aplikasi.use('/api', ruteApi);

aplikasi.get("/README.md", (req, res) => {
    res.sendFile(path.join(__dirname, "README.md"));
});

// ================= SOCKET LOGIC =================
io.on('connection', (soket) => {
    console.log('🔗 Pengguna terhubung');

    // A. LOGIN
    soket.on('pengguna_masuk', (dataProfil) => {
        soket.user = dataProfil;
        console.log(`👤 User Online: ${dataProfil.username}`);
        soket.emit(
            'pesan_bot',
            `Halo ${dataProfil.nama_lengkap}! Ceritakan mood kamu hari ini.`
        );
    });

    // B. CHAT & REKOMENDASI
    soket.on('kirim_pesan', async (data) => {
        const { pesanMood } = data;

        /* 1. Ambil Quotes (saya matikan karena quotes terkesan random dan tak masuk akal) fix later!!!
        let kutipan = "Tetap semangat!";
        try {
            const resp = await axios.get('https://zenquotes.io/api/random');
            kutipan = `"${resp.data[0].q}" — ${resp.data[0].a}`;
        } catch (e) {
            console.log("Gagal ambil quotes");
        } */

	try {
		// 1. Ambil respon dari Gemini
		let teksRespon = await prosesChat(pesanMood);

		// 2. Inisialisasi variabel hasilMusik agar selalu ada (walau isinya null)
		let daftarLagu = null;

		// 3. Cek apakah ada instruksi rekomendasi
		if (teksRespon.includes("###REKOMENDASI###")) {
		    console.log("🎯 Gemini setuju kasih lagu!"); // Untuk debug di terminal
		    teksRespon = teksRespon.replace("###REKOMENDASI###", "").trim();

		    // Ambil lagu dari YouTubei.js
		    const hasilMusik = await dapatkanRekomendasi(pesanMood);
		    daftarLagu = hasilMusik.daftar_lagu;
		}

		// 4. Kirim ke client (Sekarang daftarLagu sudah didefinisikan)
		soket.emit('respon_musik', {
		    teks: teksRespon,
		    lagu: daftarLagu 
		});

	    } catch (err) {
		console.error("❌ Error di socket send_message:", err);
		soket.emit('pesan_bot', "Maaf, ada gangguan teknis sebentar.");
	    }

        // 5. Simpan ke Firebase
        try {
            await basisData.collection('mood_history').add({
                username: soket.user ? soket.user.username : 'anon',
                mood: pesanMood,
                timestamp: new Date()
            });
        } catch (err) {
            console.error("❌ Gagal simpan DB:", err);
        }
        // // 6. Kirim Email (opsional)
        // Gunakan data dari soket.user yang disimpan saat 'pengguna_masuk'
        if (soket.user && soket.user.email && daftarLagu && daftarLagu.length > 0) {
            pengirimEmail.sendMail(
                {
                    from: process.env.EMAIL_USER, // Ambil dari .env
                    to: soket.user.email,
                    subject: '🎵 Rekomendasi Musik Kamu',
                    text: `Halo ${soket.user.nama_lengkap || 'User'}, ini rekomendasi lagumu:\n\n` +
                        daftarLagu
                            .map(l => `- ${l.judul}`)
                            .join('\n')
                },
                (err) => {
                    if (err) console.log("❌ Gagal kirim email:", err);
                    else console.log("📧 Email terkirim ke:", soket.user.email);
                }
            );
		}
      
    });

    // C. HAPUS RIWAYAT
    soket.on('hapus_riwayat', async (username) => {
        try {
            const snapshot = await basisData
                .collection('mood_history')
                .where('username', '==', username)
                .get();

            if (snapshot.empty) {
                soket.emit('pesan_bot', "Tidak ada riwayat untuk dihapus.");
                return;
            }

            const batch = basisData.batch();
            snapshot.docs.forEach((doc) => batch.delete(doc.ref));
            await batch.commit();

            console.log(`🗑️ Riwayat ${username} dihapus`);
            soket.emit(
                'riwayat_dihapus',
                "✅ Riwayat chat berhasil dihapus"
            );
        } catch (err) {
            console.error("❌ Gagal hapus riwayat:", err);
            soket.emit('pesan_bot', "Gagal menghapus riwayat.");
        }
    });
});

// ================= SERVER =================
const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});




