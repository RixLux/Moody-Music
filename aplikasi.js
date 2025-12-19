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

const aplikasi = express();
const server = http.createServer(aplikasi);
const io = socketIo(server);

// ================= MIDDLEWARE =================
aplikasi.use(bodyParser.json());
aplikasi.use(express.static(path.join(__dirname, 'publik')));
aplikasi.use('/api', ruteApi);

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
        const { pesanMood, email, nama } = data;

        // 1. Ambil Quotes
        let kutipan = "Tetap semangat!";
        try {
            const resp = await axios.get('https://zenquotes.io/api/random');
            kutipan = `"${resp.data[0].q}" — ${resp.data[0].a}`;
        } catch (e) {
            console.log("Gagal ambil quotes");
        }

        // 2. Rekomendasi Musik
        const hasilMusik = await dapatkanRekomendasi(pesanMood);

        // 3. Kirim respon ke client
        const teksRespon = buatResponChat(pesanMood, kutipan);

        soket.emit('respon_musik', {
            teks: teksRespon,
            lagu: hasilMusik.daftar_lagu
        });

        // 4. Simpan ke Firebase
        try {
            await basisData.collection('mood_history').add({
                username: soket.user ? soket.user.username : 'anon',
                mood: pesanMood,
                timestamp: new Date()
            });
        } catch (err) {
            console.error("❌ Gagal simpan DB:", err);
        }

        // 5. Kirim Email (opsional)
        if (email && hasilMusik.daftar_lagu.length > 0) {
            pengirimEmail.sendMail(
                {
                    from: 'aplikasi_musik@gmail.com',
                    to: email,
                    subject: '🎵 Rekomendasi Musik Kamu',
                    text: `Halo ${nama}, ini rekomendasi lagumu:\n\n` +
                        hasilMusik.daftar_lagu
                            .map(l => `- ${l.judul}`)
                            .join('\n')
                },
                (err) => {
                    if (err) console.log("❌ Gagal kirim email:", err);
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
const PORT = 3001;
server.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
