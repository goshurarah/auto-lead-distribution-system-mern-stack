const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../utils/logger');

const sendEmailToAgent = async (agentEmail, leadId) => {
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
      to: agentEmail,               // To the agent's email
      subject: 'New Lead Assigned',
      text: `Hello, you have been assigned a new lead. Lead ID: ${leadId}. Please log in to your dashboard for more details.`,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Email sent to agent at ${agentEmail}`);
  } catch (error) {
    logger.error(`Failed to send email to agent: ${error.message}`);
  }
};

module.exports = sendEmailToAgent;
