const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const { auth } = require('../middleware/auth');

// @route   GET /api/gallery
// @desc    Get all gallery items
// @access  Public
router.get('/', galleryController.getAllGalleryItems);

// @route   GET /api/gallery/featured
// @desc    Get featured gallery items
// @access  Public
router.get('/featured', galleryController.getFeaturedGalleryItems);

// @route   GET /api/gallery/:id
// @desc    Get gallery item by ID
// @access  Public
router.get('/:id', galleryController.getGalleryItemById);

// @route   POST /api/gallery
// @desc    Create a new gallery item
// @access  Private
router.post('/', auth, galleryController.createGalleryItem);

// @route   PUT /api/gallery/:id
// @desc    Update a gallery item
// @access  Private
router.put('/:id', auth, galleryController.updateGalleryItem);

// @route   DELETE /api/gallery/:id
// @desc    Delete a gallery item
// @access  Private
router.delete('/:id', auth, galleryController.deleteGalleryItem);

// @route   PUT /api/gallery/featured/order
// @desc    Update featured gallery items order
// @access  Private
router.put('/featured/order', auth, galleryController.updateFeaturedItemsOrder);

// @route   PATCH /api/gallery/:id/featured
// @desc    Toggle featured status of a gallery item
// @access  Private
router.patch('/:id/featured', auth, galleryController.toggleFeaturedStatus);

module.exports = router;