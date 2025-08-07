const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');

// GET all activities
router.get('/', activityController.getAllActivities);

// GET activities by status (upcoming or recent)
router.get('/status/:status', activityController.getActivitiesByStatus);

// GET a single activity by ID
router.get('/:id', activityController.getActivityById);

// POST a new activity
router.post('/', activityController.createActivity);

// PUT (update) an activity
router.put('/:id', activityController.updateActivity);

// DELETE an activity
router.delete('/:id', activityController.deleteActivity);

module.exports = router;