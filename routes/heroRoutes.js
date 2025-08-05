const express = require('express');
const router = express.Router();
const heroController = require('../controllers/heroController');
const { auth } = require('../middleware/auth');

// @route   GET /api/hero
// @desc    Get all hero slides
// @access  Public
router.get('/', heroController.getAllHeroSlides);

// @route   GET /api/hero/:id
// @desc    Get hero slide by ID
// @access  Public
router.get('/:id', heroController.getHeroSlideById);

// @route   POST /api/hero
// @desc    Create a new hero slide
// @access  Private
router.post('/', auth, heroController.createHeroSlide);

// @route   PUT /api/hero/:id
// @desc    Update a hero slide
// @access  Private
router.put('/:id', auth, heroController.updateHeroSlide);

// @route   DELETE /api/hero/:id
// @desc    Delete a hero slide
// @access  Private
router.delete('/:id', auth, heroController.deleteHeroSlide);

// @route   PUT /api/hero/order
// @desc    Update hero slides order
// @access  Private
router.put('/order', auth, heroController.updateHeroSlidesOrder);

module.exports = router;