const sendEmail = async ({ to, subject, text, html }) => {
  // Check if BREVO API key is configured
  if (!process.env.BREVO_API_KEY) {
    console.warn('⚠️  BREVO_API_KEY not configured. Email skipped.', { to, subject });
    return { skipped: true };
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: 'SAYDALYATI', email: process.env.MAIL_FROM || 's_boudiaf@estin.dz' },
        to: [{ email: to }],
        subject,
        htmlContent: html || text,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('❌ Brevo API Error:', err);
      throw new Error(`Brevo API Error: ${err.message || response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Email sent successfully to:', to, 'Message ID:', data.messageId);
    return { skipped: false, messageId: data.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    throw error;
  }
};

module.exports = { sendEmail };