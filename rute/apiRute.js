const express = require('express');
const router = express.Router();
const basisData = require('../konfigurasi/firebaseInit');
const bcrypt = require('bcryptjs'); // Library keamanan

// --- 1. API REGISTRASI (DENGAN ENKRIPSI) ---
router.post('/registrasi', async (req, res) => {
    try {
        const { username, password, email, nama_lengkap } = req.body;

        // Validasi input
        if (!username || !password || !email) {
            return res.status(400).json({ pesan: "Semua kolom wajib diisi!" });
        }

        // Cek username duplikat
        const cekUser = await basisData.collection('users').doc(username).get();
        if (cekUser.exists) {
            return res.status(400).json({ pesan: "Username sudah dipakai." });
        }

        // ENKRIPSI PASSWORD (HASHING)
        const garam = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, garam);

        // Simpan ke Firestore
        await basisData.collection('users').doc(username).set({
            username,
            password: passwordHash, // Simpan password yang sudah diacak
            email,
            nama_lengkap,
            terdaftar_pada: new Date().toISOString()
        });

        res.status(200).json({ pesan: "Registrasi berhasil! Silakan login." });

    } catch (error) {
        res.status(500).json({ pesan: "Gagal daftar", error: error.message });
    }
});

// --- 2. API LOGIN (VERIFIKASI HASH) ---
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const doc = await basisData.collection('users').doc(username).get();
        if (!doc.exists) {
            return res.status(404).json({ pesan: "Username tidak ditemukan." });
        }

        const dataUser = doc.data();

        // BANDINGKAN PASSWORD INPUT VS PASSWORD DATABASE
        const validPassword = await bcrypt.compare(password, dataUser.password);

        if (validPassword) {
            res.status(200).json({
                pesan: "Login berhasil",
                profil: {
                    username: dataUser.username,
                    nama_lengkap: dataUser.nama_lengkap,
                    email: dataUser.email
                }
            });
        } else {
            res.status(401).json({ pesan: "Password salah!" });
        }

    } catch (error) {
        res.status(500).json({ pesan: "Error server", error: error.message });
    }
});

// --- 3. API RIWAYAT (OPSIONAL) ---
router.get('/riwayat-mood', async (req, res) => {
    try {
        const snapshot = await basisData.collection('mood_history').get();
        const data = [];
        snapshot.forEach(doc => data.push(doc.data()));
        res.json({ data });
    } catch (e) { res.status(500).send(e.message); }
});

module.exports = router;