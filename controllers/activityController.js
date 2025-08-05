const Activity = require('../models/Activity');

// Get all activities
exports.getAllActivities = async (req, res) => {
  try {
    const { status, type, priority } = req.query;
    let query = {};
    
    // Apply filters if provided
    if (status) query.status = status;
    if (type) query.type = type;
    if (priority) query.priority = priority;
    
    const activities = await Activity.find(query).sort({ date: 1 });
    res.status(200).json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get recent activities
exports.getRecentActivities = async (req, res) => {
  try {
    const recentActivities = await Activity.find({ status: 'recent' })
      .sort({ date: -1 })
      .limit(5);
    res.status(200).json(recentActivities);
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get upcoming activities
exports.getUpcomingActivities = async (req, res) => {
  try {
    const upcomingActivities = await Activity.find({ status: 'upcoming' })
      .sort({ date: 1 })
      .limit(5);
    res.status(200).json(upcomingActivities);
  } catch (error) {
    console.error('Error fetching upcoming activities:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single activity by ID
exports.getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    
    res.status(200).json(activity);
  } catch (error) {
    console.error('Error fetching activity:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new activity
exports.createActivity = async (req, res) => {
  try {
    const { 
      title, 
      date, 
      time, 
      description, 
      image, 
      status, 
      type, 
      priority,
      redirectUrl,
      openNewTab 
    } = req.body;
    
    const newActivity = new Activity({
      title,
      date,
      time,
      description,
      image,
      status: status || 'upcoming',
      type: type || 'event',
      priority: priority || 'medium',
      redirectUrl: redirectUrl || '',
      openNewTab: openNewTab || false
    });
    
    const savedActivity = await newActivity.save();
    res.status(201).json(savedActivity);
  } catch (error) {
    console.error('Error creating activity:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update an activity
exports.updateActivity = async (req, res) => {
  try {
    const { 
      title, 
      date, 
      time, 
      description, 
      image, 
      status, 
      type, 
      priority,
      redirectUrl,
      openNewTab 
    } = req.body;
    
    const updatedActivity = await Activity.findByIdAndUpdate(
      req.params.id,
      {
        title,
        date,
        time,
        description,
        image,
        status,
        type,
        priority,
        redirectUrl,
        openNewTab,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedActivity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    
    res.status(200).json(updatedActivity);
  } catch (error) {
    console.error('Error updating activity:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete an activity
exports.deleteActivity = async (req, res) => {
  try {
    const deletedActivity = await Activity.findByIdAndDelete(req.params.id);
    
    if (!deletedActivity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    
    res.status(200).json({ message: 'Activity deleted successfully' });
  } catch (error) {
    console.error('Error deleting activity:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update activity status
exports.updateActivityStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['upcoming', 'recent', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    const updatedActivity = await Activity.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!updatedActivity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    
    res.status(200).json(updatedActivity);
  } catch (error) {
    console.error('Error updating activity status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};