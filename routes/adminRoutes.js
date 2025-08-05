const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth, superAdmin } = require('../middleware/auth');

// @route   POST /api/admin/login
// @desc    Login admin
// @access  Public
router.post('/login', adminController.loginAdmin);

// @route   GET /api/admin/profile
// @desc    Get admin profile
// @access  Private
router.get('/profile', auth, adminController.getAdminProfile);

// @route   POST /api/admin
// @desc    Create a new admin (super admin only)
// @access  Private/SuperAdmin
router.post('/', superAdmin, adminController.createAdmin);

// @route   PUT /api/admin/password
// @desc    Update admin password
// @access  Private
router.put('/password', auth, adminController.updatePassword);

// @route   GET /api/admin
// @desc    Get all admins (super admin only)
// @access  Private/SuperAdmin
router.get('/', superAdmin, adminController.getAllAdmins);

// @route   DELETE /api/admin/:id
// @desc    Delete an admin (super admin only)
// @access  Private/SuperAdmin
router.delete('/:id', superAdmin, adminController.deleteAdmin);

module.exports = router;