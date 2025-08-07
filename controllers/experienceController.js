const Experience = require('../models/Experience');

// Get all experiences
exports.getAllExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ date: -1 });
    res.status(200).json(experiences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single experience by ID
exports.getExperienceById = async (req, res) => {
  try {
    const experience = await Experience.findOne({ id: req.params.id });
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    res.status(200).json(experience);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new experience
exports.createExperience = async (req, res) => {
  try {
    // Find the highest existing ID and increment by 1
    const highestIdExperience = await Experience.findOne().sort({ id: -1 });
    const newId = highestIdExperience ? highestIdExperience.id + 1 : 1;
    
    const newExperience = new Experience({
      ...req.body,
      id: newId
    });
    
    const savedExperience = await newExperience.save();
    res.status(201).json(savedExperience);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an experience
exports.updateExperience = async (req, res) => {
  try {
    const updatedExperience = await Experience.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedExperience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    
    res.status(200).json(updatedExperience);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an experience
exports.deleteExperience = async (req, res) => {
  try {
    const deletedExperience = await Experience.findOneAndDelete({ id: req.params.id });
    
    if (!deletedExperience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    
    res.status(200).json({ message: 'Experience deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};