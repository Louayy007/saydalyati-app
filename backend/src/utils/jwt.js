const jwt = require('jsonwebtoken');

function signAuthToken(payload) {
  const secret = process.env.JWT_SECRET || 'dev-secret-change-me';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(payload, secret, { expiresIn });
}

module.exports = {
  signAuthToken,
};
