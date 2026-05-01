/**
 * Authentication Service
 * Handles business logic for user registration and login
 * Manages passwords, user approval workflow, and JWT token generation
 */

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const prisma = require('../prisma');
const { signAuthToken } = require('../utils/jwt');
const { sendEmail } = require('../utils/mailer');

// Prisma error codes that can be retried on temporary database issues
const RETRYABLE_PRISMA_CODES = new Set(['P1001', 'P1002']);

/**
 * Execute database action with automatic retry logic
 * Retries on temporary connection failures with exponential backoff
 * @param {Function} action - Async function to execute
 * @param {number} retries - Maximum number of retry attempts (default 6)
 * @param {number} delayMs - Base delay in milliseconds for exponential backoff (default 1000)
 * @returns {*} Result of action
 * @throws {Error} Throws last error if all retries fail
 */
async function runWithDbRetry(action, retries = 6, delayMs = 1000) {
  let lastError;

  // Attempt to execute up to retries + 1 times (1 attempt + retries)
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await action();
    } catch (error) {
      lastError = error;
      // Check if error is temporary/retryable
      const isRetryable = RETRYABLE_PRISMA_CODES.has(error?.code);
      // Stop retrying if error is not retryable or we've exhausted retries
      if (!isRetryable || attempt === retries) {
        break;
      }

      // Wait before retrying with exponential backoff
      await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
    }
  }

  // If all retries failed, throw the last error
  throw lastError;
}

/**
 * Convert database user object to safe object for frontend
 * Excludes sensitive data like password hash
 * @param {Object} user - User object with profile
 * @returns {Object} Safe user object for API responses
 */
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

/**
 * Register a new user account
 * Creates user with hashed password and profile information
 * Automatically approves admin accounts, marks others as pending
 * Email validation required - admins auto-approved via ADMIN_EMAILS env var
 * @param {Object} input - Registration data
 * @returns {Object} New user object and auth token (if auto-approved) or pending status
 */
async function registerUser(input) {
  // Normalize email for consistency
  const email = input.email.toLowerCase().trim();
  
  // Get list of admin emails from environment variable
  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  // Check if registering user is an admin
  const isAdmin = adminEmails.includes(email);

  // Check if email already exists
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

  // Hash password with bcrypt (10 salt rounds)
  const passwordHash = await bcrypt.hash(input.password, 10);

  // Create user with profile in database
  const user = await runWithDbRetry(() =>
    prisma.user.create({
      data: {
        email,
        passwordHash,
        // Admins get 'administrator' role, others get 'usersimple'
        role: isAdmin ? 'administrator' : 'usersimple',
        // Admins are auto-approved, others need approval workflow
        approvalStatus: isAdmin ? 'approved' : 'pending',
        approvedAt: isAdmin ? new Date() : null,
        // Create associated profile
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

  // If not auto-approved, return pending status without token
  if (user.approvalStatus !== 'approved') {
    return {
      pendingApproval: true,
      message: 'Compte cree. En attente de validation par un administrateur.',
      user: toSafeAuthUser(user),
    };
  }

  // Generate JWT token for auto-approved users
  const token = signAuthToken({ userId: user.id, email: user.email, role: user.role });

  return {
    token,
    user: toSafeAuthUser(user),
  };
}

/**
 * Authenticate user login with email and password
 * Validates credentials and checks approval status
 * Returns JWT token on successful authentication
 * @param {Object} input - Login credentials (email, password)
 * @returns {Object} JWT token and user object
 * @throws {Error} If credentials invalid, user not found, or pending approval
 */
async function loginUser(input) {
  // Normalize email
  const email = input.email.toLowerCase().trim();

  // Fetch user with profile from database
  const user = await runWithDbRetry(() =>
    prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    })
  );

  // User not found
  if (!user) {
    const error = new Error('Email ou mot de passe invalide.');
    error.statusCode = 401;
    throw error;
  }

  // Compare provided password with stored hash
  const ok = await bcrypt.compare(input.password, user.passwordHash);
  if (!ok) {
    const error = new Error('Email ou mot de passe invalide.');
    error.statusCode = 401;
    throw error;
  }

  // Check if user is approved (admins bypass approval check)
  if (user.role !== 'administrator' && user.approvalStatus !== 'approved') {
    const error = new Error('Votre compte est en attente de validation par un administrateur.');
    error.statusCode = 403;
    throw error;
  }

  // Generate JWT token with user info
  const token = signAuthToken({ userId: user.id, email: user.email, role: user.role });

  return {
    token,
    user: toSafeAuthUser(user),
  };
}

/**
 * Forgot password request - sends reset email
 * Always returns success message for security (doesn't reveal if email exists)
 * @param {Object} input - Request data with email
 * @returns {Object} Success message
 */
async function forgotPassword(input) {
  const email = input.email.toLowerCase().trim();

  // Try to find user with this email
  const user = await runWithDbRetry(() =>
    prisma.user.findUnique({ where: { email } })
  );

  // Generate reset token and hash it for storage
  const resetToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Token valid for 24 hours
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  // Only create reset record if user exists
  if (user) {
    await runWithDbRetry(() =>
      prisma.passwordReset.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt,
        },
      })
    );

    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Réinitialiser votre mot de passe - SAYDALYATI',
      html: `
        <h2>Réinitialisation de mot de passe</h2>
        <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
        <p><a href="${resetUrl}">Cliquez ici pour réinitialiser votre mot de passe</a></p>
        <p>Ce lien expire dans 24 heures.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
      `,
      text: `Cliquez sur ce lien pour réinitialiser votre mot de passe: ${resetUrl}`,
    });
  }

  // Always return success message (security best practice)
  return {
    message: 'Si un compte existe avec cette adresse email, vous recevrez un lien de reinitialisation.',
  };
}

/**
 * Reset password with token
 * Validates reset token and updates user password
 * @param {Object} input - Reset data with token and new password
 * @returns {Object} Success message
 */
async function resetPassword(input) {
  const { token, password } = input;

  // Hash the token to compare with stored hash
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  // Find valid password reset record
  const resetRecord = await runWithDbRetry(() =>
    prisma.passwordReset.findFirst({
      where: {
        tokenHash,
        usedAt: null, // Token not yet used
        expiresAt: {
          gt: new Date(), // Token not expired
        },
      },
    })
  );

  if (!resetRecord) {
    const error = new Error('Le lien de reinitialisation est invalide ou a expire.');
    error.statusCode = 400;
    throw error;
  }

  // Hash the new password
  const passwordHash = await bcrypt.hash(password, 10);

  // Update user password and mark token as used in transaction
  const result = await runWithDbRetry(async () => {
    const updatedUser = await prisma.user.update({
      where: { id: resetRecord.userId },
      data: { passwordHash },
      include: { profile: true },
    });

    // Mark reset token as used
    await prisma.passwordReset.update({
      where: { id: resetRecord.id },
      data: { usedAt: new Date() },
    });

    return updatedUser;
  });

  return {
    message: 'Votre mot de passe a ete reinitialise avec succes.',
    user: toSafeAuthUser(result),
  };
}

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};
