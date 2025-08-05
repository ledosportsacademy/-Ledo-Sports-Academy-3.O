const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Login admin
exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if admin exists
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Update last login
    admin.lastLogin = Date.now();
    await admin.save();
    
    // Create JWT token
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    res.status(200).json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Error logging in admin:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get admin profile
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    res.status(200).json(admin);
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new admin (only super admin can do this)
exports.createAdmin = async (req, res) => {
  try {
    // Check if requester is super admin
    if (req.admin.role !== 'superadmin') {
      return res.status(403).json({ message: 'Not authorized to create admins' });
    }
    
    const { username, password, name, email, role } = req.body;
    
    // Check if username or email already exists
    const existingAdmin = await Admin.findOne({ $or: [{ username }, { email }] });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    
    const newAdmin = new Admin({
      username,
      password,
      name,
      email,
      role: role || 'admin'
    });
    
    const savedAdmin = await newAdmin.save();
    
    res.status(201).json({
      message: 'Admin created successfully',
      admin: {
        id: savedAdmin._id,
        username: savedAdmin.username,
        name: savedAdmin.name,
        email: savedAdmin.email,
        role: savedAdmin.role
      }
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update admin password
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    // Verify current password
    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Update password
    admin.password = newPassword;
    admin.updatedAt = Date.now();
    
    await admin.save();
    
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating admin password:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Initialize default admin if none exists
exports.initializeAdmin = async () => {
  try {
    // Set a timeout for the database operation
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database operation timed out')), 3000);
    });
    
    // Try to check if admin exists with a timeout
    const checkAdminPromise = Admin.countDocuments();
    
    // Race between the database operation and the timeout
    const adminCount = await Promise.race([checkAdminPromise, timeoutPromise]);
    
    if (adminCount === 0) {
      try {
        // Create default admin
        const defaultAdmin = new Admin({
          username: 'admin',
          password: 'ledosports2024',
          name: 'Admin',
          email: 'admin@ledosportsacademy.com',
          role: 'superadmin'
        });
        
        // Set another timeout for saving the admin
        const saveTimeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Admin save operation timed out')), 3000);
        });
        
        // Try to save the admin with a timeout
        await Promise.race([defaultAdmin.save(), saveTimeoutPromise]);
        console.log('Default admin account created');
      } catch (saveError) {
        console.warn('Error saving default admin:', saveError.message);
        console.log('Continuing in frontend-only mode');
      }
    }
  } catch (error) {
    console.warn('MongoDB connection issue:', error.message);
    console.log('Running in frontend-only mode - admin features will use client-side authentication');
  }
};

// Get all admins (only super admin can do this)
exports.getAllAdmins = async (req, res) => {
  try {
    // Check if requester is super admin
    if (req.admin.role !== 'superadmin') {
      return res.status(403).json({ message: 'Not authorized to view all admins' });
    }
    
    const admins = await Admin.find().select('-password');
    res.status(200).json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete an admin (only super admin can do this)
exports.deleteAdmin = async (req, res) => {
  try {
    // Check if requester is super admin
    if (req.admin.role !== 'superadmin') {
      return res.status(403).json({ message: 'Not authorized to delete admins' });
    }
    
    // Prevent deleting self
    if (req.params.id === req.admin.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    
    const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
    
    if (!deletedAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};