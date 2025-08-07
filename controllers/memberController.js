const Member = require('../models/Member');

// Get all members
exports.getAllMembers = async (req, res) => {
  try {
    const members = await Member.find().sort({ id: 1 });
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single member by ID
exports.getMemberById = async (req, res) => {
  try {
    const member = await Member.findOne({ id: req.params.id });
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new member
exports.createMember = async (req, res) => {
  try {
    // Find the highest existing ID and increment by 1
    const highestIdMember = await Member.findOne().sort({ id: -1 });
    const newId = highestIdMember ? highestIdMember.id + 1 : 1;
    
    const newMember = new Member({
      ...req.body,
      id: newId
    });
    
    const savedMember = await newMember.save();
    res.status(201).json(savedMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a member
exports.updateMember = async (req, res) => {
  try {
    const updatedMember = await Member.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedMember) {
      return res.status(404).json({ message: 'Member not found' });
    }
    
    res.status(200).json(updatedMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a member
exports.deleteMember = async (req, res) => {
  try {
    const deletedMember = await Member.findOneAndDelete({ id: req.params.id });
    
    if (!deletedMember) {
      return res.status(404).json({ message: 'Member not found' });
    }
    
    res.status(200).json({ message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search members by name
exports.searchMembers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const members = await Member.find({
      name: { $regex: query, $options: 'i' }
    }).sort({ id: 1 });
    
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};