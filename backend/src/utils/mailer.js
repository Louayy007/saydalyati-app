const nodemailer = require('nodemailer');

function getTransporter() {
  const user = process.env.SMTP_USER ? process.env.SMTP_USER.trim() : null;
  const pass = process.env.SMTP_PASS ? process.env.SMTP_PASS.trim() : null;
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);

  if (!host || !user || !pass) {
    console.warn('SMTP not configured. Email will be skipped.');
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: false,
    auth: { user, pass },
  });
}

async function sendEmail({ to, subject, text, html }) {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn('Mailer not configured. Skipping email to:', to);
    return { skipped: true };
  }

  const from = process.env.MAIL_FROM || process.env.SMTP_USER;

  try {
    const info = await transporter.sendMail({ from, to, subject, text, html });
    console.log('Email sent OK to', to, '| id:', info.messageId);
    return { skipped: false, messageId: info.messageId };
  } catch (err) {
    console.error('Email FAILED:', {
      message: err.message,
      code: err.code,
      response: err.response,
    });
    throw err;
  }
}

module.exports = { sendEmail };
