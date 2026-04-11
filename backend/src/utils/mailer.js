const nodemailer = require('nodemailer');

function getMailerConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return {
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  };
}

function getTransporter() {
  const cfg = getMailerConfig();
  if (!cfg) return null;
  return nodemailer.createTransport(cfg);
}

async function sendEmail({ to, subject, text, html }) {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn('SMTP not configured. Email skipped.', { to, subject });
    return { skipped: true };
  }

  const from = process.env.MAIL_FROM || process.env.SMTP_USER;
  const info = await transporter.sendMail({ from, to, subject, text, html });
  return { skipped: false, messageId: info.messageId };
}

module.exports = {
  sendEmail,
};
