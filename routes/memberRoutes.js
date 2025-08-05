const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const { auth } = require('../middleware/auth');

// @route   GET /api/members
// @desc    Get all members
// @access  Private
router.get('/', auth, memberController.getAllMembers);

// @route   GET /api/members/count
// @desc    Get total count of active members
// @access  Private
router.get('/count', auth, memberController.getActiveMembersCount);

// @route   GET /api/members/:id
// @desc    Get member by ID
// @access  Private
router.get('/:id', auth, memberController.getMemberById);

// @route   POST /api/members
// @desc    Create a new member
// @access  Private
router.post('/', auth, memberController.createMember);

// @route   PUT /api/members/:id
// @desc    Update a member
// @access  Private
router.put('/:id', auth, memberController.updateMember);

// @route   DELETE /api/members/:id
// @desc    Delete a member
// @access  Private
router.delete('/:id', auth, memberController.deleteMember);

// @route   PATCH /api/members/:id/status
// @desc    Update member active status
// @access  Private
router.patch('/:id/status', auth, memberController.updateMemberStatus);

module.exports = router;