const sendResetEmail = async (to, resetLink) => {
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: 'Saydalyati', email: 'l_boutaoui@estin.dz' },
      to: [{ email: to }],
      subject: 'Réinitialisation de votre mot de passe',
      htmlContent: `
        <h2>Réinitialisation du mot de passe</h2>
        <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
        <a href="${resetLink}" style="background:#2563eb;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;">
          Réinitialiser le mot de passe
        </a>
        <p>Ce lien expire dans 1 heure.</p>
        <p>Si vous n'avez pas demandé cela, ignorez cet email.</p>
      `,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    console.error('Brevo error:', err);
    throw new Error('Email sending failed');
  }

  console.log('Email sent successfully to:', to);
};

module.exports = { sendResetEmail };