const nodemailer = require('nodemailer');
require('dotenv').config(); // Must be the FIRST line
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.error('Error connecting to email server:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"BackEnd Ledger" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });
        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

async function sendRegistrationEmail(userEmail, name) {
    const subject = 'Welcome to BackEnd Ledger 🚀';

    const html = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f7; padding: 50px 0; width: 100%;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
            <tr>
                <td style="background-color: #4f46e5; padding: 40px 0; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; letter-spacing: 1px;">BackEnd Ledger</h1>
                </td>
            </tr>
            <tr>
                <td style="padding: 40px; color: #51545e; line-height: 1.8;">
                    <h2 style="color: #333333; margin-top: 0;">Hello, ${name}!</h2>
                    <p>Welcome to the family! We're excited to help you manage your data more efficiently. Your account is now active and ready for action.</p>
                    
                    <div style="text-align: center; margin: 35px 0;">
                        <a href="${process.env.CLIENT_URL || '#'}" 
                           style="background-color: #4f46e5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; box-shadow: 0 2px 5px rgba(79, 70, 229, 0.3);">
                           Go to Dashboard
                        </a>
                    </div>
                    
                    <p>If you have any questions, simply reply to this email. Our support team is always here to help.</p>
                    <p style="margin-bottom: 0;">Cheers,<br>The BackEnd Ledger Team</p>
                </td>
            </tr>
            <tr>
                <td style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #a8aaaf;">
                    <p style="margin: 0;">&copy; 2026 BackEnd Ledger. All rights reserved.</p>
                    <p style="margin: 5px 0 0;">You received this because you signed up for an account.</p>
                </td>
            </tr>
        </table>
    </div>
    `;

    await sendEmail(userEmail, subject, html);
}

module.exports = { sendRegistrationEmail };