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
const { buatResponGemini } = require('./layanan/layananChat');

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


// B. CHAT & REKOMENDASI (REFECTORED)
    soket.on('kirim_pesan', async (data) => {
        const { pesanMood, email, nama } = data;

        try {
            // 1. Dapatkan Rekomendasi Musik dari YouTube/Logika Musik
            const hasilMusik = await dapatkanRekomendasi(pesanMood);
            const daftarLagu = hasilMusik.daftar_lagu || [];

            // 2. Gunakan Gemini untuk membuat respon chat utuh
            // Kamu tidak perlu lagi fetch axios zenquotes di sini,
            // biarkan Gemini yang membuat quote di dalam fungsinya.
            const teksRespon = await buatResponGemini(pesanMood, daftarLagu);

            // 3. Kirim respon ke client
            soket.emit('respon_musik', {
                teks: teksRespon,
                lagu: daftarLagu
            });

            // 4. Simpan ke Firebase (Async background)
            basisData.collection('mood_history').add({
                username: soket.user ? soket.user.username : 'anon',
                mood: pesanMood,
                recommendations: daftarLagu.map(l => l.judul),
                timestamp: new Date()
            }).catch(err => console.error("❌ Gagal simpan DB:", err));

            // 5. Kirim Email (Jika ada email)
            if (email && daftarLagu.length > 0) {
                // Kita kirim teksRespon yang sudah dibuat Gemini agar isi email sama dengan chat
                pengirimEmail.sendMail({
                    from: process.env.EMAIL_USER || 'aplikasi_musik@gmail.com',
                    to: email,
                    subject: '🎵 Rekomendasi Musik Kamu',
                    text: `Halo ${nama},\n\nBerikut adalah rangkuman mood kamu:\n\n${teksRespon}`
                }).catch(err => console.log("❌ Gagal kirim email:", err));
            }

        } catch (error) {
            console.error("Error pada flow kirim_pesan:", error);
            soket.emit('pesan_bot', "Maaf, aku sedang mengalami gangguan teknis. Coba lagi nanti ya.");
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
const PORT = 3001;
server.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
