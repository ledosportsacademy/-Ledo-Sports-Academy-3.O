const express = require('express');
const router = express.Router();
const experienceController = require('../controllers/experienceController');
const { auth } = require('../middleware/auth');

// @route   GET /api/experiences
// @desc    Get all experiences
// @access  Public
router.get('/', experienceController.getAllExperiences);

// @route   GET /api/experiences/:id
// @desc    Get experience by ID
// @access  Public
router.get('/:id', experienceController.getExperienceById);

// @route   POST /api/experiences
// @desc    Create a new experience
// @access  Private
router.post('/', auth, experienceController.createExperience);

// @route   PUT /api/experiences/:id
// @desc    Update an experience
// @access  Private
router.put('/:id', auth, experienceController.updateExperience);

// @route   DELETE /api/experiences/:id
// @desc    Delete an experience
// @access  Private
router.delete('/:id', auth, experienceController.deleteExperience);

// @route   POST /api/experiences/:id/images
// @desc    Add images to an experience
// @access  Private
router.post('/:id/images', auth, experienceController.addExperienceImages);

// @route   DELETE /api/experiences/:id/images
// @desc    Remove images from an experience
// @access  Private
router.delete('/:id/images', auth, experienceController.removeExperienceImages);

module.exports = router;