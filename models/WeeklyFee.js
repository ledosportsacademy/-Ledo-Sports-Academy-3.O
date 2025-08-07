const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['paid', 'pending', 'overdue'],
    required: true
  }
});

const weeklyFeeSchema = new mongoose.Schema({
  memberId: {
    type: Number,
    required: true
  },
  memberName: {
    type: String,
    required: true
  },
  payments: [paymentSchema]
}, { timestamps: true });

module.exports = mongoose.model('WeeklyFee', weeklyFeeSchema);