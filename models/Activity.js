const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'recent'],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);