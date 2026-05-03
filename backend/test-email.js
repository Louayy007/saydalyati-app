/**
 * Run this from your backend folder:
 *   node test-email.js
 * 
 * It will tell you EXACTLY what is failing.
 */

require('dotenv').config();
const nodemailer = require('nodemailer');

const user = process.env.SMTP_USER ? process.env.SMTP_USER.trim() : null;
const pass = process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s/g, '') : null;
const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT || 465);

console.log('=== SMTP DEBUG ===');
console.log('HOST:', host);
console.log('PORT:', port);
console.log('USER:', user);
console.log('PASS length:', pass ? pass.length : 'NOT SET');
console.log('==================\n');

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: { user, pass },
  tls: { rejectUnauthorized: false },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  debug: true,   // <-- shows full SMTP conversation
  logger: true,  // <-- logs everything
});

console.log('Verifying connection...\n');
transporter.verify((err, success) => {
  if (err) {
    console.error('\n❌ VERIFY FAILED:');
    console.error('  message:', err.message);
    console.error('  code:', err.code);
    console.error('  response:', err.response);
    console.error('  responseCode:', err.responseCode);
    process.exit(1);
  }

  console.log('\n✅ Connection OK! Sending test email...\n');
  transporter.sendMail({
    from: user,
    to: user,  // sends to yourself
    subject: 'Saydalyati Test Email',
    text: 'If you receive this, email is working!',
  }, (err2, info) => {
    if (err2) {
      console.error('\n❌ SEND FAILED:');
      console.error('  message:', err2.message);
      console.error('  code:', err2.code);
      console.error('  response:', err2.response);
    } else {
      console.log('\n✅ EMAIL SENT SUCCESSFULLY!');
      console.log('  MessageID:', info.messageId);
      console.log('  Check your inbox at:', user);
    }
    process.exit(0);
  });
});
