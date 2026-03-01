import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config({ path: "./config/.env" });

export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    tls: {
        rejectUnauthorized: false
    },
    auth: {
        user: process.env.SMTP_USERMAIL,
        pass: process.env.SMTP_PASSWORD,
    }
});

(async () => {
    try {
        await transporter.verify();
        console.log('Mailer ready ✅');
    } catch (err) {
        console.error('Mailer config error:', err.message);
    }
})();