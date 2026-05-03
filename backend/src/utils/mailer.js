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
  // FIX: Trim the password - App Passwords from Google/other providers
  // are formatted with spaces (e.g. "nbfo kjow fmzz rzdy") which must be removed
  const user = process.env.SMTP_USER ? process.env.SMTP_USER.trim() : undefined;
  const pass = process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s/g, '').trim() : undefined;

  // Return null if any required config is missing
  if (!host || !user || !pass) {
    return null;
  }

  return {
    host,
    port,
    secure: port === 465, // Use TLS for port 465, STARTTLS for 587
    auth: { user, pass },
    // FIX: University/institutional SMTP servers often use self-signed certificates.
    // Without this, nodemailer silently drops the connection and no email is sent.
    tls: {
      rejectUnauthorized: false,
    },
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
 * Verify SMTP connection - useful for debugging
 * @returns {Promise<boolean>} true if connection works
 */
async function verifyConnection() {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn('SMTP not configured. Cannot verify.');
    return false;
  }
  try {
    await transporter.verify();
    console.log('SMTP connection verified successfully.');
    return true;
  } catch (err) {
    console.error('SMTP connection failed:', err.message);
    return false;
  }
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

  try {
    // Send email and return result with message ID
    const info = await transporter.sendMail({ from, to, subject, text, html });
    console.log('Email sent to ' + to + ' | MessageID: ' + info.messageId);
    return { skipped: false, messageId: info.messageId };
  } catch (err) {
    // FIX: Log the full error so you can see exactly what is failing
    console.error('Email sending failed:', {
      message: err.message,
      code: err.code,
      command: err.command,
      response: err.response,
      to,
      subject,
    });
    throw err; // Re-throw so callers can handle it
  }
}

module.exports = {
  sendEmail,
  verifyConnection,
};