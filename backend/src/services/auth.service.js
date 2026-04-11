const bcrypt = require('bcryptjs');
const prisma = require('../prisma');
const { signAuthToken } = require('../utils/jwt');

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

  const existing = await runWithDbRetry(() => prisma.user.findUnique({ where: { email } }));
  if (existing) {
    const error = new Error(
      existing.approvalStatus === 'pending'
        ? 'Ce compte existe deja et il est en attente de validation admin.'
        : 'Cet email existe deja. Connectez-vous ou utilisez un autre email.'
    );
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  const user = await runWithDbRetry(() =>
    prisma.user.create({
      data: {
        email,
        passwordHash,
        role: isAdmin ? 'administrator' : 'usersimple',
        approvalStatus: isAdmin ? 'approved' : 'pending',
        approvedAt: isAdmin ? new Date() : null,
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
      include: {
        profile: true,
      },
    })
  );

  if (user.approvalStatus !== 'approved') {
    return {
      pendingApproval: true,
      message: 'Compte cree. En attente de validation par un administrateur.',
      user: toSafeAuthUser(user),
    };
  }

  const token = signAuthToken({ userId: user.id, email: user.email, role: user.role });

  return {
    token,
    user: toSafeAuthUser(user),
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

  return {
    token,
    user: toSafeAuthUser(user),
  };
}

module.exports = {
  registerUser,
  loginUser,
};
