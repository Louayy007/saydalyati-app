/**
 * JWT Token Utility
 * Handles signing and validation of authentication tokens
 */

const jwt = require('jsonwebtoken');

/**
 * Create a signed JWT token for authentication
 * Token expires after 7 days by default
 * @param {object} payload - Data to encode in token (userId, email, role)
 * @returns {string} Signed JWT token
 */
function signAuthToken(payload) {
  const secret = process.env.JWT_SECRET || 'dev-secret-change-me';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(payload, secret, { expiresIn });
}

module.exports = {
  signAuthToken,
};
