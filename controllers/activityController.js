const Activity = require('../models/Activity');

// Get all activities
exports.getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find().sort({ id: 1 });
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get activities by status (upcoming or recent)
exports.getActivitiesByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    if (!['upcoming', 'recent'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status parameter. Must be "upcoming" or "recent".' });
    }
    
    const activities = await Activity.find({ status }).sort({ date: status === 'upcoming' ? 1 : -1 });
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single activity by ID
exports.getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findOne({ id: req.params.id });
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new activity
exports.createActivity = async (req, res) => {
  try {
    // Find the highest existing ID and increment by 1
    const highestIdActivity = await Activity.findOne().sort({ id: -1 });
    const newId = highestIdActivity ? highestIdActivity.id + 1 : 1;
    
    const newActivity = new Activity({
      ...req.body,
      id: newId
    });
    
    const savedActivity = await newActivity.save();
    res.status(201).json(savedActivity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an activity
exports.updateActivity = async (req, res) => {
  try {
    const updatedActivity = await Activity.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedActivity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    
    res.status(200).json(updatedActivity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an activity
exports.deleteActivity = async (req, res) => {
  try {
    const deletedActivity = await Activity.findOneAndDelete({ id: req.params.id });
    
    if (!deletedActivity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    
    res.status(200).json({ message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};