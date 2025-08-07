const express = require('express');
const router = express.Router();
const heroSlideController = require('../controllers/heroSlideController');

// GET all hero slides
router.get('/', heroSlideController.getAllHeroSlides);

// GET a single hero slide by ID
router.get('/:id', heroSlideController.getHeroSlideById);

// POST a new hero slide
router.post('/', heroSlideController.createHeroSlide);

// PUT (update) a hero slide
router.put('/:id', heroSlideController.updateHeroSlide);

// DELETE a hero slide
router.delete('/:id', heroSlideController.deleteHeroSlide);

module.exports = router;