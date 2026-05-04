const sendEmail = async ({ to, subject, text, html }) => {
  // Check if Resend API key is configured
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️  RESEND_API_KEY not configured. Email skipped.', { to, subject });
    return { skipped: true };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'SAYDALYATI <onboarding@resend.dev>',  // Use Resend sandbox for testing
        to: [to],
        subject,
        html: html || text,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('❌ Resend API Error:', err);
      throw new Error(`Resend API Error: ${err.message || response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Email sent successfully to:', to, 'Message ID:', data.id);
    return { skipped: false, messageId: data.id };
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    throw error;
  }
};

module.exports = { sendEmail };