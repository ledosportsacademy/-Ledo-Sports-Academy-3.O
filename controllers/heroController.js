const HeroSlide = require('../models/HeroSlide');

// Get all hero slides
exports.getAllHeroSlides = async (req, res) => {
  try {
    const heroSlides = await HeroSlide.find().sort({ order: 1 });
    res.status(200).json(heroSlides);
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single hero slide by ID
exports.getHeroSlideById = async (req, res) => {
  try {
    const heroSlide = await HeroSlide.findById(req.params.id);
    
    if (!heroSlide) {
      return res.status(404).json({ message: 'Hero slide not found' });
    }
    
    res.status(200).json(heroSlide);
  } catch (error) {
    console.error('Error fetching hero slide:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new hero slide
exports.createHeroSlide = async (req, res) => {
  try {
    const { 
      title, 
      subtitle, 
      description, 
      backgroundImage, 
      ctaText, 
      ctaLink, 
      redirectUrl, 
      openNewTab,
      order 
    } = req.body;
    
    // Find the highest order value to place new slide at the end
    let maxOrder = 0;
    if (!order) {
      const lastSlide = await HeroSlide.findOne().sort({ order: -1 });
      if (lastSlide) {
        maxOrder = lastSlide.order + 1;
      }
    }
    
    const newHeroSlide = new HeroSlide({
      title,
      subtitle,
      description,
      backgroundImage,
      ctaText,
      ctaLink,
      redirectUrl: redirectUrl || '',
      openNewTab: openNewTab || false,
      order: order || maxOrder
    });
    
    const savedHeroSlide = await newHeroSlide.save();
    res.status(201).json(savedHeroSlide);
  } catch (error) {
    console.error('Error creating hero slide:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a hero slide
exports.updateHeroSlide = async (req, res) => {
  try {
    const { 
      title, 
      subtitle, 
      description, 
      backgroundImage, 
      ctaText, 
      ctaLink, 
      redirectUrl, 
      openNewTab,
      order 
    } = req.body;
    
    const updatedHeroSlide = await HeroSlide.findByIdAndUpdate(
      req.params.id,
      {
        title,
        subtitle,
        description,
        backgroundImage,
        ctaText,
        ctaLink,
        redirectUrl,
        openNewTab,
        order,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedHeroSlide) {
      return res.status(404).json({ message: 'Hero slide not found' });
    }
    
    res.status(200).json(updatedHeroSlide);
  } catch (error) {
    console.error('Error updating hero slide:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a hero slide
exports.deleteHeroSlide = async (req, res) => {
  try {
    const deletedHeroSlide = await HeroSlide.findByIdAndDelete(req.params.id);
    
    if (!deletedHeroSlide) {
      return res.status(404).json({ message: 'Hero slide not found' });
    }
    
    // Reorder remaining slides
    const remainingSlides = await HeroSlide.find().sort({ order: 1 });
    for (let i = 0; i < remainingSlides.length; i++) {
      await HeroSlide.findByIdAndUpdate(remainingSlides[i]._id, { order: i });
    }
    
    res.status(200).json({ message: 'Hero slide deleted successfully' });
  } catch (error) {
    console.error('Error deleting hero slide:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update hero slides order
exports.updateHeroSlidesOrder = async (req, res) => {
  try {
    const { slides } = req.body;
    
    if (!Array.isArray(slides)) {
      return res.status(400).json({ message: 'Slides must be an array' });
    }
    
    // Update each slide's order
    for (const slide of slides) {
      await HeroSlide.findByIdAndUpdate(slide.id, { order: slide.order });
    }
    
    const updatedSlides = await HeroSlide.find().sort({ order: 1 });
    res.status(200).json(updatedSlides);
  } catch (error) {
    console.error('Error updating hero slides order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};