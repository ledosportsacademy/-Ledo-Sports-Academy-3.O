const express = require('express');
const router = express.Router();
const weeklyFeeController = require('../controllers/weeklyFeeController');
const { auth } = require('../middleware/auth');

// @route   GET /api/weekly-fees
// @desc    Get all weekly fees
// @access  Private
router.get('/', auth, weeklyFeeController.getAllWeeklyFees);

// @route   GET /api/weekly-fees/stats
// @desc    Get weekly fee statistics
// @access  Private
router.get('/stats', auth, weeklyFeeController.getWeeklyFeeStats);

// @route   GET /api/weekly-fees/member/:memberId
// @desc    Get weekly fees by member ID
// @access  Private
router.get('/member/:memberId', auth, weeklyFeeController.getWeeklyFeesByMember);

// @route   GET /api/weekly-fees/:id
// @desc    Get weekly fee by ID
// @access  Private
router.get('/:id', auth, weeklyFeeController.getWeeklyFeeById);

// @route   POST /api/weekly-fees
// @desc    Create a new weekly fee
// @access  Private
router.post('/', auth, weeklyFeeController.createWeeklyFee);

// @route   POST /api/weekly-fees/batch
// @desc    Create weekly fees for all active members
// @access  Private
router.post('/batch', auth, weeklyFeeController.createWeeklyFeesForAllMembers);

// @route   PUT /api/weekly-fees/:id
// @desc    Update a weekly fee
// @access  Private
router.put('/:id', auth, weeklyFeeController.updateWeeklyFee);

// @route   DELETE /api/weekly-fees/:id
// @desc    Delete a weekly fee
// @access  Private
router.delete('/:id', auth, weeklyFeeController.deleteWeeklyFee);

module.exports = router;