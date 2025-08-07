const WeeklyFee = require('../models/WeeklyFee');

// Get all weekly fees
exports.getAllWeeklyFees = async (req, res) => {
  try {
    const weeklyFees = await WeeklyFee.find().sort({ memberId: 1 });
    res.status(200).json(weeklyFees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get weekly fees for a specific member
exports.getWeeklyFeesByMemberId = async (req, res) => {
  try {
    const { memberId } = req.params;
    const weeklyFees = await WeeklyFee.findOne({ memberId: parseInt(memberId) });
    
    if (!weeklyFees) {
      return res.status(404).json({ message: 'Weekly fees not found for this member' });
    }
    
    res.status(200).json(weeklyFees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create weekly fees for a member
exports.createWeeklyFee = async (req, res) => {
  try {
    const { memberId } = req.body;
    
    // Check if weekly fees already exist for this member
    const existingWeeklyFee = await WeeklyFee.findOne({ memberId });
    if (existingWeeklyFee) {
      return res.status(400).json({ message: 'Weekly fees already exist for this member' });
    }
    
    const newWeeklyFee = new WeeklyFee(req.body);
    const savedWeeklyFee = await newWeeklyFee.save();
    
    res.status(201).json(savedWeeklyFee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update weekly fees for a member
exports.updateWeeklyFee = async (req, res) => {
  try {
    const { memberId } = req.params;
    const updatedWeeklyFee = await WeeklyFee.findOneAndUpdate(
      { memberId: parseInt(memberId) },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedWeeklyFee) {
      return res.status(404).json({ message: 'Weekly fees not found for this member' });
    }
    
    res.status(200).json(updatedWeeklyFee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add a payment to a member's weekly fees
exports.addPayment = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { date, amount, status } = req.body;
    
    if (!date || !amount || !status) {
      return res.status(400).json({ message: 'Date, amount, and status are required' });
    }
    
    const weeklyFee = await WeeklyFee.findOne({ memberId: parseInt(memberId) });
    if (!weeklyFee) {
      return res.status(404).json({ message: 'Weekly fees not found for this member' });
    }
    
    weeklyFee.payments.push({ date, amount, status });
    const updatedWeeklyFee = await weeklyFee.save();
    
    res.status(200).json(updatedWeeklyFee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a payment status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { memberId, paymentIndex } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    const weeklyFee = await WeeklyFee.findOne({ memberId: parseInt(memberId) });
    if (!weeklyFee) {
      return res.status(404).json({ message: 'Weekly fees not found for this member' });
    }
    
    const index = parseInt(paymentIndex);
    if (index < 0 || index >= weeklyFee.payments.length) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    weeklyFee.payments[index].status = status;
    const updatedWeeklyFee = await weeklyFee.save();
    
    res.status(200).json(updatedWeeklyFee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete weekly fees for a member
exports.deleteWeeklyFee = async (req, res) => {
  try {
    const { memberId } = req.params;
    const deletedWeeklyFee = await WeeklyFee.findOneAndDelete({ memberId: parseInt(memberId) });
    
    if (!deletedWeeklyFee) {
      return res.status(404).json({ message: 'Weekly fees not found for this member' });
    }
    
    res.status(200).json({ message: 'Weekly fees deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};