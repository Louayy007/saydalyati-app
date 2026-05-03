const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail({ to, subject, text, html }) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set. Email skipped.');
    return { skipped: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'SAYDALYATI <onboarding@resend.dev>',
      to,
      subject,
      text,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error(error.message);
    }

    console.log('Email sent OK to', to, '| id:', data.id);
    return { skipped: false, messageId: data.id };
  } catch (err) {
    console.error('Email FAILED:', err.message);
    throw err;
  }
}

module.exports = { sendEmail };