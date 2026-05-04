const sendResetEmail = async (to, resetLink) => {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'Saydalyati <onboarding@resend.dev>',
      to: [to],
      subject: 'Reinitialisation de votre mot de passe',
      html: `
        <h2>Reinitialisation du mot de passe</h2>
        <p>Cliquez sur le lien ci-dessous pour reinitialiser votre mot de passe :</p>
        <a href="${resetLink}" style="background:#2563eb;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;">
          Reinitialiser le mot de passe
        </a>
        <p>Ce lien expire dans 1 heure.</p>
      `,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    console.error('Resend error:', err);
    throw new Error('Email sending failed');
  }

  console.log('Email sent successfully to:', to);
};

module.exports = { sendResetEmail };