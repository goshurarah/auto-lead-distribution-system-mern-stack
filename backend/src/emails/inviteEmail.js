const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../utils/logger');
require('dotenv').config();


const sendInviteEmail = async (email) => {
    try {
        const transporter = nodemailer.createTransport({
            service: config.email_server,  // e.g., 'gmail', 'outlook'
            host: config.email_host,      // e.g., 'smtp.gmail.com'
            port: config.email_port,      // e.g., 465 for SSL or 587 for TLS
            secure: true,                 // Use SSL
            auth: {
                user: config.email_user,    // Your email address
                pass: config.email_pass,    // Your email password or app password
            },
        });

        const mailOptions = {
            from: config.email_from,      // From email
            to: email,                    // To email from payload
            subject: 'You’re Invited to Join Agentsly',
            html: `
    <p>Hello,</p>
    <p>You have been invited to join <strong>Agentsly</strong>, the leading platform for managing leads and clients.</p>
    <p>Click the link below to get started:</p>
    <p><a href="${process.env.FRONTEND_REDIRECT_URL}" target="_blank">Join Agentsly</a></p>
    <p>We look forward to working with you!</p>
    <p>Best regards,</p>
    <p>The Agentsly Team</p>
  `,
        };

        await transporter.sendMail(mailOptions);

        logger.info(`Invite email sent to ${email}`);
    } catch (error) {
        logger.error(`Failed to send invite email: ${error.message}`);
    }
};

module.exports = sendInviteEmail;
