const Donation = require('../models/Donation');

// Get all donations
exports.getAllDonations = async (req, res) => {
  try {
    const { startDate, endDate, minAmount, maxAmount, paymentMethod } = req.query;
    let query = {};
    
    // Apply date range filter if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    // Apply amount range filter if provided
    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = Number(minAmount);
      if (maxAmount) query.amount.$lte = Number(maxAmount);
    }
    
    // Apply payment method filter if provided
    if (paymentMethod) {
      query.paymentMethod = paymentMethod;
    }
    
    const donations = await Donation.find(query).sort({ date: -1 });
    res.status(200).json(donations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single donation by ID
exports.getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    
    res.status(200).json(donation);
  } catch (error) {
    console.error('Error fetching donation:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new donation
exports.createDonation = async (req, res) => {
  try {
    const { 
      donorName, 
      amount, 
      date, 
      purpose, 
      contactInfo, 
      paymentMethod,
      notes,
      receiptNumber 
    } = req.body;
    
    const newDonation = new Donation({
      donorName,
      amount,
      date: date || Date.now(),
      purpose: purpose || 'General',
      contactInfo,
      paymentMethod: paymentMethod || 'Cash',
      notes,
      receiptNumber
    });
    
    const savedDonation = await newDonation.save();
    res.status(201).json(savedDonation);
  } catch (error) {
    console.error('Error creating donation:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a donation
exports.updateDonation = async (req, res) => {
  try {
    const { 
      donorName, 
      amount, 
      date, 
      purpose, 
      contactInfo, 
      paymentMethod,
      notes,
      receiptNumber 
    } = req.body;
    
    const updatedDonation = await Donation.findByIdAndUpdate(
      req.params.id,
      {
        donorName,
        amount,
        date,
        purpose,
        contactInfo,
        paymentMethod,
        notes,
        receiptNumber,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedDonation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    
    res.status(200).json(updatedDonation);
  } catch (error) {
    console.error('Error updating donation:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a donation
exports.deleteDonation = async (req, res) => {
  try {
    const deletedDonation = await Donation.findByIdAndDelete(req.params.id);
    
    if (!deletedDonation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    
    res.status(200).json({ message: 'Donation deleted successfully' });
  } catch (error) {
    console.error('Error deleting donation:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get donation statistics
exports.getDonationStats = async (req, res) => {
  try {
    const totalAmount = await Donation.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const donationsByMonth = await Donation.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    const donationsByPurpose = await Donation.aggregate([
      {
        $group: {
          _id: '$purpose',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);
    
    res.status(200).json({
      totalAmount: totalAmount.length > 0 ? totalAmount[0].total : 0,
      donationsByMonth,
      donationsByPurpose
    });
  } catch (error) {
    console.error('Error getting donation statistics:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};