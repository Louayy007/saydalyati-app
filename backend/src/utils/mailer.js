const SibApiV3Sdk = require('@getbrevo/brevo');

async function sendEmail({ to, subject, text, html }) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn('BREVO_API_KEY not set. Email skipped.');
    return { skipped: true };
  }

  const client = SibApiV3Sdk.ApiClient.instance;
  client.authentications['api-key'].apiKey = apiKey;

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.sender = { name: 'SAYDALYATI', email: process.env.MAIL_FROM || 'l_boutaoui@estin.dz' };
  sendSmtpEmail.to = [{ email: to }];
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.textContent = text;
  sendSmtpEmail.htmlContent = html;

  try {
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Email sent OK to', to, '| id:', result.messageId);
    return { skipped: false, messageId: result.messageId };
  } catch (err) {
    console.error('Email FAILED:', err.message);
    throw err;
  }
}

module.exports = { sendEmail };
