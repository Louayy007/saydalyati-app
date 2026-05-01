/**
 * Authentication Middleware
 * Verifies JWT tokens and protects routes from unauthorized access
 */

const jwt = require('jsonwebtoken');

/**
 * Middleware to require valid JWT authentication
 * Extracts and validates token from Authorization header
 * Attaches decoded token payload to req.auth for use in route handlers
 */
function requireAuth(req, res, next) {
  // Extract token from Authorization header (expect: "Bearer <token>")
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  // Return 401 if no token provided
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Verify token with JWT secret
    const secret = process.env.JWT_SECRET || 'dev-secret-change-me';
    const payload = jwt.verify(token, secret);
    // Attach decoded token to request for later use
    req.auth = payload;
    return next();
  } catch (error) {
    // Return 401 if token is invalid or expired
    return res.status(401).json({ message: 'Invalid token' });
  }
}

/**
 * Middleware to require administrator role
 * Must be used after requireAuth middleware
 * Only allows requests from users with 'administrator' role
 */
function requireAdmin(req, res, next) {
  // Check if user is authenticated
  if (!req.auth) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Check if user has administrator role
  if (req.auth.role !== 'administrator') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  return next();
}

module.exports = {
  requireAuth,
  requireAdmin,
};
