const nodemailer = require('nodemailer');

const pengirimEmail = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use SSL
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    // Add this to help debug
    debug: true,
    logger: true 
});

module.exports = pengirimEmail;
