const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  donorName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);