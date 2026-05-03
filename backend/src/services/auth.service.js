const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const prisma = require('../prisma');
const { signAuthToken } = require('../utils/jwt');
const { sendEmail } = require('../utils/mailer');

const RETRYABLE_PRISMA_CODES = new Set(['P1001', 'P1002']);

async function runWithDbRetry(action, retries = 6, delayMs = 1000) {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await action();
    } catch (error) {
      lastError = error;
      const isRetryable = RETRYABLE_PRISMA_CODES.has(error?.code);
      if (!isRetryable || attempt === retries) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
    }
  }

  throw lastError;
}

function toSafeAuthUser(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    approvalStatus: user.approvalStatus,
    profile: {
      fullName: user.profile?.fullName || null,
      establishmentName: user.profile?.establishmentName || null,
      establishmentType: user.profile?.establishmentType || null,
      phone: user.profile?.phone || null,
      wilaya: user.profile?.wilaya || null,
      address: user.profile?.address || null,
      avatarUrl: user.profile?.avatarUrl || null,
    },
  };
}

async function registerUser(input) {
  const email = input.email.toLowerCase().trim();
  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  const isAdmin = adminEmails.includes(email);

  const existingUser = await runWithDbRetry(() =>
    prisma.user.findUnique({ where: { email } })
  );
  const existingWaiting = await runWithDbRetry(() =>
    prisma.waitingList.findUnique({ where: { email } })
  );

  if (existingUser || existingWaiting) {
    const error = new Error('Cet email existe déjà.');
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  if (isAdmin) {
    const user = await runWithDbRetry(() =>
      prisma.user.create({
        data: {
          email,
          passwordHash,
          role: 'administrator',
          approvalStatus: 'approved',
          approvedAt: new Date(),
          profile: {
            create: {
              fullName: input.fullName,
              establishmentName: input.establishmentName,
              establishmentType: input.establishmentType,
              certificateFileName: input.certificateFileName,
              certificateFileData: input.certificateFileData,
              certificateMimeType: input.certificateMimeType || null,
              phone: input.phone || null,
              wilaya: input.wilaya || null,
              address: input.address || null,
            },
          },
        },
        include: { profile: true },
      })
    );

    const token = signAuthToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return { token, user: toSafeAuthUser(user) };
  }

  const waiting = await runWithDbRetry(() =>
    prisma.waitingList.create({
      data: {
        email,
        passwordHash,
        fullName: input.fullName,
        establishmentName: input.establishmentName,
        establishmentType: input.establishmentType,
        certificateFileName: input.certificateFileName,
        certificateFileData: input.certificateFileData,
        certificateMimeType: input.certificateMimeType || null,
        phone: input.phone || null,
        wilaya: input.wilaya || null,
        address: input.address || null,
      },
    })
  );

  return {
    pendingApproval: true,
    message: 'Compte en attente de validation. Veuillez patienter.',
    user: {
      email: waiting.email,
      fullName: waiting.fullName,
      establishmentName: waiting.establishmentName,
    },
  };
}

async function loginUser(input) {
  const email = input.email.toLowerCase().trim();

  const user = await runWithDbRetry(() =>
    prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    })
  );

  if (!user) {
    const error = new Error('Email ou mot de passe invalide.');
    error.statusCode = 401;
    throw error;
  }

  const ok = await bcrypt.compare(input.password, user.passwordHash);

  if (!ok) {
    const error = new Error('Email ou mot de passe invalide.');
    error.statusCode = 401;
    throw error;
  }

  if (user.role !== 'administrator' && user.approvalStatus !== 'approved') {
    const error = new Error('Votre compte est en attente de validation par un administrateur.');
    error.statusCode = 403;
    throw error;
  }

  const token = signAuthToken({ userId: user.id, email: user.email, role: user.role });

  return { token, user: toSafeAuthUser(user) };
}

async function forgotPassword(input) {
  const email = input.email.toLowerCase().trim();

  console.log('=== FORGOT PASSWORD CALLED for:', email, '===');
  console.log('SMTP_HOST:', process.env.SMTP_HOST);
  console.log('SMTP_PORT:', process.env.SMTP_PORT);
  console.log('SMTP_USER:', process.env.SMTP_USER);
  console.log('SMTP_PASS set:', !!process.env.SMTP_PASS);

  const user = await runWithDbRetry(() =>
    prisma.user.findUnique({ where: { email } })
  );

  console.log('User found in DB:', !!user);

  if (!user) {
    console.log('No user found - returning early');
    return {
      message: 'Si un compte existe avec cette adresse email, vous recevrez un lien de reinitialisation.',
    };
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await runWithDbRetry(() =>
    prisma.passwordReset.create({
      data: { email, token: resetToken, expiresAt },
    })
  );

  console.log('Reset token saved to DB');

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const subject = 'Réinitialiser votre mot de passe - SAYDALYATI';
  const text = `Bonjour,\n\nCliquez sur ce lien pour réinitialiser votre mot de passe:\n${resetLink}\n\nCe lien expirera dans 1 heure.\n\nCordialement,\nSAYDALYATI`;
  const html = `<p>Bonjour,</p><p><a href="${resetLink}" style="background-color:#14b8a6;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;display:inline-block;">Réinitialiser mon mot de passe</a></p><p>Ce lien expirera dans 1 heure.</p><p>Cordialement,<br/>SAYDALYATI</p>`;

  console.log('Sending email to:', email);

  try {
    const result = await sendEmail({ to: email, subject, text, html });
    console.log('Email result:', result);
  } catch (err) {
    console.error('Email sending failed:', {
      message: err.message,
      code: err.code,
      response: err.response,
    });
  }

  return {
    message: 'Si un compte existe avec cette adresse email, vous recevrez un lien de reinitialisation.',
  };
}

async function resetPassword(input) {
  const resetRecord = await runWithDbRetry(() =>
    prisma.passwordReset.findUnique({ where: { token: input.token } })
  );

  if (!resetRecord) {
    const error = new Error('Le lien de réinitialisation est invalide ou a expiré.');
    error.statusCode = 400;
    throw error;
  }

  if (new Date() > resetRecord.expiresAt) {
    await runWithDbRetry(() =>
      prisma.passwordReset.delete({ where: { token: input.token } })
    );
    const error = new Error('Le lien de réinitialisation a expiré.');
    error.statusCode = 400;
    throw error;
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  const user = await runWithDbRetry(() =>
    prisma.user.update({
      where: { email: resetRecord.email },
      data: { passwordHash },
      include: { profile: true },
    })
  );

  await runWithDbRetry(() =>
    prisma.passwordReset.delete({ where: { token: input.token } })
  );

  return {
    message: 'Votre mot de passe a été réinitialisé avec succès.',
    user: toSafeAuthUser(user),
  };
}

module.exports = {
  registerUser,
  loginUser,
  toSafeAuthUser,
  forgotPassword,
  resetPassword,
};