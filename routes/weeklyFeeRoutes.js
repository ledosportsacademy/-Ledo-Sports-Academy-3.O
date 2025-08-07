const express = require('express');
const router = express.Router();
const weeklyFeeController = require('../controllers/weeklyFeeController');

// GET all weekly fees
router.get('/', weeklyFeeController.getAllWeeklyFees);

// GET weekly fees for a specific member
router.get('/member/:memberId', weeklyFeeController.getWeeklyFeesByMemberId);

// POST a new weekly fee for a member
router.post('/', weeklyFeeController.createWeeklyFee);

// PUT (update) weekly fees for a member
router.put('/member/:memberId', weeklyFeeController.updateWeeklyFee);

// POST add a payment to a member's weekly fees
router.post('/member/:memberId/payment', weeklyFeeController.addPayment);

// PUT update a payment status
router.put('/member/:memberId/payment/:paymentIndex', weeklyFeeController.updatePaymentStatus);

// DELETE weekly fees for a member
router.delete('/member/:memberId', weeklyFeeController.deleteWeeklyFee);

module.exports = router;