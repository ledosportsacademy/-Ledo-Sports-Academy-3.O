const mongoose = require('mongoose');

const HeroSlideSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  backgroundImage: {
    type: String,
    required: true,
    trim: true
  },
  ctaText: {
    type: String,
    required: true,
    trim: true
  },
  ctaLink: {
    type: String,
    required: true,
    trim: true
  },
  redirectUrl: {
    type: String,
    default: '',
    trim: true
  },
  openNewTab: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
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

module.exports = mongoose.model('HeroSlide', HeroSlideSchema);