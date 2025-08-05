// MongoDB Data Saving Example Script
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Import models
const Member = require('../models/Member');
const Donation = require('../models/Donation');
const Activity = require('../models/Activity');

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 15000,
      serverSelectionTimeoutMS: 15000
    });
    console.log('✅ MongoDB connected successfully!');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    return false;
  }
}

// Example: Create a new member
async function createMember(memberData) {
  try {
    console.log('Creating new member...');
    const newMember = new Member(memberData);
    const savedMember = await newMember.save();
    console.log('✅ Member created successfully:', savedMember._id);
    return savedMember;
  } catch (error) {
    console.error('❌ Error creating member:', error.message);
    if (error.name === 'ValidationError') {
      console.error('Validation errors:', Object.keys(error.errors).map(key => {
        return `${key}: ${error.errors[key].message}`;
      }));
    }
    return null;
  }
}

// Example: Create a new donation
async function createDonation(donationData) {
  try {
    console.log('Creating new donation...');
    const newDonation = new Donation(donationData);
    const savedDonation = await newDonation.save();
    console.log('✅ Donation created successfully:', savedDonation._id);
    return savedDonation;
  } catch (error) {
    console.error('❌ Error creating donation:', error.message);
    return null;
  }
}

// Example: Create a new activity
async function createActivity(activityData) {
  try {
    console.log('Creating new activity...');
    const newActivity = new Activity(activityData);
    const savedActivity = await newActivity.save();
    console.log('✅ Activity created successfully:', savedActivity._id);
    return savedActivity;
  } catch (error) {
    console.error('❌ Error creating activity:', error.message);
    return null;
  }
}

// Example: Update a member
async function updateMember(memberId, updateData) {
  try {
    console.log(`Updating member ${memberId}...`);
    const updatedMember = await Member.findByIdAndUpdate(
      memberId,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!updatedMember) {
      console.error('❌ Member not found');
      return null;
    }
    
    console.log('✅ Member updated successfully');
    return updatedMember;
  } catch (error) {
    console.error('❌ Error updating member:', error.message);
    return null;
  }
}

// Example: Delete a member
async function deleteMember(memberId) {
  try {
    console.log(`Deleting member ${memberId}...`);
    const deletedMember = await Member.findByIdAndDelete(memberId);
    
    if (!deletedMember) {
      console.error('❌ Member not found');
      return false;
    }
    
    console.log('✅ Member deleted successfully');
    return true;
  } catch (error) {
    console.error('❌ Error deleting member:', error.message);
    return false;
  }
}

// Example: Find members with query
async function findMembers(query = {}) {
  try {
    console.log('Finding members with query:', JSON.stringify(query));
    const members = await Member.find(query).sort({ name: 1 });
    console.log(`✅ Found ${members.length} members`);
    return members;
  } catch (error) {
    console.error('❌ Error finding members:', error.message);
    return [];
  }
}

// Example: Count documents
async function countDocuments(model, query = {}) {
  try {
    const count = await model.countDocuments(query);
    console.log(`✅ ${model.modelName} count:`, count);
    return count;
  } catch (error) {
    console.error(`❌ Error counting ${model.modelName}:`, error.message);
    return 0;
  }
}

// Example: Aggregate data
async function aggregateData(model, pipeline) {
  try {
    console.log(`Running aggregation on ${model.modelName}...`);
    const result = await model.aggregate(pipeline);
    console.log(`✅ Aggregation complete, returned ${result.length} results`);
    return result;
  } catch (error) {
    console.error(`❌ Error in aggregation:`, error.message);
    return [];
  }
}

// Run examples
async function runExamples() {
  // Connect to MongoDB
  const connected = await connectToMongoDB();
  if (!connected) {
    console.error('Cannot run examples without MongoDB connection');
    process.exit(1);
  }
  
  try {
    // Example 1: Create a new member
    const newMemberData = {
      name: 'John Doe',
      contact: 'john.doe@example.com',
      phone: '+1234567890',
      joinDate: new Date(),
      role: 'Player',
      image: '/uploads/members/placeholder.jpg',
      address: '123 Main St, City',
      emergencyContact: '+0987654321',
      dateOfBirth: new Date('1995-05-15'),
      active: true
    };
    
    const savedMember = await createMember(newMemberData);
    
    if (savedMember) {
      // Example 2: Update the member
      const updatedMember = await updateMember(savedMember._id, {
        role: 'Coach',
        address: '456 Oak St, Town'
      });
      
      // Example 3: Find active members
      const activeMembers = await findMembers({ active: true });
      console.log('Active members:', activeMembers.map(m => m.name));
      
      // Example 4: Count members by role
      const roleCounts = await aggregateData(Member, [
        { $group: { _id: '$role', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);
      console.log('Members by role:', roleCounts);
      
      // Example 5: Delete the member we created
      await deleteMember(savedMember._id);
    }
    
    // Example 6: Create a donation
    const donationData = {
      donorName: 'Jane Smith',
      amount: 500,
      date: new Date(),
      purpose: 'Equipment',
      contactInfo: 'jane.smith@example.com',
      paymentMethod: 'Bank Transfer',
      notes: 'Annual donation'
    };
    
    await createDonation(donationData);
    
    // Example 7: Create an activity
    const activityData = {
      title: 'Summer Training Camp',
      description: 'Intensive training for all ages',
      image: '/uploads/activities/camp.jpg',
      date: new Date('2023-07-01'),
      time: '9:00 AM - 5:00 PM',
      status: 'upcoming',
      type: 'training',
      priority: 'high',
      location: 'Main Stadium'
    };
    
    await createActivity(activityData);
    
    // Example 8: Count documents in each collection
    await countDocuments(Member);
    await countDocuments(Donation);
    await countDocuments(Activity);
    
    console.log('\n✅ All examples completed successfully!');
  } catch (error) {
    console.error('❌ Error running examples:', error);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the examples
runExamples();