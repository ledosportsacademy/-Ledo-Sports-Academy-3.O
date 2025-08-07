const express = require('express');
const router = express.Router();
const experienceController = require('../controllers/experienceController');

// GET all experiences
router.get('/', experienceController.getAllExperiences);

// GET a single experience by ID
router.get('/:id', experienceController.getExperienceById);

// POST a new experience
router.post('/', experienceController.createExperience);

// PUT (update) an experience
router.put('/:id', experienceController.updateExperience);

// DELETE an experience
router.delete('/:id', experienceController.deleteExperience);

module.exports = router;