const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const { auth } = require('../middleware/auth');

// @route   GET /api/donations
// @desc    Get all donations
// @access  Private
router.get('/', auth, donationController.getAllDonations);

// @route   GET /api/donations/stats
// @desc    Get donation statistics
// @access  Private
router.get('/stats', auth, donationController.getDonationStats);

// @route   GET /api/donations/:id
// @desc    Get donation by ID
// @access  Private
router.get('/:id', auth, donationController.getDonationById);

// @route   POST /api/donations
// @desc    Create a new donation
// @access  Private
router.post('/', auth, donationController.createDonation);

// @route   PUT /api/donations/:id
// @desc    Update a donation
// @access  Private
router.put('/:id', auth, donationController.updateDonation);

// @route   DELETE /api/donations/:id
// @desc    Delete a donation
// @access  Private
router.delete('/:id', auth, donationController.deleteDonation);

module.exports = router;