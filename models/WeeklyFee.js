const mongoose = require('mongoose');

const WeeklyFeeSchema = new mongoose.Schema({
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true
  },
  weekStartDate: {
    type: Date,
    required: true
  },
  weekEndDate: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    default: 20
  },
  paymentDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Pending', 'Waived'],
    default: 'Paid'
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Bank Transfer', 'UPI', 'Other'],
    default: 'Cash'
  },
  notes: {
    type: String,
    trim: true
  },
  collectedBy: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WeeklyFee', WeeklyFeeSchema);