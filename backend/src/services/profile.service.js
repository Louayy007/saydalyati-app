/**
 * User Profile Service
 * Handles business logic for user profile operations
 */

const prisma = require('../prisma');

// Prisma error codes that can be retried on temporary database issues
const RETRYABLE_PRISMA_CODES = new Set(['P1001', 'P1002']);

/**
 * Execute database action with automatic retry logic
 * Retries on temporary connection failures with exponential backoff
 * @param {Function} action - Async function to execute
 * @param {number} retries - Maximum number of retry attempts (default 6)
 * @param {number} delayMs - Base delay in milliseconds for exponential backoff (default 1000)
 * @returns {*} Result of action
 */
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

/**
 * Transform database user object to API response format
 * Excludes sensitive fields
 * @param {Object} user - User object from database
 * @returns {Object} Formatted user object
 */
function mapProfile(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    profile: user.profile, // Associated profile data
  };
}

/**
 * Retrieve current user's profile
 * @param {string} userId - User ID to fetch profile for
 * @returns {Object} User with profile information
 * @throws {Error} 404 if user not found
 */
async function getMyProfile(userId) {
  const user = await runWithDbRetry(() =>
    prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }, // Include related profile data
    })
  );

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return mapProfile(user);
}

/**
 * Update current user's profile information
 * Only updates fields provided in input (partial update)
 * @param {string} userId - User ID to update
 * @param {Object} input - Fields to update
 * @returns {Object} Updated user with profile
 * @throws {Error} 404 if user not found
 */
async function updateMyProfile(userId, input) {
  // Verify user exists
  const user = await runWithDbRetry(() =>
    prisma.user.findUnique({ where: { id: userId }, include: { profile: true } })
  );
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  // Update profile with provided fields
  const updatedProfile = await runWithDbRetry(() =>
    prisma.profile.update({
      where: { userId }, // Profile is linked to user via userId
      data: input,       // Only provided fields will be updated
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
