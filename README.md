---

# 🎧 Mood Music  
ChatBot-Based Music Recommendation System

**Mood Music** adalah aplikasi backend berbasis **Node.js** yang mengintegrasikan **ChatBot real-time** untuk memberikan rekomendasi musik berdasarkan mood pengguna.
Aplikasi ini dikembangkan sebagai bagian dari **laporan technical report**, dengan fokus pada komunikasi real-time, pemetaan mood, dan integrasi layanan pihak ketiga.

---

<p align="center">
  <strong>Baru pertama kali pakai Git, GitHub, atau Node.js?</strong><br>
  Pelajari dasar-dasar Git, GitHub, dan Node.js melalui tutorial berikut:
  <br><br>

  <a href="https://www.w3schools.com/git/default.asp?remote=github">
    <img
      src="https://img.shields.io/badge/Git%20Tutorial-ffb6c1?style=for-the-badge&logo=github&logoColor=white"
      alt="Git Tutorial"
    />
  </a>
<br>
  <a href="https://www.w3schools.com/nodejs/default.asp">
    <img
      src="https://img.shields.io/badge/Node.js%20Tutorial-3c873a?style=for-the-badge&logo=node.js&logoColor=white"
      alt="Node.js Tutorial"
    />
  </a>
</p>

<p align="center">
  <img src="https://i.imgur.com/qrBjnkL.jpeg" width="250" alt="Up!">
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

<h2 align="center"> Teknologi yang Digunakan</h2>

<div align="center">
  
| Kategori                | Teknologi            |
| :---------------------: | :------------------: |
| Bahasa                  | JavaScript (Node.js) |
| Web Framework           | Express.js           |
| Real-time Communication | Socket.IO            |
| Database                | Firebase Firestore   |
| Email Service           | Nodemailer           |
</div>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-3c873a?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" />
  <br>
  <img src="https://img.shields.io/badge/Axios-5a29e4?style=for-the-badge&logo=axios&logoColor=white" />
  <img src="https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socket.io&logoColor=white" />
  <br>
  <img src="https://img.shields.io/badge/Firebase_Admin-ffca28?style=for-the-badge&logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/Nodemailer-22b573?style=for-the-badge&logo=gmail&logoColor=white" />
  <br>
  <img src="https://img.shields.io/badge/Dotenv-ecd53f?style=for-the-badge&logo=dotenv&logoColor=black" />
</p>

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





