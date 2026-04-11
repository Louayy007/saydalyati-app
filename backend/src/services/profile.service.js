const prisma = require('../prisma');

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

function mapProfile(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    profile: user.profile,
  };
}

async function getMyProfile(userId) {
  const user = await runWithDbRetry(() =>
    prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    })
  );

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return mapProfile(user);
}

async function updateMyProfile(userId, input) {
  const user = await runWithDbRetry(() =>
    prisma.user.findUnique({ where: { id: userId }, include: { profile: true } })
  );
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const updatedProfile = await runWithDbRetry(() =>
    prisma.profile.update({
      where: { userId },
      data: input,
    })
  );

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    profile: updatedProfile,
  };
}

module.exports = {
  getMyProfile,
  updateMyProfile,
};
