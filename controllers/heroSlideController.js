const HeroSlide = require('../models/HeroSlide');

// Get all hero slides
exports.getAllHeroSlides = async (req, res) => {
  try {
    const heroSlides = await HeroSlide.find().sort({ id: 1 });
    res.status(200).json(heroSlides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single hero slide by ID
exports.getHeroSlideById = async (req, res) => {
  try {
    const heroSlide = await HeroSlide.findOne({ id: req.params.id });
    if (!heroSlide) {
      return res.status(404).json({ message: 'Hero slide not found' });
    }
    res.status(200).json(heroSlide);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new hero slide
exports.createHeroSlide = async (req, res) => {
  try {
    // Find the highest existing ID and increment by 1
    const highestIdSlide = await HeroSlide.findOne().sort({ id: -1 });
    const newId = highestIdSlide ? highestIdSlide.id + 1 : 1;
    
    const newHeroSlide = new HeroSlide({
      ...req.body,
      id: newId
    });
    
    const savedHeroSlide = await newHeroSlide.save();
    res.status(201).json(savedHeroSlide);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a hero slide
exports.updateHeroSlide = async (req, res) => {
  try {
    const updatedHeroSlide = await HeroSlide.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedHeroSlide) {
      return res.status(404).json({ message: 'Hero slide not found' });
    }
    
    res.status(200).json(updatedHeroSlide);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a hero slide
exports.deleteHeroSlide = async (req, res) => {
  try {
    const deletedHeroSlide = await HeroSlide.findOneAndDelete({ id: req.params.id });
    
    if (!deletedHeroSlide) {
      return res.status(404).json({ message: 'Hero slide not found' });
    }
    
    res.status(200).json({ message: 'Hero slide deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};