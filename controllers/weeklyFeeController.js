const WeeklyFee = require('../models/WeeklyFee');
const Member = require('../models/Member');

// Get all weekly fees
exports.getAllWeeklyFees = async (req, res) => {
  try {
    const { memberId, startDate, endDate, paymentStatus } = req.query;
    let query = {};
    
    // Apply member filter if provided
    if (memberId) {
      query.member = memberId;
    }
    
    // Apply date range filter if provided
    if (startDate || endDate) {
      query.weekStartDate = {};
      if (startDate) query.weekStartDate.$gte = new Date(startDate);
      if (endDate) query.weekStartDate.$lte = new Date(endDate);
    }
    
    // Apply payment status filter if provided
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }
    
    const weeklyFees = await WeeklyFee.find(query)
      .sort({ weekStartDate: -1 })
      .populate('member', 'name image role');
      
    res.status(200).json(weeklyFees);
  } catch (error) {
    console.error('Error fetching weekly fees:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get weekly fees by member
exports.getWeeklyFeesByMember = async (req, res) => {
  try {
    const memberId = req.params.memberId;
    
    const weeklyFees = await WeeklyFee.find({ member: memberId })
      .sort({ weekStartDate: -1 })
      .populate('member', 'name image role');
      
    res.status(200).json(weeklyFees);
  } catch (error) {
    console.error('Error fetching member weekly fees:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single weekly fee by ID
exports.getWeeklyFeeById = async (req, res) => {
  try {
    const weeklyFee = await WeeklyFee.findById(req.params.id)
      .populate('member', 'name image role');
    
    if (!weeklyFee) {
      return res.status(404).json({ message: 'Weekly fee record not found' });
    }
    
    res.status(200).json(weeklyFee);
  } catch (error) {
    console.error('Error fetching weekly fee:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new weekly fee
exports.createWeeklyFee = async (req, res) => {
  try {
    const { 
      member, 
      weekStartDate, 
      weekEndDate, 
      amount, 
      paymentDate, 
      paymentStatus,
      paymentMethod,
      notes,
      collectedBy 
    } = req.body;
    
    // Check if member exists
    const memberExists = await Member.findById(member);
    if (!memberExists) {
      return res.status(404).json({ message: 'Member not found' });
    }
    
    // Check if a fee record already exists for this member and week
    const existingFee = await WeeklyFee.findOne({
      member,
      weekStartDate: new Date(weekStartDate),
      weekEndDate: new Date(weekEndDate)
    });
    
    if (existingFee) {
      return res.status(400).json({ 
        message: 'A fee record already exists for this member and week' 
      });
    }
    
    const newWeeklyFee = new WeeklyFee({
      member,
      weekStartDate,
      weekEndDate,
      amount: amount || 20,
      paymentDate: paymentDate || Date.now(),
      paymentStatus: paymentStatus || 'Paid',
      paymentMethod: paymentMethod || 'Cash',
      notes,
      collectedBy
    });
    
    const savedWeeklyFee = await newWeeklyFee.save();
    
    // Populate member for the response
    const populatedWeeklyFee = await WeeklyFee.findById(savedWeeklyFee._id)
      .populate('member', 'name image role');
      
    res.status(201).json(populatedWeeklyFee);
  } catch (error) {
    console.error('Error creating weekly fee:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a weekly fee
exports.updateWeeklyFee = async (req, res) => {
  try {
    const { 
      amount, 
      paymentDate, 
      paymentStatus,
      paymentMethod,
      notes,
      collectedBy 
    } = req.body;
    
    const updatedWeeklyFee = await WeeklyFee.findByIdAndUpdate(
      req.params.id,
      {
        amount,
        paymentDate,
        paymentStatus,
        paymentMethod,
        notes,
        collectedBy,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    ).populate('member', 'name image role');
    
    if (!updatedWeeklyFee) {
      return res.status(404).json({ message: 'Weekly fee record not found' });
    }
    
    res.status(200).json(updatedWeeklyFee);
  } catch (error) {
    console.error('Error updating weekly fee:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a weekly fee
exports.deleteWeeklyFee = async (req, res) => {
  try {
    const deletedWeeklyFee = await WeeklyFee.findByIdAndDelete(req.params.id);
    
    if (!deletedWeeklyFee) {
      return res.status(404).json({ message: 'Weekly fee record not found' });
    }
    
    res.status(200).json({ message: 'Weekly fee record deleted successfully' });
  } catch (error) {
    console.error('Error deleting weekly fee:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get weekly fee statistics
exports.getWeeklyFeeStats = async (req, res) => {
  try {
    const totalCollected = await WeeklyFee.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const feesByMonth = await WeeklyFee.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$weekStartDate' } },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    const pendingFees = await WeeklyFee.aggregate([
      { $match: { paymentStatus: 'Pending' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);
    
    res.status(200).json({
      totalCollected: totalCollected.length > 0 ? totalCollected[0].total : 0,
      feesByMonth,
      pendingFees: pendingFees.length > 0 ? {
        total: pendingFees[0].total,
        count: pendingFees[0].count
      } : { total: 0, count: 0 }
    });
  } catch (error) {
    console.error('Error getting weekly fee statistics:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Batch create weekly fees for all active members
exports.createWeeklyFeesForAllMembers = async (req, res) => {
  try {
    const { weekStartDate, weekEndDate, collectedBy } = req.body;
    
    if (!weekStartDate || !weekEndDate) {
      return res.status(400).json({ message: 'Week start and end dates are required' });
    }
    
    // Get all active members
    const activeMembers = await Member.find({ active: true });
    
    if (activeMembers.length === 0) {
      return res.status(404).json({ message: 'No active members found' });
    }
    
    const weekStart = new Date(weekStartDate);
    const weekEnd = new Date(weekEndDate);
    
    // Check for existing fee records for this week
    const existingFees = await WeeklyFee.find({
      weekStartDate: weekStart,
      weekEndDate: weekEnd
    });
    
    const existingMemberIds = existingFees.map(fee => fee.member.toString());
    
    // Create fee records for members who don't have one for this week
    const newFeeRecords = [];
    
    for (const member of activeMembers) {
      if (!existingMemberIds.includes(member._id.toString())) {
        newFeeRecords.push({
          member: member._id,
          weekStartDate: weekStart,
          weekEndDate: weekEnd,
          amount: 20,
          paymentStatus: 'Pending',
          paymentMethod: 'Cash',
          collectedBy
        });
      }
    }
    
    if (newFeeRecords.length === 0) {
      return res.status(400).json({ 
        message: 'Fee records already exist for all active members for this week' 
      });
    }
    
    const savedFees = await WeeklyFee.insertMany(newFeeRecords);
    
    res.status(201).json({
      message: `Created ${savedFees.length} new weekly fee records`,
      count: savedFees.length
    });
  } catch (error) {
    console.error('Error batch creating weekly fees:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};