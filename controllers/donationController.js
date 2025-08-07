const Donation = require('../models/Donation');

// Get all donations
exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ date: -1 });
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single donation by ID
exports.getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findOne({ id: req.params.id });
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    res.status(200).json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new donation
exports.createDonation = async (req, res) => {
  try {
    // Find the highest existing ID and increment by 1
    const highestIdDonation = await Donation.findOne().sort({ id: -1 });
    const newId = highestIdDonation ? highestIdDonation.id + 1 : 1;
    
    const newDonation = new Donation({
      ...req.body,
      id: newId
    });
    
    const savedDonation = await newDonation.save();
    res.status(201).json(savedDonation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a donation
exports.updateDonation = async (req, res) => {
  try {
    const updatedDonation = await Donation.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedDonation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    
    res.status(200).json(updatedDonation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a donation
exports.deleteDonation = async (req, res) => {
  try {
    const deletedDonation = await Donation.findOneAndDelete({ id: req.params.id });
    
    if (!deletedDonation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    
    res.status(200).json({ message: 'Donation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get total donations amount
exports.getTotalDonations = async (req, res) => {
  try {
    const result = await Donation.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);
    
    const totalAmount = result.length > 0 ? result[0].total : 0;
    res.status(200).json({ total: totalAmount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};