import { transporter } from '../config/nodeMailer.js';

export const sendMail = async ({ to, subject, content }) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_MAIL,
            to,
            subject,
            text: (content || '').replace(/<[^>]*>?/gm, ''),
            html: content
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Mail sent successfully!', info.messageId);
        return info;

    } catch (error) {
        console.error('An error occurred while sending mail:', error.message);
        throw error;
    }
};