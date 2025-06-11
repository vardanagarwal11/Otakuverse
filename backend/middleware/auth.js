import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware to verify JWT token and attach user to request
 */
export const authenticateToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Authentication Error',
        message: 'No token provided'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({
        error: 'Authentication Error',
        message: 'User not found'
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Authentication Error',
        message: 'Invalid token'
      });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Authentication Error',
        message: 'Token expired'
      });
    }
    console.error('Auth middleware error:', err);
    res.status(500).json({
      error: 'Server Error',
      message: 'Authentication failed'
    });
  }
};

/**
 * Middleware to check if user is admin
 */
export const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({
      error: 'Authorization Error',
      message: 'Admin access required'
    });
  }
  next();
}; 