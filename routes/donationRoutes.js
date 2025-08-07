const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');

// GET all donations
router.get('/', donationController.getAllDonations);

// GET total donations amount
router.get('/total', donationController.getTotalDonations);

// GET a single donation by ID
router.get('/:id', donationController.getDonationById);

// POST a new donation
router.post('/', donationController.createDonation);

// PUT (update) a donation
router.put('/:id', donationController.updateDonation);

// DELETE a donation
router.delete('/:id', donationController.deleteDonation);

module.exports = router;