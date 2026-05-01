/**
 * Email Utility
 * Handles sending emails via SMTP
 * Used for user notifications (exchange requests, approvals, etc)
 */

const nodemailer = require('nodemailer');

/**
 * Build SMTP configuration from environment variables
 * Returns null if SMTP is not configured
 * @returns {Object|null} Nodemailer transport config or null
 */
function getMailerConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  // Return null if any required config is missing
  if (!host || !user || !pass) {
    return null;
  }

  return {
    host,
    port,
    secure: port === 465, // Use TLS for port 465
    auth: { user, pass },
  };
}

/**
 * Create Nodemailer transporter instance
 * Returns null if SMTP is not configured
 * @returns {Object|null} Nodemailer transporter or null
 */
function getTransporter() {
  const cfg = getMailerConfig();
  if (!cfg) return null;
  return nodemailer.createTransport(cfg);
}

/**
 * Send an email to recipient
 * Gracefully handles SMTP not being configured (logs warning and continues)
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text body
 * @param {string} options.html - HTML body
 * @returns {Object} Result with skipped flag and messageId
 */
async function sendEmail({ to, subject, text, html }) {
  const transporter = getTransporter();
  // Skip email if SMTP not configured (development)
  if (!transporter) {
    console.warn('SMTP not configured. Email skipped.', { to, subject });
    return { skipped: true };
  }

  const from = process.env.MAIL_FROM || process.env.SMTP_USER;
  // Send email and return result with message ID
  const info = await transporter.sendMail({ from, to, subject, text, html });
  return { skipped: false, messageId: info.messageId };
}

module.exports = {
  sendEmail,
};
