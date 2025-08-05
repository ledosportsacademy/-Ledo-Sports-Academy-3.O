const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { auth } = require('../middleware/auth');

// @route   GET /api/activities
// @desc    Get all activities
// @access  Public
router.get('/', activityController.getAllActivities);

// @route   GET /api/activities/recent
// @desc    Get recent activities
// @access  Public
router.get('/recent', activityController.getRecentActivities);

// @route   GET /api/activities/upcoming
// @desc    Get upcoming activities
// @access  Public
router.get('/upcoming', activityController.getUpcomingActivities);

// @route   GET /api/activities/:id
// @desc    Get activity by ID
// @access  Public
router.get('/:id', activityController.getActivityById);

// @route   POST /api/activities
// @desc    Create a new activity
// @access  Private
router.post('/', auth, activityController.createActivity);

// @route   PUT /api/activities/:id
// @desc    Update an activity
// @access  Private
router.put('/:id', auth, activityController.updateActivity);

// @route   DELETE /api/activities/:id
// @desc    Delete an activity
// @access  Private
router.delete('/:id', auth, activityController.deleteActivity);

// @route   PATCH /api/activities/:id/status
// @desc    Update activity status
// @access  Private
router.patch('/:id/status', auth, activityController.updateActivityStatus);

module.exports = router;