const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Middleware to authenticate admin users
exports.auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('x-auth-token');
    
    // Check if no token
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add admin from payload to request
    req.admin = decoded;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to check if user is super admin
exports.superAdmin = async (req, res, next) => {
  try {
    // First run the auth middleware
    await exports.auth(req, res, async () => {
      // Check if admin exists and is super admin
      const admin = await Admin.findById(req.admin.id);
      
      if (!admin || admin.role !== 'superadmin') {
        return res.status(403).json({ message: 'Access denied. Super admin privileges required.' });
      }
      
      next();
    });
  } catch (error) {
    console.error('Super admin check error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};