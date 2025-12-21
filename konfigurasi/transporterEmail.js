const nodemailer = require('nodemailer');

// Konfigurasi pengirim email menggunakan Environment Variables
const pengirimEmail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

module.exports = pengirimEmail;
