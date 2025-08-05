const Gallery = require('../models/Gallery');

// Get all gallery items
exports.getAllGalleryItems = async (req, res) => {
  try {
    const { category, featured } = req.query;
    let query = {};
    
    // Apply category filter if provided
    if (category) {
      query.category = category;
    }
    
    // Apply featured filter if provided
    if (featured !== undefined) {
      query.featured = featured === 'true';
    }
    
    const galleryItems = await Gallery.find(query).sort({ date: -1 });
    res.status(200).json(galleryItems);
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get featured gallery items
exports.getFeaturedGalleryItems = async (req, res) => {
  try {
    const featuredItems = await Gallery.find({ featured: true })
      .sort({ featuredOrder: 1 })
      .limit(5);
      
    res.status(200).json(featuredItems);
  } catch (error) {
    console.error('Error fetching featured gallery items:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single gallery item by ID
exports.getGalleryItemById = async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);
    
    if (!galleryItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    
    res.status(200).json(galleryItem);
  } catch (error) {
    console.error('Error fetching gallery item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new gallery item
exports.createGalleryItem = async (req, res) => {
  try {
    const { 
      title, 
      imageUrl, 
      description, 
      date, 
      category, 
      featured,
      featuredOrder,
      tags 
    } = req.body;
    
    // If this is a featured item and no order is provided, place it at the end
    let order = featuredOrder;
    if (featured && !order) {
      const lastFeatured = await Gallery.findOne({ featured: true }).sort({ featuredOrder: -1 });
      order = lastFeatured ? lastFeatured.featuredOrder + 1 : 0;
    }
    
    const newGalleryItem = new Gallery({
      title,
      imageUrl,
      description,
      date: date || Date.now(),
      category: category || 'Other',
      featured: featured || false,
      featuredOrder: order || 0,
      tags: tags || []
    });
    
    const savedGalleryItem = await newGalleryItem.save();
    res.status(201).json(savedGalleryItem);
  } catch (error) {
    console.error('Error creating gallery item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a gallery item
exports.updateGalleryItem = async (req, res) => {
  try {
    const { 
      title, 
      imageUrl, 
      description, 
      date, 
      category, 
      featured,
      featuredOrder,
      tags 
    } = req.body;
    
    const updatedGalleryItem = await Gallery.findByIdAndUpdate(
      req.params.id,
      {
        title,
        imageUrl,
        description,
        date,
        category,
        featured,
        featuredOrder,
        tags,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedGalleryItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    
    res.status(200).json(updatedGalleryItem);
  } catch (error) {
    console.error('Error updating gallery item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a gallery item
exports.deleteGalleryItem = async (req, res) => {
  try {
    const deletedGalleryItem = await Gallery.findByIdAndDelete(req.params.id);
    
    if (!deletedGalleryItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    
    // If this was a featured item, reorder remaining featured items
    if (deletedGalleryItem.featured) {
      const featuredItems = await Gallery.find({ featured: true }).sort({ featuredOrder: 1 });
      for (let i = 0; i < featuredItems.length; i++) {
        await Gallery.findByIdAndUpdate(featuredItems[i]._id, { featuredOrder: i });
      }
    }
    
    res.status(200).json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update featured gallery items order
exports.updateFeaturedItemsOrder = async (req, res) => {
  try {
    const { items } = req.body;
    
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'Items must be an array' });
    }
    
    // Update each item's featured order
    for (const item of items) {
      await Gallery.findByIdAndUpdate(item.id, { 
        featuredOrder: item.order,
        featured: true
      });
    }
    
    const updatedItems = await Gallery.find({ featured: true }).sort({ featuredOrder: 1 });
    res.status(200).json(updatedItems);
  } catch (error) {
    console.error('Error updating featured gallery items order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Toggle featured status
exports.toggleFeaturedStatus = async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);
    
    if (!galleryItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    
    // Toggle featured status
    galleryItem.featured = !galleryItem.featured;
    
    // If now featured, assign order at the end
    if (galleryItem.featured) {
      const lastFeatured = await Gallery.findOne({ featured: true }).sort({ featuredOrder: -1 });
      galleryItem.featuredOrder = lastFeatured ? lastFeatured.featuredOrder + 1 : 0;
    }
    
    await galleryItem.save();
    
    res.status(200).json(galleryItem);
  } catch (error) {
    console.error('Error toggling featured status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};