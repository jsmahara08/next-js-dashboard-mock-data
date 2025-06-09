const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to check authentication
async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);
    
    if (!user || user.status !== 'active') {
      return res.status(403).json({ error: 'Invalid or inactive user' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
}

// Middleware to check admin role
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

// Middleware to check editor or admin role
function requireEditor(req, res, next) {
  if (!['admin', 'editor'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Editor or admin access required' });
  }
  next();
}

module.exports = {
  authenticateToken,
  requireAdmin,
  requireEditor
};