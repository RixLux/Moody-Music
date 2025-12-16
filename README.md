---
# Program Mood Music Berbasis ChatBot

Aplikasi backend berbasis Node.js yang mengintegrasikan ChatBot real-time untuk memberikan rekomendasi musik berdasarkan mood pengguna. Aplikasi ini dibuat sebagai bahan laporan technical report.
---
## 🚀 Fitur Utama
1. **ChatBot Real-time**: Menggunakan Socket.IO untuk interaksi instan.
2. **Rekomendasi Musik**: Algoritma pemetaan mood ke daftar lagu.
3. **Penyimpanan Database**: Terintegrasi dengan Google Firebase Firestore.
4. **Notifikasi Email**: Mengirimkan ringkasan rekomendasi via Nodemailer.
5. **REST API**: Endpoint untuk manajemen data mood.
---
## 🛠️ Teknologi yang Digunakan
- **Bahasa**: JavaScript (Node.js)
- **Framework Web**: Express.js
- **Real-time Communication**: Socket.IO
- **Database**: Firebase Firestore
- **Email Service**: Nodemailer
---
## 📂 Alur Kerja Sistem
1. Pengguna membuka halaman web (ChatBot).
2. Pengguna memasukkan nama, email (opsional), dan mood (cth: "sedih").
3. **Socket.IO** mengirim data mood ke server.
4. Server memproses mood dan mencari lagu yang cocok di database lokal.
5. Server menyimpan riwayat percakapan ke **Firestore**.
6. Server mengirimkan balasan rekomendasi musik kembali ke ChatBot.
7. Jika email diisi, server mengirimkan detail rekomendasi ke email pengguna via **Nodemailer**.
---
## ⚙️ Cara Menjalankan Aplikasi

1. **Clone repository ini**.
```
git clone git@github.com:RixLux/Moody-Music.git
```
2. **Instal dependensi**:
   ```
   npm install
   ```
 ---  
