const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'dev-secret-change-me';
    const payload = jwt.verify(token, secret);
    req.auth = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function requireAdmin(req, res, next) {
  if (!req.auth) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.auth.role !== 'administrator') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  return next();
}

module.exports = {
  requireAuth,
  requireAdmin,
};
