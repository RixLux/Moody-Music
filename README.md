---

# 🎧 Mood Music — 
ChatBot-Based Music Recommendation System

**Mood Music** adalah aplikasi backend berbasis **Node.js** yang mengintegrasikan **ChatBot real-time** untuk memberikan rekomendasi musik berdasarkan mood pengguna.
Aplikasi ini dikembangkan sebagai bagian dari **laporan technical report**, dengan fokus pada komunikasi real-time, pemetaan mood, dan integrasi layanan pihak ketiga.

---

<p align="center">
  <strong>Baru pertama kali pakai Git?</strong><br>
  Pelajari dasar-dasar Git dan GitHub melalui tutorial berikut:
  <br><br>
  <a href="https://www.w3schools.com/git/default.asp?remote=github">
    <img src="https://img.shields.io/badge/Git%20Tutorial-ffb6c1?style=for-the-badge&logo=readthedocs&logoColor=white">
  </a>
</p>

---

##  Fitur Utama

*  **ChatBot Real-time**
  Interaksi instan antara pengguna dan sistem menggunakan **Socket.IO**.

*  **Rekomendasi Musik Berbasis Mood**
  Sistem memetakan input mood pengguna ke daftar lagu yang relevan.

*  **Penyimpanan Data**
  Riwayat percakapan dan mood disimpan menggunakan **Firebase Firestore**.

*  **Notifikasi Email**
  Ringkasan rekomendasi musik dapat dikirim ke email pengguna menggunakan **Nodemailer**.

*  **REST API**
  Endpoint untuk pengelolaan dan pengembangan data mood secara terstruktur.

---

##  Teknologi yang Digunakan

| Kategori                | Teknologi            |
| ----------------------- | -------------------- |
| Bahasa                  | JavaScript (Node.js) |
| Web Framework           | Express.js           |
| Real-time Communication | Socket.IO            |
| Database                | Firebase Firestore   |
| Email Service           | Nodemailer           |

---

##  Alur Kerja Sistem

1. Pengguna membuka halaman web ChatBot.
2. Pengguna memasukkan **nama**, **email (opsional)**, dan **mood** (contoh: *sedih*, *senang*).
3. Data mood dikirim ke server melalui **Socket.IO**.
4. Server memproses mood dan mencocokkannya dengan daftar lagu yang tersedia.
5. Riwayat percakapan disimpan ke **Firebase Firestore**.
6. Server mengirimkan hasil rekomendasi kembali ke ChatBot secara real-time.
7. Jika email diisi, sistem mengirimkan detail rekomendasi ke email pengguna menggunakan **Nodemailer**.

---

##  Cara Menjalankan Aplikasi

### 1️⃣ Clone Repository

```
git clone git@github.com:RixLux/Moody-Music.git
cd Moody-Music
```

### 2️⃣ Instal Dependensi

```
npm install
```

### 3️⃣ Menjalankan Server

**Mode Development**

```
npm run dev
```

**Mode Production**

```
npm run start
```

---




