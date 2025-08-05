const Member = require('../models/Member');

// Get all members
exports.getAllMembers = async (req, res) => {
  try {
    const { active, role, search } = req.query;
    let query = {};
    
    // Apply filters if provided
    if (active !== undefined) {
      query.active = active === 'true';
    }
    
    if (role) {
      query.role = role;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } }
      ];
    }
    
    const members = await Member.find(query).sort({ name: 1 });
    res.status(200).json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single member by ID
exports.getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    
    res.status(200).json(member);
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new member
exports.createMember = async (req, res) => {
  try {
    const { 
      name, 
      contact, 
      phone, 
      joinDate, 
      role, 
      image,
      address,
      emergencyContact,
      dateOfBirth,
      active 
    } = req.body;
    
    const newMember = new Member({
      name,
      contact,
      phone,
      joinDate,
      role,
      image,
      address: address || '',
      emergencyContact: emergencyContact || '',
      dateOfBirth,
      active: active !== undefined ? active : true
    });
    
    const savedMember = await newMember.save();
    res.status(201).json(savedMember);
  } catch (error) {
    console.error('Error creating member:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a member
exports.updateMember = async (req, res) => {
  try {
    const { 
      name, 
      contact, 
      phone, 
      joinDate, 
      role, 
      image,
      address,
      emergencyContact,
      dateOfBirth,
      active 
    } = req.body;
    
    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      {
        name,
        contact,
        phone,
        joinDate,
        role,
        image,
        address,
        emergencyContact,
        dateOfBirth,
        active,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedMember) {
      return res.status(404).json({ message: 'Member not found' });
    }
    
    res.status(200).json(updatedMember);
  } catch (error) {
    console.error('Error updating member:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a member
exports.deleteMember = async (req, res) => {
  try {
    const deletedMember = await Member.findByIdAndDelete(req.params.id);
    
    if (!deletedMember) {
      return res.status(404).json({ message: 'Member not found' });
    }
    
    res.status(200).json({ message: 'Member deleted successfully' });
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update member active status
exports.updateMemberStatus = async (req, res) => {
  try {
    const { active } = req.body;
    
    if (active === undefined) {
      return res.status(400).json({ message: 'Active status is required' });
    }
    
    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      { active, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!updatedMember) {
      return res.status(404).json({ message: 'Member not found' });
    }
    
    res.status(200).json(updatedMember);
  } catch (error) {
    console.error('Error updating member status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get active members count
exports.getActiveMembersCount = async (req, res) => {
  try {
    const count = await Member.countDocuments({ active: true });
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error getting active members count:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};