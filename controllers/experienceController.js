const Experience = require('../models/Experience');

// Get all experiences
exports.getAllExperiences = async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query;
    let query = {};
    
    // Apply category filter if provided
    if (category) {
      query.category = category;
    }
    
    // Apply date range filter if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const experiences = await Experience.find(query)
      .sort({ date: -1 })
      .populate('participants', 'name image role');
      
    res.status(200).json(experiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single experience by ID
exports.getExperienceById = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id)
      .populate('participants', 'name image role');
    
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    
    res.status(200).json(experience);
  } catch (error) {
    console.error('Error fetching experience:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new experience
exports.createExperience = async (req, res) => {
  try {
    const { 
      title, 
      date, 
      description, 
      images, 
      category, 
      location,
      participants,
      outcome,
      highlights 
    } = req.body;
    
    const newExperience = new Experience({
      title,
      date,
      description,
      images: images || [],
      category: category || 'Other',
      location,
      participants: participants || [],
      outcome,
      highlights
    });
    
    const savedExperience = await newExperience.save();
    
    // Populate participants for the response
    const populatedExperience = await Experience.findById(savedExperience._id)
      .populate('participants', 'name image role');
      
    res.status(201).json(populatedExperience);
  } catch (error) {
    console.error('Error creating experience:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update an experience
exports.updateExperience = async (req, res) => {
  try {
    const { 
      title, 
      date, 
      description, 
      images, 
      category, 
      location,
      participants,
      outcome,
      highlights 
    } = req.body;
    
    const updatedExperience = await Experience.findByIdAndUpdate(
      req.params.id,
      {
        title,
        date,
        description,
        images,
        category,
        location,
        participants,
        outcome,
        highlights,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    ).populate('participants', 'name image role');
    
    if (!updatedExperience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    
    res.status(200).json(updatedExperience);
  } catch (error) {
    console.error('Error updating experience:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete an experience
exports.deleteExperience = async (req, res) => {
  try {
    const deletedExperience = await Experience.findByIdAndDelete(req.params.id);
    
    if (!deletedExperience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    
    res.status(200).json({ message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Error deleting experience:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add images to an experience
exports.addExperienceImages = async (req, res) => {
  try {
    const { imageUrls } = req.body;
    
    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      return res.status(400).json({ message: 'Image URLs array is required' });
    }
    
    const experience = await Experience.findById(req.params.id);
    
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    
    experience.images = [...experience.images, ...imageUrls];
    experience.updatedAt = Date.now();
    
    await experience.save();
    
    res.status(200).json(experience);
  } catch (error) {
    console.error('Error adding images to experience:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Remove images from an experience
exports.removeExperienceImages = async (req, res) => {
  try {
    const { imageUrls } = req.body;
    
    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      return res.status(400).json({ message: 'Image URLs array is required' });
    }
    
    const experience = await Experience.findById(req.params.id);
    
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    
    experience.images = experience.images.filter(img => !imageUrls.includes(img));
    experience.updatedAt = Date.now();
    
    await experience.save();
    
    res.status(200).json(experience);
  } catch (error) {
    console.error('Error removing images from experience:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};